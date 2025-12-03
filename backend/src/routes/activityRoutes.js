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

const router = Router();

// All activity routes are public (no authentication required)
// IMPORTANT: More specific routes (with sub-paths) must come BEFORE generic :id routes
router.get("/", listActivities); // Public listing
router.post("/", createActivity); // Public - create activity

// Sub-routes (must come before /:id to avoid route conflicts)
router.post("/:id/join", joinActivity); // Public - join activity
router.post("/:id/leave", leaveActivity); // Public - leave activity
router.post("/:id/attendance", recordAttendance); // Public - record attendance
router.post("/:id/state", changeActivityState); // Public - change activity state

// Generic routes (must come after sub-routes)
router.get("/:id", getActivityById); // Public activity details
router.put("/:id", updateActivity); // Public - update activity
router.delete("/:id", deleteActivity); // Public - delete activity

export default router;

