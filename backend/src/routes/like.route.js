import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { likeMovie } from "../controllers/like.controller.js";

const router = express.Router();

router.post("/", protectRoute, likeMovie);

export default router;
