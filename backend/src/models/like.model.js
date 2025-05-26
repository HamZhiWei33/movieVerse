import moongose from "mongoose";
const likeSchema = new moongose.Schema(
  {
    userId: {
      type: moongose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    movieId: {
      type: moongose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
  },
  { timestamps: true }
);
