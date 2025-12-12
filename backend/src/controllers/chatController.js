import Chat from "../models/Chat.js";
import { getAIResponse } from "../services/aiService.js";

// POST /api/chat
export const sendMessage = async (req, res) => {
  try {
    const { content, conversationId } = req.body;
    const userId = req.user.id;

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return res.status(400).json({ message: "Message content is required" });
    }

    // Save user message
    const userMessage = await Chat.create({
      userId,
      conversationId,
      role: "user",
      content: content.trim(),
    });

    // Get conversation history for context
    const history = await Chat.getConversationHistory(
      userId,
      userMessage.conversationId,
      20
    );

    // Format history for OpenAI (exclude the current message)
    const conversationHistory = history
      .filter((msg) => msg.id !== userMessage.id)
      .map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

    // Get AI response
    let aiResponse;
    try {
      aiResponse = await getAIResponse(content.trim(), conversationHistory);
    } catch (error) {
      console.error("AI Service Error:", error);
      return res.status(500).json({
        message: "Failed to get AI response",
        error: error.message,
      });
    }

    // Save AI response
    const assistantMessage = await Chat.create({
      userId,
      conversationId: userMessage.conversationId,
      role: "assistant",
      content: aiResponse,
    });

    return res.status(200).json({
      message: "Message sent successfully",
      conversationId: userMessage.conversationId,
      userMessage: {
        id: userMessage.id,
        content: userMessage.content,
        role: userMessage.role,
        createdAt: userMessage.createdAt,
      },
      assistantMessage: {
        id: assistantMessage.id,
        content: assistantMessage.content,
        role: assistantMessage.role,
        createdAt: assistantMessage.createdAt,
      },
    });
  } catch (error) {
    console.error("Chat Controller Error:", error);
    return res.status(500).json({
      message: "Failed to send message",
      error: error.message,
    });
  }
};

// GET /api/chat/history
export const getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId, limit = 50 } = req.query;

    let messages;
    if (conversationId) {
      // Get messages for a specific conversation
      messages = await Chat.getConversationHistory(
        userId,
        conversationId,
        parseInt(limit)
      );
    } else {
      // Get recent messages across all conversations
      messages = await Chat.getRecentMessages(userId, parseInt(limit));
    }

    return res.status(200).json({
      message: "Chat history retrieved successfully",
      messages,
      count: messages.length,
    });
  } catch (error) {
    console.error("Chat History Error:", error);
    return res.status(500).json({
      message: "Failed to retrieve chat history",
      error: error.message,
    });
  }
};

// GET /api/chat/conversations
export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 20 } = req.query;

    const conversations = await Chat.getUserConversations(
      userId,
      parseInt(limit)
    );

    return res.status(200).json({
      message: "Conversations retrieved successfully",
      conversations,
      count: conversations.length,
    });
  } catch (error) {
    console.error("Conversations Error:", error);
    return res.status(500).json({
      message: "Failed to retrieve conversations",
      error: error.message,
    });
  }
};

// DELETE /api/chat/conversation/:conversationId
export const deleteConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;

    if (!conversationId) {
      return res.status(400).json({ message: "Conversation ID is required" });
    }

    await Chat.deleteConversation(userId, conversationId);

    return res.status(200).json({
      message: "Conversation deleted successfully",
    });
  } catch (error) {
    console.error("Delete Conversation Error:", error);
    return res.status(500).json({
      message: "Failed to delete conversation",
      error: error.message,
    });
  }
};

