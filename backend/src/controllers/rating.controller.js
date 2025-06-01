// lydia
// Ratings & Reviews
// rating.route and useRatingStore

// -addRating(req, res)
// - getMovieRatings(req, res)
// - updateRating(req, res);
// -addreview(req, res)
import { updateMovieStats } from "../lib/movieStats.js";
import Review from "../models/review.model.js";

// Adds a new review for a movie
const createReview = async (req, res) => {
  const { movieId, rating, review } = req.body;
  const userId = req.user._id;

  await Review.create({ movieId, userId, rating, review });
  await updateMovieStats(movieId); 

  res.status(201).json({ message: "Review added" });
};
