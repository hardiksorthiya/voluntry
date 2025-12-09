import { Router } from "express";
import { uploadAvatar } from "../controllers/uploadController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.use(requireAuth);

router.post("/avatar", uploadAvatar);

export default router;

