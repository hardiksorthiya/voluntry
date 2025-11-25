import User from "../models/User.js";
import VolunteerActivity from "../models/VolunteerActivity.js";

export const getDashboardStats = async (req, res) => {
  try {
    const stats = req.user.stats ?? {
      hoursContributed: 0,
      eventsCompleted: 0,
      impactPoints: 0,
    };

    const recentActivities = await VolunteerActivity.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    return res.json({
      stats,
      recentActivities,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load dashboard", error: error.message });
  }
};

export const getLeaderboard = async (_req, res) => {
  try {
    const leaderboard = await User.find()
      .sort({ "stats.impactPoints": -1 })
      .limit(10)
      .select("name stats");
    return res.json(leaderboard);
  } catch (error) {
    return res.status(500).json({ message: "Failed to load leaderboard", error: error.message });
  }
};

