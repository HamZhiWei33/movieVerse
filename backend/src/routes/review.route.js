import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getReviewsByMovieId,
  getUserReview,
  addReview,
  updateReview
} from "../controllers/review.controller.js";

const router = express.Router();

router.get("/:movieId/user", protectRoute, getUserReview); 
router.get("/:movieId", getReviewsByMovieId);
router.post("/:movieId", protectRoute, addReview);
router.put("/:movieId", protectRoute, updateReview);

export default router;