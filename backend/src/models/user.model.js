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
    passwordReset: {
      code: String,
      expiresAt: Date,
      previousCodes: [String],
    },
    gender: {
      type: String,
      enum: ["male", "female", "-"],
      default: "-",
    },
    profilePic: {
      type: String,
      default: "",
    },
    watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
    likedMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
    favouriteGenres: {
      type: [{ type: Number, ref: "Genre" }],
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
