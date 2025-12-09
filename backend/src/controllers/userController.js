import User from "../models/User.js";
import { pool } from "../config/db.js";

// GET /users/me - Get current user profile
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      user: {
        id: user.id,
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
    const userId = req.user.id;
    const { name, phone, bio, location, skills, availability, avatarUrl, socials } = req.body;
    
    // Build update object
    const updateData = {};
    
    // Update main user fields
    if (name !== undefined) updateData.name = name;

    // Build profile update object
    if (phone !== undefined || bio !== undefined || location !== undefined || 
        skills !== undefined || availability !== undefined || avatarUrl !== undefined || 
        socials !== undefined) {
      updateData.profile = {};
      if (phone !== undefined) updateData.profile.phone = phone;
      if (bio !== undefined) updateData.profile.bio = bio;
      if (location !== undefined) updateData.profile.location = location;
      if (skills !== undefined) updateData.profile.skills = skills;
      if (availability !== undefined) updateData.profile.availability = availability;
      if (avatarUrl !== undefined) updateData.profile.avatarUrl = avatarUrl;
      if (socials !== undefined) updateData.profile.socials = socials;
    }

    const user = await User.update(userId, updateData);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      user: {
        id: user.id,
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
    const userId = req.user.id;
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Delete all related data (foreign keys will handle cascading)
      await connection.execute("DELETE FROM users WHERE id = ?", [userId]);

      await connection.commit();
      
      return res.status(200).json({ 
        message: "User and all associated data deleted successfully" 
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
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
        id: user.id,
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

    const result = await User.findAll({ page, limit });

    return res.status(200).json({
      users: result.users,
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        pages: result.pages,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};

