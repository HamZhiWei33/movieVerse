// routes/userRoutes.js
import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  getUserWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  getUserReviews,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/watchlist", protectRoute, getUserWatchlist);
router.get("/review", protectRoute, getUserReviews);
router.post("/watchlist", protectRoute, addToWatchlist);
router.delete("/watchlist/:movieId", protectRoute, removeFromWatchlist);
router.get("/:id", getUserProfile);
router.put("/:id", updateUserProfile);

export default router;
