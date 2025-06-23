import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  likeMovie,
  unlikeMovie,
  getLikesForMovie
} from "../controllers/like.controller.js";

const router = express.Router();

// POST /api/likes/:movieId
router.post("/:movieId", protectRoute, likeMovie); 

// DELETE /api/likes/:movieId
router.delete("/:movieId", protectRoute, unlikeMovie);      

// GET /api/likes/:movieId
router.get("/:movieId", getLikesForMovie);

export default router;
