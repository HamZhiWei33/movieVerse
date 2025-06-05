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
  const userId = req.user._id; // authenticated user
  const { movieId } = req.body; // movie _id from frontend

  try {
    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Add to user's watchlist if not already there
    const user = await User.findById(userId);
    if (user.watchlist.includes(movieId)) {
      return res.status(400).json({ message: "Movie already in watchlist" });
    }

    user.watchlist.push(movieId);
    await user.save();

    res
      .status(200)
      .json({ message: "Movie added to watchlist", watchlist: user.watchlist });
  } catch (err) {
    console.error("Error adding to watchlist:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeFromWatchlist = async (req, res) => {
  try {
    const userId = req.user._id; // Ensure user is authenticated
    const movieId = req.params.movieId;
    console.log("Removing movieId:", movieId);
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.watchlist = user.watchlist.filter((id) => id.toString() !== movieId);

    await user.save();

    res.status(200).json({ message: "Movie removed from watchlist" });
  } catch (err) {
    res.status(500).json({ message: "Error removing movie from watchlist" });
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
