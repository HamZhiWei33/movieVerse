import mongoose from "mongoose";
import Like from "../models/like.model.js";
import Review from "../models/review.model.js";
import User from "../models/user.model.js";
export const getLikedGenresAggregation = async (userId) => {
  return Like.aggregate([
    {
      $match: { userId: new mongoose.Types.ObjectId(userId) },
    },
    {
      $lookup: {
        from: "movies",
        localField: "movieId",
        foreignField: "_id",
        as: "movie",
      },
    },
    { $unwind: "$movie" },
    { $unwind: "$movie.genre" }, // flatten genre array
    {
      $group: {
        _id: "$movie.genre", // group by genre ID
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "genres", // your genre collection
        localField: "_id", // genre ID
        foreignField: "id", // genre ID in genres collection
        as: "genreDetails",
      },
    },
    { $unwind: "$genreDetails" },
    {
      $project: {
        genre: "$genreDetails.name", // get genre name
        count: 1,
      },
    },
    { $sort: { count: -1 } },
  ]);
};

export const getReviewedGenresAggregation = async (userId) => {
  return Review.aggregate([
    // Stage 1: Match reviews for the specific user
    {
      $match: { userId: new mongoose.Types.ObjectId(userId) },
    },

    // Stage 2: Lookup movie details for each reviewed movie
    {
      $lookup: {
        from: "movies",
        localField: "movieId",
        foreignField: "_id",
        as: "movie",
      },
    },

    // Stage 3: Unwind the movie array
    { $unwind: "$movie" },

    // Stage 4: Unwind the genre array in the movie document
    { $unwind: "$movie.genre" },

    // Stage 5: Group by genre and count occurrences
    {
      $group: {
        _id: "$movie.genre",
        count: { $sum: 1 },
        // Optional: Also calculate average rating if needed
        averageRating: { $avg: "$rating" },
      },
    },

    // Stage 6: Lookup genre details
    {
      $lookup: {
        from: "genres",
        localField: "_id",
        foreignField: "id",
        as: "genreDetails",
      },
    },

    // Stage 7: Unwind the genreDetails array
    { $unwind: "$genreDetails" },

    // Stage 8: Project the final output
    {
      $project: {
        genre: "$genreDetails.name",
        count: 1,
        // Include average rating if calculated
        // averageRating: { $round: ["$averageRating", 1] }
      },
    },

    // Stage 9: Sort by count (descending)
    { $sort: { count: -1 } },
  ]);
};
export const getWatchlistGenresAggregation = async (userId) => {
  return User.aggregate([
    // Stage 1: Match the specific user
    {
      $match: { _id: new mongoose.Types.ObjectId(userId) },
    },

    // Stage 2: Lookup movies in the watchlist
    {
      $lookup: {
        from: "movies",
        localField: "watchlist",
        foreignField: "_id",
        as: "watchlistMovies",
      },
    },

    // Stage 3: Unwind each movie
    { $unwind: "$watchlistMovies" },

    // Stage 4: Unwind genres in each movie
    { $unwind: "$watchlistMovies.genre" },

    // Stage 5: Group by genre and count
    {
      $group: {
        _id: "$watchlistMovies.genre", // genre ID
        count: { $sum: 1 },
      },
    },

    // Stage 6: Lookup genre name from genres collection
    {
      $lookup: {
        from: "genres",
        localField: "_id",
        foreignField: "id", // assuming `genre.id` in genre collection
        as: "genreDetails",
      },
    },

    // Stage 7: Unwind genre details
    { $unwind: "$genreDetails" },

    // Stage 8: Project the result
    {
      $project: {
        genre: "$genreDetails.name",
        count: 1,
      },
    },

    // Stage 9: Sort by most frequent
    { $sort: { count: -1 } },
  ]);
};
