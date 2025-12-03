import { Router } from "express";
import { getHistory, sendMessage, getChatById } from "../controllers/chatController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.use(requireAuth);
router.post("/", sendMessage);
router.get("/history", getHistory);
router.get("/:id", getChatById);

export default router;

