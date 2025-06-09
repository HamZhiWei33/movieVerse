import Movie from "../models/movie.model.js";
import Genre from "../models/genre.model.js";
import Region from "../models/region.model.js";
import Review from "../models/review.model.js";

// @desc    Get all movies with optional pagination
// @route   GET /api/movies
// @access  Public
// movie.controller.js
export const getAllMovies = async (req, res) => {
  try {
    const { page = 1, limit = 100, genres, regions, years } = req.query;
    const skip = (page - 1) * limit;

    // Build filter query
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

    // Only include movies with trailerUrl
    query.trailerUrl = { $exists: true, $ne: "" };

    const [movies, total] = await Promise.all([
      Movie.find(query)
        .select('title posterUrl rating year genre description region duration trailerUrl director actors')
        .skip(skip)
        .limit(limit)
        .lean(),
      Movie.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: movies.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      data: movies
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
      .select('title posterUrl rating year genre description region duration trailerUrl')
      .lean();

    if (!movie) {
      return res.status(404).json({ 
        success: false,
        message: "Movie not found." 
      });
    }

    // Get reviews for this movie
    const reviews = await Review.find({ movieId: movie._id })
      .select('rating review')
      .lean();

    res.status(200).json({
      success: true,
      data: {
        ...movie,
        reviews
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
// - getNewReleases(req, res)
