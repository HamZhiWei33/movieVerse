// lydia
// Ratings & Reviews
// rating.route and useRatingStore

// -addRating(req, res)
// - getMovieRatings(req, res)
// - updateRating(req, res);
// -addreview(req, res)
import { updateMovieStats } from "../lib/movieStats.js";
import Review from "../models/review.model.js";
import Movie from "../models/movie.model.js";

// @desc    Get all reviews (with optional movieId filter)
// @route   GET /api/reviews
// @access  Public
export const getReviews = async (req, res) => {
  try {
    const { movieId } = req.query;
    const query = movieId ? { movieId } : {};
    
    const reviews = await Review.find(query)
      .select('movieId rating review createdAt')
      .lean();

    // If you want to include movie details with each review
    const reviewsWithMovies = await Promise.all(
      reviews.map(async review => {
        const movie = await Movie.findById(review.movieId)
          .select('title posterUrl')
          .lean();
        return {
          ...review,
          movie
        };
      })
    );

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviewsWithMovies
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews"
    });
  }
};

// Adds a new review for a movie
const createReview = async (req, res) => {
  const { movieId, rating, review } = req.body;
  const userId = req.user._id;

  await Review.create({ movieId, userId, rating, review });
  await updateMovieStats(movieId); 

  res.status(201).json({ message: "Review added" });
};
