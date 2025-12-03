import Activity from "../models/Activity.js";
import Attendance from "../models/Attendance.js";
import User from "../models/User.js";

// POST /activities - Create a new activity
export const createActivity = async (req, res) => {
  try {
    const { title, description, date, location, slots, tags } = req.body;
    
    if (!title || !date) {
      return res.status(400).json({ message: "Title and date are required" });
    }

    const activity = await Activity.create({
      owner: req.user._id,
      title,
      description,
      date: new Date(date),
      location,
      slots: slots || 0,
      tags: tags || [],
      state: "draft",
      status: "upcoming",
    });

    return res.status(201).json({ activity });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create activity", error: error.message });
  }
};

// GET /activities - Public listing with filters and pagination
export const listActivities = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const { tag, search, from, to, sort = "-createdAt" } = req.query;
    
    // Build query
    const query = {};
    
    // Only show open/active activities for public listing
    query.state = { $in: ["open", "closed"] };
    
    if (tag) {
      query.tags = tag;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from);
      if (to) query.date.$lte = new Date(to);
    }
    
    const [activities, total] = await Promise.all([
      Activity.find(query)
        .populate("owner", "name email profile.avatarUrl")
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Activity.countDocuments(query),
    ]);

    return res.status(200).json({
      activities,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to list activities", error: error.message });
  }
};

// GET /activities/:id - Get activity details
export const getActivityById = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await Activity.findById(id)
      .populate("owner", "name email profile.avatarUrl")
      .populate("participants.user", "name email profile.avatarUrl");
    
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    return res.status(200).json({ activity });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch activity", error: error.message });
  }
};

// PUT /activities/:id - Update activity (owner or admin only)
export const updateActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, status, location, slots, tags } = req.body;
    
    const activity = await Activity.findById(id);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Check if user is owner or admin
    if (activity.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only owner or admin can edit this activity" });
    }

    // Update fields
    if (title !== undefined) activity.title = title;
    if (description !== undefined) activity.description = description;
    if (date !== undefined) activity.date = new Date(date);
    if (status !== undefined) activity.status = status;
    if (location !== undefined) activity.location = location;
    if (slots !== undefined) activity.slots = slots;
    if (tags !== undefined) activity.tags = tags;

    await activity.save();

    return res.status(200).json({ activity });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update activity", error: error.message });
  }
};

// DELETE /activities/:id - Delete activity (owner or admin only)
export const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;
    
    const activity = await Activity.findById(id);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Check if user is owner or admin
    if (activity.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only owner or admin can delete this activity" });
    }

    // Delete related attendance records
    await Attendance.deleteMany({ activity: id });
    
    // Delete activity
    await Activity.findByIdAndDelete(id);

    return res.status(200).json({ message: "Activity deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete activity", error: error.message });
  }
};

// POST /activities/:id/join - User joins activity
export const joinActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { participants: participantsCount = 1 } = req.body;
    
    const activity = await Activity.findById(id);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    if (activity.state !== "open") {
      return res.status(400).json({ message: "Activity is not open for joining" });
    }

    // Check if already joined
    const existingParticipant = activity.participants.find(
      (p) => p.user.toString() === req.user._id.toString()
    );
    
    if (existingParticipant) {
      return res.status(400).json({ message: "Already joined this activity" });
    }

    // Check slots availability
    const currentParticipants = activity.participants.reduce(
      (sum, p) => sum + (p.participantsCount || 1),
      0
    );
    
    if (activity.slots > 0 && currentParticipants + participantsCount > activity.slots) {
      return res.status(400).json({ message: "Not enough slots available" });
    }

    // Add participant
    activity.participants.push({
      user: req.user._id,
      participantsCount,
    });

    await activity.save();
    await activity.populate("participants.user", "name email profile.avatarUrl");

    return res.status(200).json({
      message: "Successfully joined activity",
      activity,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to join activity", error: error.message });
  }
};

// POST /activities/:id/leave - User leaves activity
export const leaveActivity = async (req, res) => {
  try {
    const { id } = req.params;
    
    const activity = await Activity.findById(id);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Remove participant
    activity.participants = activity.participants.filter(
      (p) => p.user.toString() !== req.user._id.toString()
    );

    await activity.save();
    await activity.populate("participants.user", "name email profile.avatarUrl");

    return res.status(200).json({
      message: "Successfully left activity",
      activity,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to leave activity", error: error.message });
  }
};

// POST /activities/:id/attendance - Record attendance (manager/admin only)
export const recordAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, status } = req.body;
    
    if (!userId || !status || !["present", "absent"].includes(status)) {
      return res.status(400).json({ message: "userId and status (present/absent) are required" });
    }

    const activity = await Activity.findById(id);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Check if user is manager or admin
    const isOwner = activity.owner.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin" && req.user.role !== "manager") {
      return res.status(403).json({ message: "Only manager or admin can record attendance" });
    }

    // Check if user is a participant
    const isParticipant = activity.participants.some(
      (p) => p.user.toString() === userId
    );
    
    if (!isParticipant) {
      return res.status(400).json({ message: "User is not a participant in this activity" });
    }

    // Create or update attendance record
    const attendance = await Attendance.findOneAndUpdate(
      { activity: id, user: userId },
      {
        activity: id,
        user: userId,
        status,
        recordedBy: req.user._id,
      },
      { upsert: true, new: true }
    ).populate("user", "name email").populate("recordedBy", "name email");

    return res.status(200).json({ attendanceRecord: attendance });
  } catch (error) {
    return res.status(500).json({ message: "Failed to record attendance", error: error.message });
  }
};

// POST /activities/:id/state - Change activity state (manager/admin only)
export const changeActivityState = async (req, res) => {
  try {
    const { id } = req.params;
    const { state } = req.body;
    
    if (!state || !["draft", "open", "closed", "cancelled"].includes(state)) {
      return res.status(400).json({ message: "Valid state (draft/open/closed/cancelled) is required" });
    }

    const activity = await Activity.findById(id);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Check if user is manager or admin
    const isOwner = activity.owner.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin" && req.user.role !== "manager") {
      return res.status(403).json({ message: "Only manager or admin can change activity state" });
    }

    activity.state = state;
    
    // Update status based on state
    if (state === "open" && activity.status === "upcoming") {
      activity.status = "ongoing";
    } else if (state === "closed") {
      activity.status = "completed";
    } else if (state === "cancelled") {
      activity.status = "cancelled";
    }

    await activity.save();

    return res.status(200).json({ activity });
  } catch (error) {
    return res.status(500).json({ message: "Failed to change activity state", error: error.message });
  }
};

// GET /users/:id/activities - Get activities for a user
export const getUserActivities = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.query; // "participant" or "owner"
    
    let query = {};
    
    if (role === "owner") {
      query.owner = id;
    } else if (role === "participant") {
      query["participants.user"] = id;
    } else {
      // Return both
      query.$or = [
        { owner: id },
        { "participants.user": id },
      ];
    }

    const activities = await Activity.find(query)
      .populate("owner", "name email profile.avatarUrl")
      .populate("participants.user", "name email profile.avatarUrl")
      .sort({ createdAt: -1 });

    return res.status(200).json({ activities });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch user activities", error: error.message });
  }
};

