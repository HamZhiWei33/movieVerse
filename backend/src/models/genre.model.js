import mongoose from "mongoose";

const genreSchema = new mongoose.Schema({
  id: {
    type: Number, // TMDB genre ID
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const Genre = mongoose.model("Genre", genreSchema);

export default Genre;
