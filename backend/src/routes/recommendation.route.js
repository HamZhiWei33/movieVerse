import { Router } from 'express';
import { getNewReleases, getRecommendedMovies } from '../controllers/recommendation.controller.js';
const router = Router();

router.get('/new-releases', getNewReleases);
router.get('/recommended', getRecommendedMovies); 

export default router;