import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getAllMovies,
  getMovieById,
  getFilterOptions,
  getAllGenres,
  getAllRegions,
  fetchFromTMDB,
  getRecommendedMovies
} from "../controllers/movie.controller.js";
import { getHomePageMovies } from "../controllers/movie.controller.js";

const router = express.Router();

// Get all distinct filters
router.get("/filters", getFilterOptions);

// Get all genre
router.get("/genres", getAllGenres);

// Get all region
router.get("/regions", getAllRegions);

// Fetch from TMDB
router.get("/tmdb", fetchFromTMDB);

// Get recommendation
router.get("/recommended", protectRoute, getRecommendedMovies);

// Get movies by id
router.get("/:id", protectRoute, getMovieById);



export default router;
