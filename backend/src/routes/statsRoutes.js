import { Router } from "express";
import {
  getOverview,
  getActivityStats,
  getUserStats,
  getDashboardStats,
} from "../controllers/statsController.js";

const router = Router();

// All stats endpoints are public (no authentication required)
router.get("/overview", getOverview);
router.get("/activity/:id", getActivityStats);
router.get("/user/:id", getUserStats);

// Keep dashboard for backward compatibility
router.get("/dashboard", getDashboardStats);

export default router;

