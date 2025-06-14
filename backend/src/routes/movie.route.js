import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getAllMovies,
  getMovieById,
  getFilterOptions,
  getAllGenres,
  getAllRegions,
} from "../controllers/movie.controller.js";

const router = express.Router();

// Get all movies
router.get("/", protectRoute, getAllMovies);

// Get all distinct filters
router.get("/filters", getFilterOptions);

// Get all genre
router.get("/genres", getAllGenres);

// Get all region
router.get("/regions", getAllRegions);

// Get movies by id
router.get("/:id", protectRoute, getMovieById);

export default router;
