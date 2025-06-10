// hzw
// Manages user-related features
// - getUserProfile(req, res)
// - updateUserPreferences(req, res)
// - getWatchlist(req, res)
// - addToWatchlist(req, res)
// - removeFromWatchlist(req, res)
// controllers/userController.js
import User from "../models/user.model.js";
import Movie from "../models/movie.model.js";
import Review from "../models/review.model.js";
import {
  getLikedGenresAggregation,
  getReviewedGenresAggregation,
  getWatchlistGenresAggregation,
} from "../lib/genreAnalytics.js";

export const getCurrentUser = (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    res.status(200).json(req.user); // req.user is populated by protectRoute
  } catch (err) {
    console.error("getCurrentUser error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};


// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const { name, gender, profilePic } = req.body;

    const updatedFields = {};
    if (name !== undefined) updatedFields.name = name;
    if (gender !== undefined) updatedFields.gender = gender;
    if (profilePic !== undefined) updatedFields.profilePic = profilePic;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

export const getUserWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("watchlist");
    console.log("Watchlist:", user.watchlist);

    res.status(200).json(user.watchlist);
  } catch (err) {
    res.status(500).json({ message: "Error fetching watchlist" });
  }
};

export const addToWatchlist = async (req, res) => {
  const userId = req.user?._id;
  const { movieId } = req.params;

  if (!userId || !movieId) {
    return res.status(400).json({ message: "User ID and Movie ID are required." });
  }

  try {
    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Add to user's watchlist if not already there
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.watchlist.includes(movieId)) {
      return res.status(200).json({ watchlisted: true, message: "Movie already in watchlist." });
    }

    user.watchlist.push(movieId);
    await user.save();

    return res.status(201).json({ watchlisted: true, message: "Movie added to watchlist." });
  } catch (err) {
    console.error("Error adding to watchlist:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const removeFromWatchlist = async (req, res) => {
  const userId = req.user?._id;
  const { movieId } = req.params;

  if (!userId || !movieId) {
    return res.status(400).json({ message: "User ID and Movie ID are required." });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if movie is in watchlist
    const wasInWatchlist = user.watchlist.includes(movieId);
    if (!wasInWatchlist) {
      return res.status(200).json({ watchlisted: false, message: "Movie not in watchlist." });
    }

    // Remove movie from watchlist
    user.watchlist = user.watchlist.filter((id) => id.toString() !== movieId);
    await user.save();

    return res.status(200).json({ watchlisted: false, message: "Movie removed from watchlist." });
  } catch (err) {
    console.error("Error removing movie from watchlist:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const addReview = async (req, res) => {
  const userId = req.user._id; // Authenticated user
  const { movieId, rating, review } = req.body;

  try {
    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Optional: Check if the user has already reviewed the movie
    const existingReview = await Review.findOne({ movieId, userId });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this movie" });
    }

    // Create a new review
    const newReview = new Review({
      movieId,
      userId,
      rating,
      review,
    });

    await newReview.save();

    res
      .status(201)
      .json({ message: "Review submitted successfully", review: newReview });
  } catch (err) {
    console.error("Error adding review:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const getUserReviews = async (req, res) => {
  try {
    const userId = req.user._id;

    const reviews = await Review.find({ userId }).populate("movieId");

    res.status(200).json(reviews);
  } catch (err) {
    console.error("Error fetching user reviews:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;
    // const userId = req.params.id;
    // Delete user reviews
    await Review.deleteMany({ userId });

    // Delete the user account
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "Account deleted successfully." });
  } catch (err) {
    console.error(`Error deleting user ${req.user._id}:`, err);
    res.status(500).json({ message: "Server error while deleting account." });
  }
};

export const getUserLikedGenres = async (req, res) => {
  try {
    const userId = req.user.id;
    const genreCounts = await getLikedGenresAggregation(userId);
    console.log("User id in genre count:", userId);
    console.log("Genre counts:", genreCounts);
    res.json(genreCounts);
  } catch (err) {
    console.error("Error getting genre counts:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const getUserReviewGenres = async (req, res) => {
  try {
    const userId = req.user.id;
    const genreCounts = await getReviewedGenresAggregation(userId);
    console.log("User id in review genre count:", userId);
    console.log("Genre counts:", genreCounts);
    res.json(genreCounts);
  } catch (err) {
    console.error("Error getting genre counts:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const getUserWatchlistGenres = async (req, res) => {
  try {
    const userId = req.user.id;
    const genreCounts = await getWatchlistGenresAggregation(userId);
    console.log("User id in watchlist genre count:", userId);
    console.log("Genre watchlist counts:", genreCounts);
    res.json(genreCounts);
  } catch (err) {
    console.error("Error getting watchlist genre counts:", err);
    res.status(500).json({ message: "Server error" });
  }
};
