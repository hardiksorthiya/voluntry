import { Router } from "express";
import {
  sendMessage,
  getHistory,
  getConversations,
  deleteConversation,
} from "../controllers/chatController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

// All chat routes require authentication
router.post("/", requireAuth, sendMessage);
router.get("/history", requireAuth, getHistory);
router.get("/conversations", requireAuth, getConversations);
router.delete("/conversation/:conversationId", requireAuth, deleteConversation);

export default router;

