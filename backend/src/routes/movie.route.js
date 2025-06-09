import express from "express";
import {
  getAllMovies,
  getMovieById,
  filterMovies,
  getFilterOptions,
  getAllGenres,
  getAllRegions,
} from "../controllers/movie.controller.js";

const router = express.Router();

// Get all movies
router.get("/", getAllMovies);

// Get all distinct filters
router.get("/filters", getFilterOptions);

// Get filtered movies
router.get("/filter", filterMovies);

// Get all genre
router.get("/genres", getAllGenres);

// Get all region
router.get("/regions", getAllRegions);

// Get movies by id
router.get("/:id", getMovieById);

export default router;
