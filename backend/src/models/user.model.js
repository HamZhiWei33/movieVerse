// not complete
// PIC HWJ
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"], // optional validation
    },
    profilePic: {
      type: String,
      default: "",
    },
    watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
    likedMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
    favouriteGenres: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
