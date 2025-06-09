import express from "express";
import { getReviews } from "../controllers/review.controller.js";

const router = express.Router();

// Get all reviews or filter by movieId
router.get("/", getReviews);

export default router;