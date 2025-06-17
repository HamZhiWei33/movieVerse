import { Router } from 'express';
import { getRecommendedMovies } from '../controllers/recommendation.controller.js';
import { getNewReleases } from '../controllers/movie.controller.js';

const router = Router();

// Get new released movies
router.get('/new-releases', getNewReleases);

// Get recommended movies for a user (pass userId as query param)
router.get('/recommended', getRecommendedMovies);

export default router;