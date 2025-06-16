// routes/userRoutes.js
import express from "express";
import {
  getCurrentUser,
  getUserProfile,
  updateUserProfile,
  getUserWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  getUserReviews,
  addReview,
  deleteAccount,
  updateFavouriteGenres,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getUserLikedGenres,
  getUserReviewGenres,
  getUserWatchlistGenres,
} from "../controllers/user.controller.js";
const router = express.Router();

router.get("/me", protectRoute, getCurrentUser);
router.get("/watchlist", protectRoute, getUserWatchlist);
router.get("/review", protectRoute, getUserReviews);
router.post("/review", protectRoute, addReview);
router.post("/watchlist/:movieId", protectRoute, addToWatchlist);
router.delete("/watchlist/:movieId", protectRoute, removeFromWatchlist);
router.get("/:id", getUserProfile);
router.put("/:id", updateUserProfile);
router.put("/:id/favourite-genres", updateFavouriteGenres);
router.delete("/:id", protectRoute, deleteAccount);
router.get("/:id/liked-genres", protectRoute, getUserLikedGenres);
router.get("/:id/review-genres", protectRoute, getUserReviewGenres);
router.get("/:id/watchlist-genres", protectRoute, getUserWatchlistGenres);

export default router;
