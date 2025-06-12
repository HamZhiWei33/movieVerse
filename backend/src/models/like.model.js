import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
  },
  { timestamps: true }
);

likeSchema.index({ userId: 1, movieId: 1 }, { unique: true });

const Like = mongoose.model("Like", likeSchema);

export default Like;