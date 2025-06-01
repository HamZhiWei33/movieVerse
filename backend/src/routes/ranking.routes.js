import express from 'express';
import { 
  getRankingData, 
  getGenreRankings,
  getTopMovies,
  updateMovieLike,
  updateMovieWatchlist
} from '../controllers/ranking.controller.js';

const router = express.Router();

// Get overall ranking data
router.get('/', getRankingData);

// Get genre-specific rankings
router.get('/genres', getGenreRankings);

// Get top movies
router.get('/top', getTopMovies);

// Like a movie
router.post('/movies/:id/like', updateMovieLike);

// Add a movie to the watchlist
router.post('/movies/:id/watchlist', updateMovieWatchlist);

export default router;