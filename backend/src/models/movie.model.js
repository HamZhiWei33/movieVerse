import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  tmdbId: {
    type: String,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  year: {          
    type: Number,
    required: true,
  },
  genre: [
    {
      type: Number,
      // Assuming genre is stored as an array of genre IDs
      ref: "Genre",
      required: true,
    },
  ],
  director: {
    type: String,
    required: true,
  },
  actors: [
    {
      type: String,
      required: true,
    },
  ],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  posterUrl: {
    type: String,
    required: true,
  },
  trailerUrl: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  region: {
    type: String,
    default: "None",
  },
});

const Movie = mongoose.model("Movie", movieSchema);
export default Movie;
