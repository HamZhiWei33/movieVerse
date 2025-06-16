import Movie from "../models/movie.model.js";
import Genre from "../models/genre.model.js";
import Region from "../models/region.model.js";
import Like from "../models/like.model.js";
import Watchlist from "../models/watchlist.model.js";
import Review from "../models/review.model.js";

import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// @desc    Get all movies with optional pagination
// @route   GET /api/movies
// @access  Public
export const getAllMovies = async (req, res) => {
  try {
    const { page = 1, limit = 20, genres, regions, years, fallback = 'true' } = req.query;
    const skip = (page - 1) * limit;

    const query = { trailerUrl: { $exists: true, $ne: "" } };

    if (genres) query.genre = { $in: genres.split(',').map(Number) };
    if (regions) query.region = { $in: regions.split(',') };
    if (years) query.year = { $in: years.split(',').map(Number) };

    // First try to get from database
    const [movies, total] = await Promise.all([
      Movie.find(query)
        .skip(skip)
        .limit(limit)
        .lean(),
      Movie.countDocuments(query)
    ]);

    // Calculate if we need more movies
    const hasMoreInDB = (page * limit) < total;
    const needsMore = movies.length < limit && fallback === 'true';

    // If we don't have enough movies and fallback is enabled
    if (needsMore) {
      const needed = limit - movies.length;
      const tmdbPage = Math.max(1, Math.ceil((skip + movies.length) / 20));

      try {
        // Fetch from TMDB
        const { data } = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
          params: {
            api_key: TMDB_API_KEY,
            page: tmdbPage,
            language: 'en-US'
          }
        });

        // Process and store TMDB movies
        const tmdbMovies = data.results.slice(0, needed);
        const processedMovies = [];

        for (const tmdbMovie of tmdbMovies) {
          try {
            const savedMovie = await processTMDBMovie(tmdbMovie);
            if (savedMovie) {
              processedMovies.push(savedMovie);
            }
          } catch (err) {
            console.error(`Error processing TMDB movie ${tmdbMovie.id}:`, err);
          }
        }

        // Combine results
        const combinedMovies = [...movies, ...processedMovies];

        // Enrich combined results
        const enrichedMovies = await enrichMovies(combinedMovies, req.user);

        return res.status(200).json({
          success: true,
          data: enrichedMovies,
          pagination: {
            currentPage: Number(page),
            totalPages: Math.ceil((total + processedMovies.length) / limit),
            totalResults: total + processedMovies.length,
            hasMore: true // TMDB has virtually infinite movies
          }
        });
      } catch (tmdbError) {
        console.error('TMDB fallback failed:', tmdbError);
        // Continue with just DB results if TMDB fails
      }
    }

    // Enrich and return results
    const enrichedMovies = await enrichMovies(movies, req.user);

    res.status(200).json({
      success: true,
      data: enrichedMovies,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalResults: total,
        hasMore: hasMoreInDB
      }
    });

  } catch (error) {
    console.error("Error getting all movies:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch movies."
    });
  }
};

// Helper function to enrich movies with likes/watchlist data
async function enrichMovies(movies, user) {
  const movieIds = movies.map(m => m._id.toString());

  const likes = await Like.find({ movieId: { $in: movieIds } });
  const likeMap = {};
  const userLikedSet = new Set();
  const watchlistSet = new Set(user?.watchlist?.map(id => id.toString()) || []);

  likes.forEach(like => {
    const id = like.movieId.toString();
    likeMap[id] = (likeMap[id] || 0) + 1;
    if (user && like.userId.toString() === user._id.toString()) {
      userLikedSet.add(id);
    }
  });

  return movies.map(m => {
    const id = m._id.toString();
    return {
      ...m,
      likeCount: likeMap[id] || 0,
      liked: userLikedSet.has(id),
      watchlisted: watchlistSet.has(id)
    };
  });
}

// @desc    Get single movie by ID with reviews
// @route   GET /api/movies/:id
// @access  Public
export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id)
      .select('title posterUrl rating year genre description region duration trailerUrl director actors')
      .lean();

    if (!movie) {
      return res.status(404).json({ success: false, message: "Movie not found." });
    }

    // Genre names
    const genres = await Genre.find({ id: { $in: movie.genre } })
      .select("name -_id")
      .sort({ name: 1 })
      .lean();

    // Like count
    const likes = await Like.find({ movieId: movie._id }).lean();
    const likeCount = likes.length;

    const user = req.user;
    const movieIdStr = movie._id.toString();

    const liked = user ? likes.some(like => like.userId.toString() === user._id.toString()) : false;
    const watchlisted = user?.watchlist?.some(id => id.toString() === movieIdStr) || false;

    res.status(200).json({
      success: true,
      data: {
        ...movie,
        genre: genres.map(g => g.name),
        likeCount,
        liked,
        watchlisted
      }
    });
  } catch (error) {
    console.error("Error fetching movie by ID:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch movie."
    });
  }
};

// @desc    Get distinct filter options (genres, regions, years)
// @route   GET /api/movies/filters
// @access  Public
export const getFilterOptions = async (req, res) => {
  try {
    const genreIds = await Movie.distinct("genre");
    const regionCodes = await Movie.distinct("region");
    const years = await Movie.distinct("year");

    // Find genres with matching IDs
    const genres = await Genre.find({ id: { $in: genreIds } })
      .select("id name -_id")
      .sort({ name: 1 })
      .lean();

    // Find region with matching codes
    const regions = await Region.find({ code: { $in: regionCodes } })
      .select("code name -_id")
      .sort({ name: 1 })
      .lean();

    res.status(200).json({
      success: true,
      data: {
        genres,
        regions,
        years
      }
    });
  } catch (error) {
    console.error("Error fetching filter options:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch filter options."
    });
  }
};


// @desc    Get all genres
// @route   GET /api/movies/genres
// @access  Public
export const getAllGenres = async (req, res) => {
  try {
    const genres = await Genre.find()
      .select('id name')
      .sort({ name: 1 })
      .lean();

    res.status(200).json({
      success: true,
      count: genres.length,
      data: genres
    });
  } catch (error) {
    console.error("Error getting all genres:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch genres."
    });
  }
};

// @desc    Get all regions
// @route   GET /api/movies/regions
// @access  Public
export const getAllRegions = async (req, res) => {
  try {
    const regions = await Region.find()
      .select("code name -_id")
      .sort({ name: 1 })
      .lean();

    res.status(200).json({
      success: true,
      count: regions.length,
      data: regions
    });
  } catch (error) {
    console.error("Error fetching regions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch regions"
    });
  }
};


// @desc    Filter movies with pagination
// @route   GET /api/movies/filter
// @access  Public
export const filterMovies = async (req, res) => {
  try {
    const { genre, year, rating, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const query = {};

    if (genre) {
      query.genre = { $in: genre.split(',').map(g => parseInt(g)) };
    }

    if (year) {
      query.year = { $in: year.split(',').map(y => parseInt(y)) };
    }

    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }

    // Only include movies with trailerUrl
    query.trailerUrl = { $exists: true, $ne: "" };

    const movies = await Movie.find(query)
      .select('title posterUrl rating year genre description region duration trailerUrl')
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Movie.countDocuments(query);

    res.status(200).json({
      success: true,
      count: movies.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      data: movies
    });
  } catch (error) {
    console.error("Error filtering movies:", error);
    res.status(500).json({
      success: false,
      message: "Failed to filter movies."
    });
  }
};

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// @desc    Fetch movies from TMDB and store in DB
// @route   GET /api/movies/tmdb
// @access  Public
// In your movie.controller.js
export const fetchFromTMDB = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    let processedMovies = [];
    let currentPage = page;
    let attempts = 0;
    const maxAttempts = 5; // Increased max attempts to find enough movies with trailers

    // Keep trying until we get enough movies with trailers or reach max attempts
    while (processedMovies.length < limit && attempts < maxAttempts) {
      const { data } = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
        params: {
          api_key: TMDB_API_KEY,
          page: currentPage,
          language: 'en-US'
        }
      });

      // Process movies sequentially to avoid API rate limiting
      for (const tmdbMovie of data.results) {
        if (processedMovies.length >= limit) break;
        
        try {
          const movie = await processTMDBMovie(tmdbMovie);
          if (movie?.trailerUrl) {
            processedMovies.push(movie);
          }
        } catch (err) {
          console.error(`Error processing movie ${tmdbMovie.id}:`, err);
        }
      }

      currentPage++;
      attempts++;
      
      // Add a small delay between pages to avoid rate limiting
      if (processedMovies.length < limit && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // If we couldn't find enough movies with trailers
    if (processedMovies.length < limit) {
      console.warn(`Only found ${processedMovies.length} movies with trailers out of requested ${limit}`);
    }

    res.status(200).json({
      success: true,
      data: processedMovies.slice(0, limit),
      pagination: {
        hasMore: true // TMDB has virtually infinite pages
      }
    });

  } catch (error) {
    console.error('TMDB proxy error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch from TMDB'
    });
  }
};

async function processTMDBMovie(tmdbMovie) {
  if (!tmdbMovie?.id) {
    throw new Error('Invalid TMDB movie data');
  }

  // First check if we already have this movie with a trailer in our database
  const existingMovie = await Movie.findOne({
    tmdbId: tmdbMovie.id,
    trailerUrl: { $exists: true, $ne: "" }
  }).lean();

  if (existingMovie) {
    console.log(`Using existing movie ${tmdbMovie.id} with trailer`);
    return existingMovie;
  }

  try {
    // First fetch videos to check for trailer existence
    const videoResponse = await axios.get(
      `${TMDB_BASE_URL}/movie/${tmdbMovie.id}/videos`,
      { params: { api_key: TMDB_API_KEY } }
    );

    const trailer = (videoResponse.data.results || [])
      .find(v => v.site === "YouTube" && v.type === "Trailer");

    if (!trailer) {
      console.log(`No trailer found for movie ${tmdbMovie.id}`);
      return null;
    }

    const trailerUrl = `https://www.youtube.com/watch?v=${trailer.key}`;

    // Now fetch other details in parallel
    const [detailResponse, releaseResponse, creditResponse] = await Promise.all([
      axios.get(`${TMDB_BASE_URL}/movie/${tmdbMovie.id}`, { params: { api_key: TMDB_API_KEY } }),
      axios.get(`${TMDB_BASE_URL}/movie/${tmdbMovie.id}/release_dates`, { params: { api_key: TMDB_API_KEY } }),
      axios.get(`${TMDB_BASE_URL}/movie/${tmdbMovie.id}/credits`, { params: { api_key: TMDB_API_KEY } })
    ]);

    // Process movie details
    const detailData = detailResponse.data;
    const runtime = parseInt(detailData.runtime) || 0;
    const duration = `${Math.floor(runtime / 60)}h ${runtime % 60}min`;

    // Process genres
    const genreIds = (detailData.genres || [])
      .map(g => Number(g.id))
      .filter(id => !isNaN(id) && id !== 0);

    // Process region
    let region = "US";
    const releaseResults = releaseResponse.data.results || [];
    const primary = releaseResults.find(r => r.iso_3166_1 === "US") || releaseResults[0];
    region = primary?.iso_3166_1 || region;

    // Process credits
    const crew = creditResponse.data.crew || [];
    const cast = creditResponse.data.cast || [];
    const director = crew.find(p => p.job === "Director")?.name || "Unknown";
    const actors = cast.slice(0, 5).map(a => a.name).filter(Boolean);

    // Build movie data object - SET RATING TO 0 FOR TMDB MOVIES
    const movieData = {
      tmdbId: tmdbMovie.id,
      title: tmdbMovie.title || "Unknown Title",
      year: tmdbMovie.release_date ? new Date(tmdbMovie.release_date).getFullYear() : 0,
      genre: genreIds.length ? genreIds : [18], // Default to "Drama"
      director,
      actors,
      posterUrl: tmdbMovie.poster_path
        ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`
        : "/default-poster.jpg",
      trailerUrl,
      description: tmdbMovie.overview || "No description available",
      duration,
      releaseDate: tmdbMovie.release_date || null,
      region,
      rating: 0, // Explicitly set rating to 0 for TMDB movies
      hasTrailer: true,
      lastUpdated: new Date()
    };

    // Save to database
    const savedMovie = await Movie.findOneAndUpdate(
      { tmdbId: tmdbMovie.id },
      { $setOnInsert: movieData },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    );

    return savedMovie.toObject();

  } catch (error) {
    console.error(`Error processing TMDB movie ${tmdbMovie.id}:`, error);
    return null;
  }
}

// - getTopRatedMovies(req, res)

// tzw
// - getNewReleases(req, res)
