import { Router } from "express";
import { register, login, refresh, logout, signup } from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/signup", signup); // Alias for backward compatibility
router.post("/login", login);
router.post("/refresh", refresh);

// Protected routes
router.post("/logout", requireAuth, logout);

export default router;

