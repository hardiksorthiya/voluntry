import ChatMessage from "../models/ChatMessage.js";
import { getAIResponse } from "../services/aiService.js";

export const getHistory = async (req, res) => {
  try {
    const history = await ChatMessage.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(25);
    return res.json(history.reverse());
  } catch (error) {
    return res.status(500).json({ message: "Failed to load history", error: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: "Message content is required" });
    }

    const userMessage = await ChatMessage.create({
      user: req.user._id,
      role: "user",
      content,
    });

    const aiText = await getAIResponse(content);
    const aiMessage = await ChatMessage.create({
      user: req.user._id,
      role: "assistant",
      content: aiText,
    });

    return res.json({ userMessage, aiMessage });
  } catch (error) {
    return res.status(500).json({ message: "Failed to send message", error: error.message });
  }
};

