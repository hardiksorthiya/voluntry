import { Router } from "express";
import {
  getCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
  getUserById,
  listUsers,
} from "../controllers/userController.js";
import { getUserActivities } from "../controllers/activityController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

// GET /users/me - Get current user profile (must come before /:id)
router.get("/me", requireAuth, getCurrentUser);

// PUT /users/me - Update current user profile
router.put("/me", requireAuth, updateCurrentUser);

// DELETE /users/me - Delete current user
router.delete("/me", requireAuth, deleteCurrentUser);

// GET /users - List users (authenticated users only)
router.get("/", requireAuth, listUsers);

// GET /users/:id/activities - Get activities for a user (must come before /:id)
router.get("/:id/activities", requireAuth, getUserActivities);

// GET /users/:id - Get public view of user profile (must be last)
router.get("/:id", requireAuth, getUserById);

export default router;

