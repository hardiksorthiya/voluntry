import ChatMessage from "../models/ChatMessage.js";
import { getAIResponse } from "../services/aiService.js";

// POST /chat - Send message to AI
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    // Save user message
    const userMessage = await ChatMessage.create({
      user: req.user._id,
      role: "user",
      content: message,
    });

    // Get AI response
    const aiText = await getAIResponse(message);
    
    // Save AI reply
    const aiMessage = await ChatMessage.create({
      user: req.user._id,
      role: "assistant",
      content: aiText,
    });

    return res.status(200).json({
      reply: aiText,
      messageId: aiMessage._id,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to send message", error: error.message });
  }
};

// GET /chat/history - Get chat history with pagination
export const getHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [chats, total] = await Promise.all([
      ChatMessage.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      ChatMessage.countDocuments({ user: req.user._id }),
    ]);

    return res.status(200).json({
      chats: chats.reverse(), // Reverse to show oldest first
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load history", error: error.message });
  }
};

// GET /chat/:id - Get single chat thread
export const getChatById = async (req, res) => {
  try {
    const { id } = req.params;
    const chat = await ChatMessage.findById(id);
    
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Check if user owns this chat
    if (chat.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Get conversation thread (messages around this one)
    const chats = await ChatMessage.find({
      user: req.user._id,
      createdAt: {
        $gte: new Date(chat.createdAt.getTime() - 3600000), // 1 hour before
        $lte: new Date(chat.createdAt.getTime() + 3600000), // 1 hour after
      },
    }).sort({ createdAt: 1 });

    return res.status(200).json({ chatThread: chats });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch chat", error: error.message });
  }
};

