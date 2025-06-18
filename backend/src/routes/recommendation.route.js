import { Router } from 'express';
import { getRecommendedMovies } from '../controllers/recommendation.controller.js';

const router = Router();

// Get recommended movies for a user (pass userId as query param)
router.get('/recommended', getRecommendedMovies);

export default router;