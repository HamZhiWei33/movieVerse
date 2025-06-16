import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getAllMovies,
  getMovieById,
  getFilterOptions,
  getAllGenres,
  getAllRegions,
} from "../controllers/movie.controller.js";
import { getHomePageMovies } from "../controllers/movie.controller.js";

const router = express.Router();

// Get all distinct filters
router.get("/filters", getFilterOptions);

// Get all genre
router.get("/genres", getAllGenres);

// Get all region
router.get("/regions", getAllRegions);

// Get home page movies
router.get("/home", getHomePageMovies);

// Get all movies
router.get("/", protectRoute, getAllMovies);

// Get movies by id
router.get("/:id", protectRoute, getMovieById);

export default router;
