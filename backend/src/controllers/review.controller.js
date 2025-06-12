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

// Get all reviews for a movie
export const getReviewsByMovieId = async (req, res) => {
  try {
    const { movieId } = req.params;
    const reviews = await Review.find({ movieId }).populate("userId", "name profilePic");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews", error });
  }
};

// Get current user's review for a specific movie
export const getUserReview = async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user?._id?.toString();
    const review = await Review.findOne({ movieId, userId });
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user review", error });
  }
};

// Add a new review
export const addReview = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { rating, review } = req.body;
    const userId = req.user?._id?.toString();

    console.log("Incoming review:", { movieId, rating, review, userId });

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No user ID" });
    }

    if (!rating || !review) {
      return res.status(400).json({ message: "Rating and review are required." });
    }

    const existing = await Review.findOne({ movieId, userId });
    if (existing) {
      return res.status(400).json({ message: "You already submitted a review." });
    }

    const newReview = await Review.create({
      movieId,
      userId,
      rating,
      review,
    });

    const updatedStats = await updateMovieStats(movieId);

    res.status(201).json({ review: newReview, updatedStats });
  } catch (error) {
    console.error("Add review error:", error); 
    res.status(500).json({ message: "Failed to add review" });
  }
};

// Edit existing review
export const updateReview = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { rating, review } = req.body;
    const userId = req.user?._id?.toString();

    const updated = await Review.findOneAndUpdate(
      { movieId, userId },
      { rating, review },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Review not found." });
    }

    const updatedStats = await updateMovieStats(movieId);

    res.json({ review: updated, updatedStats });
  } catch (error) {
    res.status(500).json({ message: "Failed to update review", error });
  }
};