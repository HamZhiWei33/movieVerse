import Movie from "../models/movie.model.js";
import Genre from "../models/genre.model.js";
import Region from "../models/region.model.js";
import Like from "../models/like.model.js";
import Watchlist from "../models/watchlist.model.js";
import Review from "../models/review.model.js";

import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Helper function to enrich movies with likes/watchlist data
async function enrichMovies(movies, user) {
  const movieIds = movies.map(m => m._id.toString());

  const likes = await Like.find({ movieId: { $in: movieIds } });
  const likeMap = {};
  const userLikedSet = new Set();

  // Fetch user's watchlist once if user is authenticated
  let userWatchlistSet = new Set();
  if (user) {
    const userWatchlist = await Watchlist.findOne({ userId: user._id }).lean();
    if (userWatchlist && userWatchlist.movies) {
      userWatchlistSet = new Set(userWatchlist.movies.map(id => id.toString()));
    }
  }

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
      ...m, // Ensure this is a plain JavaScript object if using .lean()
      likeCount: likeMap[id] || 0,
      liked: userLikedSet.has(id),
      watchlisted: userWatchlistSet.has(id) // Use the fetched watchlist
    };
  });
}

// @desc    Get all movies with optional pagination
// @route   GET /api/movies
// @access  Public
export const getAllMovies = async (req, res) => {
  try {
    const { page = 1, limit = 20, genres, regions, years, query: searchQuery } = req.query; // Renamed 'query' to 'searchQuery' to avoid conflict with Mongoose 'query' object
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const dbQuery = { trailerUrl: { $exists: true, $ne: "" } }; // Base query: only movies with trailers

    // Apply genre filter
    if (genres) {
      const genreNames = genres.split(',').map(g => decodeURIComponent(g.trim()));
      // Assuming your Movie model's 'genre' field stores IDs and you have a Genre model for name-to-ID lookup
      const genreObjects = await Genre.find({ name: { $in: genreNames } }).select('id').lean();
      const genreIds = genreObjects.map(g => g.id); // Assuming 'id' is the TMDB ID
      if (genreIds.length > 0) {
        dbQuery.genre = { $in: genreIds };
      } else {
        // If no matching genres found, return empty results early
        return res.status(200).json({
          success: true,
          data: [],
          pagination: { currentPage: 1, totalPages: 0, totalResults: 0, hasMore: false }
        });
      }
    }

    // Apply region filter
    if (regions) {
      const regionCodes = regions.split(',').map(r => decodeURIComponent(r.trim()));
      dbQuery.region = { $in: regionCodes };
    }

    // Apply year filter
    if (years) {
      const yearNumbers = years.split(',').map(y => parseInt(y.trim())).filter(y => !isNaN(y));
      if (yearNumbers.length > 0) {
        dbQuery.year = { $in: yearNumbers };
      } else {
        // If no valid years, return empty results early
        return res.status(200).json({
          success: true,
          data: [],
          pagination: { currentPage: 1, totalPages: 0, totalResults: 0, hasMore: false }
        });
      }
    }

    // Apply search query filter
    if (searchQuery) {
      const regex = new RegExp(decodeURIComponent(searchQuery), 'i'); // Case-insensitive search
      dbQuery.$or = [
        { title: regex },
        { overview: regex } // Assuming overview field exists in your Movie model
      ];
    }


    // First try to get from database
    const [movies, total] = await Promise.all([
      Movie.find(dbQuery) // Use the constructed dbQuery here
        .sort({ releaseDate: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(), // Use .lean() for plain JS objects for better performance
      Movie.countDocuments(dbQuery) // Use the constructed dbQuery here for total count
    ]);

    // Determine if more movies exist in the DB after applying filters
    const hasMoreInDB = (parseInt(page) * parseInt(limit)) < total;

    if ((genres || regions || years || searchQuery) && movies.length === 0 && total === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        pagination: { currentPage: 1, totalPages: 0, totalResults: 0, hasMore: false }
      });
    }

    const areFiltersActive = genres || regions || years || searchQuery;
    const needsTMDBFallback = movies.length < limit && !areFiltersActive; // Only fallback if no filters

    if (needsTMDBFallback) {
      const needed = parseInt(limit) - movies.length;
      // Adjust TMDB page calculation to continue from where DB left off
      const tmdbPage = Math.max(1, Math.ceil((skip + movies.length) / 20) + 1); // +1 to ensure next page if current page finished

      try {
        console.log(`Fetching ${needed} more from TMDB page ${tmdbPage}`);
        const { data } = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
          params: {
            api_key: TMDB_API_KEY,
            page: tmdbPage,
            language: 'en-US'
          }
        });

        // Filter out movies already in DB (by tmdbId) to avoid duplicates when combining
        const existingTmdbIds = new Set(movies.map(m => m.tmdbId).filter(Boolean));
        const newTmdbMovies = data.results.filter(tmdbMovie => !existingTmdbIds.has(tmdbMovie.id));

        const processedMovies = [];
        for (const tmdbMovie of newTmdbMovies) {
          if (processedMovies.length >= needed) break; // Stop if we have enough
          try {
            const savedMovie = await processTMDBMovie(tmdbMovie); // This saves to DB
            if (savedMovie && savedMovie.trailerUrl) { // Only add if it has a trailer
              processedMovies.push(savedMovie);
            }
          } catch (err) {
            console.error(`Error processing TMDB movie ${tmdbMovie.id}:`, err);
          }
        }

        const combinedMovies = [...movies, ...processedMovies];
        const enrichedCombinedMovies = await enrichMovies(combinedMovies, req.user);

        // Re-calculate hasMore based on combined results if TMDB contributed
        const finalTotal = total + processedMovies.length;
        const finalHasMore = (parseInt(page) * parseInt(limit)) < finalTotal;

        return res.status(200).json({
          success: true,
          data: enrichedCombinedMovies,
          pagination: {
            currentPage: Number(page),
            totalPages: Math.ceil(finalTotal / limit),
            totalResults: finalTotal,
            hasMore: finalHasMore
          }
        });
      } catch (tmdbError) {
        console.error('TMDB fallback failed:', tmdbError);
        // If TMDB fallback fails, proceed with whatever was fetched from DB
      }
    }


    const enrichedMovies = await enrichMovies(movies, req.user);

    return res.status(200).json({
      success: true,
      data: enrichedMovies,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalResults: total,
        hasMore: hasMoreInDB // This now correctly reflects if more are in DB given filters
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
    let years = await Movie.distinct("year");

    // Sort years in descending order (newest first)
    years = years.sort((a, b) => b - a);

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
      .sort({ releaseDate: -1 })
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
      data: processedMovies
        .slice(0, limit)
        .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)),
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
