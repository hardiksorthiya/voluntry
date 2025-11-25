import { Router } from "express";
import {
  createActivity,
  deleteActivity,
  listActivities,
  refreshStats,
  updateActivity,
} from "../controllers/volunteerController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.use(requireAuth);
router.get("/", listActivities);
router.post("/", createActivity);
router.put("/:id", updateActivity);
router.delete("/:id", deleteActivity);
router.post("/refresh-stats", refreshStats);

export default router;

