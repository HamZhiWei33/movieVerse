import mongoose from "mongoose";
const watchlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one watchlist per user
    },
    movies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const Watchlist = mongoose.model("Watchlist", watchlistSchema);
export default Watchlist;