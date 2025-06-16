import Movie from "../models/movie.model.js";
import User from "../models/user.model.js";

// Recommend movies based on user's selected genres and genres from watchlist
export const getRecommendedMovies = async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ message: "Missing userId" });

    // Get user and their selected genres
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Assume user.selectedGenres is an array of genre IDs (from signup)
    const selectedGenres = user.selectedGenres || [];

    // Get genres from movies in user's watchlist
    const watchlistMovies = await Movie.find({ _id: { $in: user.watchlist || [] } });
    const watchlistGenres = watchlistMovies.flatMap(movie => movie.genre || []);

    // Combine and deduplicate genres
    const allGenres = Array.from(new Set([...selectedGenres, ...watchlistGenres]));

    // Find movies that match any of these genres, excluding those already in watchlist
    const recommendedMovies = await Movie.find({
      genre: { $in: allGenres },
      _id: { $nin: user.watchlist || [] }
    })
      .sort({ rating: -1 }) // Optional: sort by rating
      .limit(20);

    res.json({ movies: recommendedMovies });
  } catch (err) {
    console.error("Recommendation error:", err);
    res.status(500).json({ message: "Failed to get recommendations" });
  }
};

// Get new released movies (e.g., released in the last 3 months)
export const getNewReleases = async (req, res) => {
  try {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const newReleases = await Movie.find({
      releaseDate: { $gte: threeMonthsAgo }
    })
      .sort({ releaseDate: -1 })
      .limit(20);

    res.json({ movies: newReleases });
  } catch (err) {
    console.error("New releases error:", err);
    res.status(500).json({ message: "Failed to get new releases" });
  }
};