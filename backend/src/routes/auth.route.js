import express from "express";
import rateLimit from "express-rate-limit";
import {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth,
  requestResetCode,
  verifyResetCode,
  resetPassword
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

// ensure the user is authenticated before allowing profile updates
// router.put("/update-profile", protectRoute, updateProfile);
router.put("/update-profile", protectRoute, updateProfile);

// check if the user is authenticated
router.get("/check", protectRoute, checkAuth);

// const express = require('express');
// const router = express.Router();
// const authController = require('../controllers/authController');
// const rateLimit = require('express-rate-limit');

// Rate limiting for security
const codeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 3 attempts per window
  message: 'Too many attempts, please try again later'
});

router.post('/request-reset-code', codeLimiter, requestResetCode);
router.post('/verify-reset-code', codeLimiter, verifyResetCode);
router.post('/reset-password', resetPassword);

export default router;
