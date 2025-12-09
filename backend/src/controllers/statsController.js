import User from "../models/User.js";
import { isValidId } from "../utils/validation.js";
import { pool } from "../config/db.js";

// GET /stats/overview - Admin/manager overview
export const getOverview = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    try {
      // Get counts
      const [userCount] = await connection.execute("SELECT COUNT(*) as total FROM users");

      const totalUsers = userCount[0].total;

      // Monthly signups (last 12 months)
      const monthlySignups = [];
      const now = new Date();
      for (let i = 11; i >= 0; i--) {
        const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
        const [countResult] = await connection.execute(
          "SELECT COUNT(*) as total FROM users WHERE createdAt >= ? AND createdAt <= ?",
          [monthStart, monthEnd]
        );
        monthlySignups.push({
          month: monthStart.toISOString().slice(0, 7),
          count: countResult[0].total,
        });
      }

      return res.status(200).json({
        totalUsers,
        monthlySignups,
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    return res.status(500).json({ message: "Failed to load overview", error: error.message });
  }
};


// GET /stats/user/:id - User performance stats (public)
export const getUserStats = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate hours
    const hours = user.stats?.hoursContributed || 0;

    return res.status(200).json({
      hours,
      stats: user.stats,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load user stats", error: error.message });
  }
};

// Keep dashboard stats for backward compatibility (public)
export const getDashboardStats = async (req, res) => {
  try {
    // Return default stats since we don't have user context without auth
    const stats = {
      hoursContributed: 0,
      eventsCompleted: 0,
      impactPoints: 0,
    };

    return res.json({
      stats,
      message: "For user-specific stats, use /stats/user/:id endpoint",
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load dashboard", error: error.message });
  }
};
