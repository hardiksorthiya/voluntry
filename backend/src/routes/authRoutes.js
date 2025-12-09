import { Router } from "express";
import { register, login, refresh, logout } from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);

// Protected routes
router.post("/logout", requireAuth, logout);

export default router;

