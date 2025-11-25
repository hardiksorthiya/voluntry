import { Router } from "express";
import {
  deleteProfile,
  getProfile,
  updateProfile,
} from "../controllers/profileController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.use(requireAuth);
router.get("/", getProfile);
router.put("/", updateProfile);
router.delete("/", deleteProfile);

export default router;

