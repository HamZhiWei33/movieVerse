import Like from "../models/like.model.js";

export const likeMovie = async (req, res) => {
  const { movieId } = req.body;

  if (!movieId) {
    return res.status(400).json({ message: "Movie ID is required" });
  }

  try {
    // Check if the movie is already liked by the user
    const existingLike = await Like.findOne({ userId: req.user._id, movieId });

    if (existingLike) {
      return res.status(400).json({ message: "Movie already liked" });
    }

    const newLike = await Like.create({
      userId: req.user._id,
      movieId,
    });

    res.status(201).json({ message: "Movie liked", like: newLike });
  } catch (error) {
    console.error("Like error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
