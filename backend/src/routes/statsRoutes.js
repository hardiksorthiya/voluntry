import { Router } from "express";
import {
  getOverview,
  getActivityStats,
  getUserStats,
  getDashboardStats,
} from "../controllers/statsController.js";
import { requireAuth, requireManager } from "../middleware/authMiddleware.js";

const router = Router();

router.use(requireAuth);

// New endpoints
router.get("/overview", requireManager, getOverview);
router.get("/activity/:id", requireManager, getActivityStats);
router.get("/user/:id", getUserStats);

// Keep dashboard for backward compatibility
router.get("/dashboard", getDashboardStats);

export default router;

