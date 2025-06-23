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
import Like from "../models/like.model.js";
import {
  getLikedGenresAggregation,
  getReviewedGenresAggregation,
  getWatchlistGenresAggregation,
} from "../lib/genreAnalytics.js";
import bcrypt from "bcryptjs";

const isStrongPassword = (password) =>
  password.length >= 8 &&
  /[A-Z]/.test(password) &&
  /[a-z]/.test(password) &&
  /[0-9]/.test(password);

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
    const sortedWatchlist = [...user.watchlist].reverse();

    res.status(200).json(sortedWatchlist);
  } catch (err) {
    res.status(500).json({ message: "Error fetching watchlist" });
  }
};

// controllers/userController.js
export const checkWatchlistStatus = async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isInWatchlist = user.watchlist.some(
      (id) => id.toString() === movieId
    );

    res.status(200).json({
      inWatchlist: isInWatchlist,
    });
  } catch (error) {
    console.error("Error checking watchlist status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addToWatchlist = async (req, res) => {
  const userId = req.user?._id;
  const { movieId } = req.params;

  if (!userId || !movieId) {
    return res
      .status(400)
      .json({ message: "User ID and Movie ID are required." });
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
      return res
        .status(200)
        .json({ watchlisted: true, message: "Movie already in watchlist." });
    }

    user.watchlist.push(movieId);
    await user.save();

    return res
      .status(201)
      .json({ watchlisted: true, message: "Movie added to watchlist." });
  } catch (err) {
    console.error("Error adding to watchlist:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const removeFromWatchlist = async (req, res) => {
  const userId = req.user?._id;
  const { movieId } = req.params;

  if (!userId || !movieId) {
    return res
      .status(400)
      .json({ message: "User ID and Movie ID are required." });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if movie is in watchlist
    const wasInWatchlist = user.watchlist.includes(movieId);
    if (!wasInWatchlist) {
      return res
        .status(200)
        .json({ watchlisted: false, message: "Movie not in watchlist." });
    }

    // Remove movie from watchlist
    user.watchlist = user.watchlist.filter((id) => id.toString() !== movieId);
    await user.save();

    return res
      .status(200)
      .json({ watchlisted: false, message: "Movie removed from watchlist." });
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
  const userId = req.user._id;
  try {
    await Review.deleteMany({ userId });
    await Like.deleteMany({ userId });
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "Account deleted successfully." });
  } catch (err) {
    console.error("Delete failed:", err);
    res.status(500).json({ message: "Server error" });
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

export const updateFavouriteGenres = async (req, res) => {
  try {
    const { favouriteGenres } = req.body;

    const updatedFields = {};
    if (favouriteGenres !== undefined)
      updatedFields.favouriteGenres = favouriteGenres;

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

// export const changeNewPassword = async (req, res) => {
//   try {
//     const { oldPassword, newPassword } = req.body;
//     const userId = req.user._id;

//     if (!oldPassword || !newPassword) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     if (newPassword.length < 8) {
//       return res
//         .status(400)
//         .json({ message: "New password must be at least 8 characters long" });
//     }

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const isMatch = await bcrypt.compare(oldPassword, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Old password is incorrect" });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedNewPassword = await bcrypt.hash(newPassword, salt);
//     user.password = hashedNewPassword;

//     await user.save();

//     res.status(200).json({ message: "Password updated successfully" });
//   } catch (error) {
//     console.error("Error in changeNewPassword controller:", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
export const changeNewPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    console.log("👉 Received:", { oldPassword, newPassword });
    console.log("👉 From user:", req.user);

    const userId = req.user._id;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: "New password must be at least 8 characters long" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const isOld = await bcrypt.compare(newPassword, user.password);
    if (isOld) {
      return res
        .status(400)
        .json({ message: "New password cannot be the same as old password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedNewPassword;

    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("❌ Error in changeNewPassword controller:", error); // ← LOG FULL ERROR OBJECT
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};