import Movie from "../models/movie.model.js";
import Genre from "../models/genre.model.js";
import Region from "../models/region.model.js";
import Like from "../models/like.model.js";
import Watchlist from "../models/watchlist.model.js";
import Review from "../models/review.model.js";

// @desc    Get all movies with optional pagination
// @route   GET /api/movies
// @access  Public
export const getAllMovies = async (req, res) => {
  try {
    const { page = 1, limit = 100, genres, regions, years } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (genres) {
      query.genre = { $in: genres.split(',').map(Number) };
    }
    if (regions) {
      query.region = { $in: regions.split(',') };
    }
    if (years) {
      query.year = { $in: years.split(',').map(Number) };
    }

    query.trailerUrl = { $exists: true, $ne: "" };

    const [movies, total] = await Promise.all([
      Movie.find(query)
        .select('title posterUrl rating year genre description region duration trailerUrl director actors')
        .skip(skip)
        .limit(limit)
        .lean(),
      Movie.countDocuments(query)
    ]);

    const movieIds = movies.map(m => m._id.toString());
    const user = req.user;

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

    const enrichedMovies = movies.map(m => {
      const id = m._id.toString();
      return {
        ...m,
        likeCount: likeMap[id] || 0,
        liked: userLikedSet.has(id),
        watchlisted: watchlistSet.has(id)
      };
    });

    res.status(200).json({
      success: true,
      count: enrichedMovies.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page),
      data: enrichedMovies
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

// - getTopRatedMovies(req, res)

// tzw
// - getNewReleases(req, res)
