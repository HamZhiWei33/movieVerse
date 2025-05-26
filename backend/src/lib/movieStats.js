import Review from "../models/review.model.js";
import Like from "../models/like.model.js";
import Movie from "../models/movie.model.js";

export const updateMovieStats = async (movieId) => {
  const reviews = await Review.find({ movieId });
  const likes = await Like.find({ movieId });

  const ratingSum = reviews.reduce((sum, r) => sum + r.rating, 0);
  const ratingCount = reviews.length;
  const avgRating = ratingCount ? (ratingSum / ratingCount) : 0;

  await Movie.findByIdAndUpdate(movieId, {
    rating: avgRating.toFixed(2),
    reviewCount: ratingCount,
    likes: likes.length,
  });
};
