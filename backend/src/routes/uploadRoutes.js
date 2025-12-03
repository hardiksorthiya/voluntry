import { Router } from "express";
import { uploadAvatar, uploadActivityMedia } from "../controllers/uploadController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.use(requireAuth);

router.post("/avatar", uploadAvatar);
router.post("/activities/:id/media", uploadActivityMedia);

export default router;

