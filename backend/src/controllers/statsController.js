import User from "../models/User.js";
import Activity from "../models/Activity.js";
import Attendance from "../models/Attendance.js";

// GET /stats/overview - Admin/manager overview
export const getOverview = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalActivities = await Activity.countDocuments();
    
    const ongoing = await Activity.countDocuments({ status: "ongoing" });
    const completed = await Activity.countDocuments({ status: "completed" });

    // Monthly signups (last 12 months)
    const monthlySignups = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const count = await User.countDocuments({
        createdAt: { $gte: monthStart, $lte: monthEnd },
      });
      monthlySignups.push({
        month: monthStart.toISOString().slice(0, 7),
        count,
      });
    }

    return res.status(200).json({
      totalUsers,
      totalActivities,
      ongoing,
      completed,
      monthlySignups,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load overview", error: error.message });
  }
};

// GET /stats/activity/:id - Activity-specific metrics
export const getActivityStats = async (req, res) => {
  try {
    const { id } = req.params;
    
    const activity = await Activity.findById(id);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Attendance over time
    const attendanceRecords = await Attendance.find({ activity: id })
      .sort({ createdAt: 1 });
    
    const attendanceOverTime = attendanceRecords.map((record) => ({
      date: record.createdAt,
      present: record.status === "present" ? 1 : 0,
      absent: record.status === "absent" ? 1 : 0,
    }));

    // Participants count
    const participantsCount = activity.participants.length;
    const totalParticipants = activity.participants.reduce(
      (sum, p) => sum + (p.participantsCount || 1),
      0
    );

    // Feedback (if you add feedback model later)
    const feedback = [];

    return res.status(200).json({
      attendanceOverTime,
      participantsCount,
      totalParticipants,
      feedback,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load activity stats", error: error.message });
  }
};

// GET /stats/user/:id - User performance stats
export const getUserStats = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user is admin/manager or the owner
    if (req.user._id.toString() !== id && req.user.role !== "admin" && req.user.role !== "manager") {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Count activities where user is participant
    const participatedCount = await Activity.countDocuments({
      "participants.user": id,
    });

    // Count activities where user is owner
    const ownedCount = await Activity.countDocuments({ owner: id });

    // Calculate hours (you might want to add this to Activity model)
    const hours = user.stats?.hoursContributed || 0;

    // Get roles (participant, owner)
    const roles = [];
    if (participatedCount > 0) roles.push("participant");
    if (ownedCount > 0) roles.push("owner");

    return res.status(200).json({
      participatedCount,
      ownedCount,
      hours,
      roles,
      stats: user.stats,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load user stats", error: error.message });
  }
};

// Keep dashboard stats for backward compatibility
export const getDashboardStats = async (req, res) => {
  try {
    const stats = req.user.stats ?? {
      hoursContributed: 0,
      eventsCompleted: 0,
      impactPoints: 0,
    };

    return res.json({
      stats,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load dashboard", error: error.message });
  }
};

