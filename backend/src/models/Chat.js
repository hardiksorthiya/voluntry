import { pool } from "../config/db.js";

class Chat {
  // Generate a unique conversation ID
  static generateConversationId() {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Create a new chat message
  static async create(messageData) {
    const connection = await pool.getConnection();
    try {
      const { userId, conversationId, role, content } = messageData;

      // Generate conversation ID if not provided
      const finalConversationId = conversationId || this.generateConversationId();

      const query = `
        INSERT INTO chat_messages (user_id, conversation_id, role, content)
        VALUES (?, ?, ?, ?)
      `;

      const [result] = await connection.execute(query, [
        userId,
        finalConversationId,
        role,
        content,
      ]);

      return await this.findById(result.insertId);
    } finally {
      connection.release();
    }
  }

  // Find message by ID
  static async findById(id) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        `SELECT * FROM chat_messages WHERE id = ?`,
        [id]
      );

      if (rows.length === 0) return null;
      return this.formatMessage(rows[0]);
    } finally {
      connection.release();
    }
  }

  // Get conversation history for a user
  static async getConversationHistory(userId, conversationId = null, limit = 50) {
    const connection = await pool.getConnection();
    try {
      let query = `
        SELECT * FROM chat_messages 
        WHERE user_id = ?
      `;
      const params = [userId];

      if (conversationId) {
        query += ` AND conversation_id = ?`;
        params.push(conversationId);
      }

      query += ` ORDER BY createdAt ASC LIMIT ?`;
      params.push(limit);

      const [rows] = await connection.execute(query, params);
      return rows.map((row) => this.formatMessage(row));
    } finally {
      connection.release();
    }
  }

  // Get all conversations for a user (list of unique conversation IDs)
  static async getUserConversations(userId, limit = 20) {
    const connection = await pool.getConnection();
    try {
      const query = `
        SELECT 
          conversation_id,
          MAX(createdAt) as last_message_at,
          COUNT(*) as message_count
        FROM chat_messages 
        WHERE user_id = ?
        GROUP BY conversation_id
        ORDER BY last_message_at DESC
        LIMIT ?
      `;

      const [rows] = await connection.execute(query, [userId, limit]);
      return rows.map((row) => ({
        conversationId: row.conversation_id,
        lastMessageAt: row.last_message_at,
        messageCount: row.message_count,
      }));
    } finally {
      connection.release();
    }
  }

  // Get recent messages for a user (for history page)
  static async getRecentMessages(userId, limit = 50) {
    const connection = await pool.getConnection();
    try {
      const query = `
        SELECT * FROM chat_messages 
        WHERE user_id = ?
        ORDER BY createdAt DESC
        LIMIT ?
      `;

      const [rows] = await connection.execute(query, [userId, limit]);
      return rows.map((row) => this.formatMessage(row)).reverse(); // Reverse to get chronological order
    } finally {
      connection.release();
    }
  }

  // Delete all messages for a user
  static async deleteByUserId(userId) {
    const connection = await pool.getConnection();
    try {
      await connection.execute("DELETE FROM chat_messages WHERE user_id = ?", [
        userId,
      ]);
      return true;
    } finally {
      connection.release();
    }
  }

  // Delete a specific conversation
  static async deleteConversation(userId, conversationId) {
    const connection = await pool.getConnection();
    try {
      await connection.execute(
        "DELETE FROM chat_messages WHERE user_id = ? AND conversation_id = ?",
        [userId, conversationId]
      );
      return true;
    } finally {
      connection.release();
    }
  }

  // Format message data
  static formatMessage(row) {
    return {
      id: row.id,
      userId: row.user_id,
      conversationId: row.conversation_id,
      role: row.role,
      content: row.content,
      createdAt: row.createdAt,
    };
  }
}

export default Chat;

