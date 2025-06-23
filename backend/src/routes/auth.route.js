import express from "express";
import rateLimit from "express-rate-limit";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  signup,
  login,
  logout,
  checkAuth,
  requestResetCode,
  verifyResetCode,
  resetPassword
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// check if the user is authenticated
router.get("/check", protectRoute, checkAuth);

// Rate limiting for security
const codeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 attempts per window
  message: 'Too many attempts, please try again later'
});

router.post('/request-reset-code', codeLimiter, requestResetCode);
router.post('/verify-reset-code', codeLimiter, verifyResetCode);
router.post('/reset-password', resetPassword);

export default router;
