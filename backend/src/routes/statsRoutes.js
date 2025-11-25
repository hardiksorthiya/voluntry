import { Router } from "express";
import {
  getDashboardStats,
  getLeaderboard,
} from "../controllers/statsController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.use(requireAuth);
router.get("/dashboard", getDashboardStats);
router.get("/leaderboard", getLeaderboard);

export default router;

