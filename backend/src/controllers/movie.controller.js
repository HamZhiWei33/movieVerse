import Movie from "../models/movie.model.js";
import Genre from "../models/genre.model.js";
import Region from "../models/region.model.js";
import Like from "../models/like.model.js";
import Watchlist from "../models/watchlist.model.js";
import User from "../models/user.model.js";
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

// @desc      Get all movies with optional pagination
// @route     GET /api/movies
// @access    Public
export const getAllMovies = async (req, res) => {
  try {
    const { page = 1, limit = 20, genres, regions, years, query: searchQuery } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const dbQuery = { trailerUrl: { $exists: true, $ne: "" } };

    // Filters for MongoDB
    let genreIds = [];
    if (genres) {
      const genreNames = genres.split(',').map(g => decodeURIComponent(g.trim()));
      const genreObjects = await Genre.find({ name: { $in: genreNames } }).select('id').lean();
      genreIds = genreObjects.map(g => g.id);
      if (genreIds.length) dbQuery.genre = { $in: genreIds };
    }

    if (regions) {
      const regionCodes = regions.split(',').map(r => decodeURIComponent(r.trim()));
      dbQuery.region = { $in: regionCodes };
    }

    if (years) {
      const yearNums = years.split(',').map(y => parseInt(y.trim())).filter(n => !isNaN(n));
      if (yearNums.length) dbQuery.year = { $in: yearNums };
    }

    if (searchQuery) {
      const regex = new RegExp(decodeURIComponent(searchQuery), 'i');
      dbQuery.$or = [ { title: regex }, { overview: regex } ];
    }

    const [movies, total] = await Promise.all([
      Movie.find(dbQuery).sort({ releaseDate: -1 }).skip(skip).limit(Number(limit)).lean(),
      Movie.countDocuments(dbQuery)
    ]);

    const hasMoreInDB = (parseInt(page) * parseInt(limit)) < total;
    const needsTMDBFallback = movies.length < limit;

    // TMDB fallback - always attempt if we have filters, even if we got enough from DB
    // This ensures we can keep loading more pages from TMDB
    if (needsTMDBFallback || genres || regions || years || searchQuery) {
      const needed = parseInt(limit) - movies.length;
      const tmdbPage = Math.max(1, Math.floor(skip / 20) + 1); // More accurate page calculation for TMDB

      const tmdbParams = {
        api_key: TMDB_API_KEY,
        language: 'en-US',
        page: tmdbPage,
        sort_by: 'popularity.desc', // Already set to fetch popular movies
        include_adult: false // <--- Ensures TMDB API filters adult content at the source
      };

      // Apply TMDB-supported filters
      if (genreIds.length) tmdbParams.with_genres = genreIds.join(',');
      
      if (years) {
        const yearNums = years.split(',').map(y => parseInt(y.trim())).filter(n => !isNaN(n));
        if (yearNums.length === 1) {
          tmdbParams.primary_release_year = yearNums[0];
        } else if (yearNums.length > 1) {
          // For multiple years, use release_date.gte/lte
          const minYear = Math.min(...yearNums);
          const maxYear = Math.max(...yearNums);
          tmdbParams['primary_release_date.gte'] = `${minYear}-01-01`;
          tmdbParams['primary_release_date.lte'] = `${maxYear}-12-31`;
        }
      }
      
      // Added region filtering for TMDB
      if (regions) {
        // TMDB uses 'with_origin_country' for origin countries
        tmdbParams.with_origin_country = regions.split(',').map(r => decodeURIComponent(r.trim())).join(',');
      }
      
      if (searchQuery) tmdbParams.query = decodeURIComponent(searchQuery);

      let processedMovies = [];
      try {
        const tmdbUrl = searchQuery
          ? `${TMDB_BASE_URL}/search/movie`
          : `${TMDB_BASE_URL}/discover/movie`;

        const { data } = await axios.get(tmdbUrl, { params: tmdbParams });

        const existingTmdb = new Set(movies.map(m => m.tmdbId).filter(Boolean));
        const toProcess = data.results.filter(m => !existingTmdb.has(m.id));

        for (const tmdbMovie of toProcess) {
          if (processedMovies.length >= needed) break;

          const saved = await processTMDBMovie(tmdbMovie);
          if (!saved || !saved.trailerUrl) continue;

          // Re-apply region filter after processing, as TMDB's with_origin_country might be broad
          if (regions) {
            const allowedRegions = regions.split(',').map(r => decodeURIComponent(r.trim()));
            if (!allowedRegions.includes(saved.region)) continue;
          }

          processedMovies.push(saved);
        }
      } catch (err) {
        console.error("TMDB fetch failed:", err.message);
      }

      const combined = [...movies, ...processedMovies];
      const enriched = await enrichMovies(combined, req.user);
      
      // For TMDB fallback, we can't know the exact total, so we assume there might be more
      const finalHasMore = processedMovies.length > 0 || hasMoreInDB;

      return res.json({
        success: true,
        data: enriched,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil((total + processedMovies.length) / limit), // Adjust totalPages calculation for combined results
          totalResults: total + processedMovies.length, // Adjust totalResults calculation for combined results
          hasMore: finalHasMore,
        },
      });
    }

    // If no filters and we got enough from DB
    const enriched = await enrichMovies(movies, req.user);
    return res.json({
      success: true,
      data: enriched,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalResults: total,
        hasMore: hasMoreInDB,
      },
    });
  } catch (err) {
    console.error("getAllMovies error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch movies." });
  }
};

// @desc      Get single movie by ID with reviews
// @route     GET /api/movies/:id
// @access    Public
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

// @desc      Get distinct filter options (genres, regions, years)
// @route     GET /api/movies/filters
// @access    Public
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


// @desc      Get all genres
// @route     GET /api/movies/genres
// @access    Public
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

// @desc      Get all regions
// @route     GET /api/movies/regions
// @access    Public
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

// @desc      Fetch movies from TMDB and store in DB
// @route     GET /api/movies/tmdb
// @access    Public
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
          language: 'en-US',
          include_adult: false // <--- Ensures TMDB API filters adult content at the source
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

    // Corrected trailer URL format for YouTube
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

    // Process region - getting primary release country from release dates for more accuracy
    const releaseDatesData = releaseResponse.data.results;
    let region = "US"; // Default to US if no specific region found
    if (releaseDatesData && releaseDatesData.length > 0) {
        // Find the US release first, then any other country
        const usRelease = releaseDatesData.find(r => r.iso_3166_1 === "US");
        if (usRelease) {
            region = "US";
        } else if (detailData.production_countries && detailData.production_countries.length > 0) {
            region = detailData.production_countries[0].iso_3166_1;
        } else if (tmdbMovie.origin_country && tmdbMovie.origin_country.length > 0) {
            region = tmdbMovie.origin_country[0];
        }
    }

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
        : "/profile/default-movie.png",
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

// Recommendation
export const getRecommendedMovies = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId).populate("watchlist");
    const favouriteGenres = user?.favouriteGenres;
    const watchlist = user?.watchlist?.map((movie) => movie.genre);

    const genreIdSet = new Set(watchlist.reduce((acc, arr) => [...acc, ...arr], favouriteGenres));
    const combinedGenres = Array.from(genreIdSet);

    // Main recommendation: high-rated movies in those genres
    const recommendations = await Movie.find({
      genre: { $in: combinedGenres },
      rating: { $gte: 2.0 },
    })
      .sort({ rating: -1, reviewCount: -1, year: -1 })
      .limit(50);

    if (recommendations.length >= 50) {
      return res.status(200).json({ movies: recommendations });
    }

    // Fallback: fill the remaining recommendations based on rating>reviewCount>year
    const fallback = await Movie.find({ _id: { $nin: recommendations.map((movie) => movie._id) } })
      .sort({ rating: -1, reviewCount: -1, year: -1 })
      .limit(50 - recommendations.length);

    return res.status(200).json({ movies: [...recommendations, ...fallback] });
  } catch (error) {
    console.error("getRecommendedMovies error:", error.message);
    return res.status(500).json({ message: "Failed to fetch recommended movies", error: error.message });
  }
};