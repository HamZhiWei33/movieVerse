import Review from "../models/review.model.js";
import Like from "../models/like.model.js";
import Movie from "../models/movie.model.js";

export const updateMovieStats = async (movieId) => {
  try {
    // Get all reviews and likes for the movie
    const reviews = await Review.find({ movieId });
    const likes = await Like.find({ movieId });

    // Calculate review statistics
    const ratingSum = reviews.reduce((sum, r) => sum + r.rating, 0);
    const ratingCount = reviews.length;
    const avgRating = ratingCount ? (ratingSum / ratingCount) : 0;

    // Calculate likes weight (scale likes to 0-5 range)
    const likesWeight = likes.length > 0 ? Math.min(5, (likes.length / 10)) : 0;

    // Calculate weighted final score
    // 70% from average ratings, 30% from likes
    const weightedScore = ratingCount > 0 || likes.length > 0 
      ? ((avgRating * 0.7) + (likesWeight * 0.3)).toFixed(2)
      : 0;

    // Update movie with new statistics
    await Movie.findByIdAndUpdate(movieId, {
      rating: weightedScore,
      reviewCount: ratingCount,
      likes: likes.length,
      avgUserRating: avgRating.toFixed(2)
    });

    return {
      rating: weightedScore,
      reviewCount: ratingCount,
      likes: likes.length,
      avgUserRating: avgRating
    };

  } catch (error) {
    console.error('Error updating movie stats:', error);
    throw error;
  }
};
