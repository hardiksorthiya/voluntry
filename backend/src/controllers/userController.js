import User from "../models/User.js";
import ChatMessage from "../models/ChatMessage.js";
import VolunteerActivity from "../models/VolunteerActivity.js";
import Activity from "../models/Activity.js";
import Attendance from "../models/Attendance.js";

// GET /users/me - Get current user profile
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
        stats: user.stats,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch profile", error: error.message });
  }
};

// PUT /users/me - Update current user profile (partial update)
export const updateCurrentUser = async (req, res) => {
  try {
    const { name, phone, bio, location, skills, availability, avatarUrl, socials } = req.body;
    
    // Build update object
    const updateFields = {};
    
    // Update main user fields
    if (name !== undefined) updateFields.name = name;

    // Build profile update object using dot notation
    if (phone !== undefined) updateFields['profile.phone'] = phone;
    if (bio !== undefined) updateFields['profile.bio'] = bio;
    if (location !== undefined) updateFields['profile.location'] = location;
    if (skills !== undefined) updateFields['profile.skills'] = skills;
    if (availability !== undefined) updateFields['profile.availability'] = availability;
    if (avatarUrl !== undefined) updateFields['profile.avatarUrl'] = avatarUrl;
    if (socials !== undefined) updateFields['profile.socials'] = socials;

    // Use findByIdAndUpdate with $set to ensure nested documents are saved
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
        stats: user.stats,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};

// DELETE /users/me - Delete current user (soft or hard delete)
export const deleteCurrentUser = async (req, res) => {
  try {
    const userId = req.user._id;

    // Delete all related data
    await Promise.all([
      ChatMessage.deleteMany({ user: userId }),
      VolunteerActivity.deleteMany({ user: userId }),
      Activity.deleteMany({ owner: userId }),
      Activity.updateMany(
        { "participants.user": userId },
        { $pull: { participants: { user: userId } } }
      ),
      Attendance.deleteMany({ user: userId }),
      User.findByIdAndDelete(userId),
    ]);

    return res.status(200).json({ 
      message: "User and all associated data deleted successfully" 
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete user", error: error.message });
  }
};

// GET /users/:id - Get public view of user profile
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return public view (no sensitive fields)
    return res.status(200).json({
      userPublic: {
        id: user._id,
        name: user.name,
        profile: {
          bio: user.profile?.bio,
          location: user.profile?.location,
          skills: user.profile?.skills,
          avatarUrl: user.profile?.avatarUrl,
          socials: user.profile?.socials,
        },
        stats: {
          hoursContributed: user.stats?.hoursContributed || 0,
          eventsCompleted: user.stats?.eventsCompleted || 0,
          impactPoints: user.stats?.impactPoints || 0,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch user", error: error.message });
  }
};

// GET /users - Admin endpoint to list users with pagination
export const listUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find()
        .select("-password -refreshToken")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      User.countDocuments(),
    ]);

    return res.status(200).json({
      users,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};

