import { Router } from 'express';
import { getNewReleases, getRecommendedMovies } from '../controllers/recommendation.controller.js';

const router = Router();

// Get new released movies
router.get('/new-releases', getNewReleases);

// Get recommended movies for a user (pass userId as query param)
router.get('/recommended', getRecommendedMovies);

export default router;