import { Router } from "express";
import {
  createActivity,
  listActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
  joinActivity,
  leaveActivity,
  recordAttendance,
  changeActivityState,
} from "../controllers/activityController.js";
import { requireAuth, requireManager } from "../middleware/authMiddleware.js";

const router = Router();

// Public routes
router.get("/", listActivities); // Public listing
router.get("/:id", getActivityById); // Public activity details

// Protected routes
router.post("/", requireAuth, createActivity);
router.put("/:id", requireAuth, updateActivity);
router.delete("/:id", requireAuth, deleteActivity);
router.post("/:id/join", requireAuth, joinActivity);
router.post("/:id/leave", requireAuth, leaveActivity);
router.post("/:id/attendance", requireAuth, requireManager, recordAttendance);
router.post("/:id/state", requireAuth, requireManager, changeActivityState);

export default router;

