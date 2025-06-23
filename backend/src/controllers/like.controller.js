import Like from "../models/like.model.js";
import User from "../models/user.model.js";
import mongoose from 'mongoose';

export const likeMovie = async (req, res) => {
  const userId = req.user?.id;
  const { movieId } = req.params;

  if (!userId || !movieId) {
    return res.status(400).json({ error: "User ID and Movie ID are required." });
  }

  try {
    // Prevent duplicate Like document
    const existingLike = await Like.findOne({ userId, movieId });
    if (existingLike) {
      return res.status(200).json({ liked: true, message: "Movie already liked." });
    }

    // Create like entry
    await Like.create({ userId, movieId });

    // Add to user's likedMovies if not present
    await User.findByIdAndUpdate(userId, {
      $addToSet: { likedMovies: movieId },
    });

    return res.status(201).json({ liked: true, message: "Movie liked." });
  } catch (error) {
    console.error("Like movie error:", error);
    return res.status(500).json({ error: "Failed to like movie." });
  }
};

export const unlikeMovie = async (req, res) => {
  const userId = req.user?.id;
  const { movieId } = req.params;

  if (!userId || !movieId) {
    return res.status(400).json({ error: "User ID and Movie ID are required." });
  }

  try {
    // Delete Like entry
    const deleted = await Like.findOneAndDelete({ userId, movieId });
    if (!deleted) {
      return res.status(404).json({ liked: false, message: "Like not found." });
    }

    // Remove movieId from user's likedMovies
    await User.findByIdAndUpdate(userId, {
      $pull: { likedMovies: movieId },
    });

    return res.status(200).json({ liked: false, message: "Movie unliked." });
  } catch (error) {
    console.error("Unlike movie error:", error);
    return res.status(500).json({ error: "Failed to unlike movie." });
  }
};

export const getLikesForMovie = async (req, res) => {
  const { movieId } = req.params;

  if (!movieId) {
    return res.status(400).json({ error: "Movie ID is required." });
  }

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(movieId)) {
    return res.status(200).json({ count: 0, likes: [] });
  }

  try {
    const likes = await Like.find({ "movieId": movieId });
    return res.status(200).json({ count: likes.length, likes });
  } catch (error) {
    console.error("Get likes error:", error);
    return res.status(500).json({ details: error.message });
  }
};