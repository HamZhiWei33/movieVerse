import moongose from "mongoose";
const watchlistSchema = new moongose.Schema(
  {
    userId: {
      type: moongose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    movies: [
      {
        type: moongose.Schema.Types.ObjectId,
        ref: "Movie",
        required: true,
      },
    ],
  },
  { timestamps: true }
);
