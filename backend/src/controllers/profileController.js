import User from "../models/User.js";
import { pool } from "../config/db.js";

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: user.profile,
      stats: user.stats,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch profile", error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, bio, phone, location, skills, availability, avatarUrl, socials } = req.body;
    
    // Build update object
    const updateData = {};
    
    // Update main user fields
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) {
      // Check if email is already taken by another user
      const existingUser = await User.findByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        return res.status(409).json({ message: "Email already in use" });
      }
      updateData.email = email;
    }

    // Build profile update object
    if (bio !== undefined || phone !== undefined || location !== undefined || 
        skills !== undefined || availability !== undefined || avatarUrl !== undefined || 
        socials !== undefined) {
      updateData.profile = {};
      if (bio !== undefined) updateData.profile.bio = bio;
      if (phone !== undefined) updateData.profile.phone = phone;
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

    return res.json({
      message: "Profile updated successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profile: user.profile,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Delete all related data (foreign keys will handle cascading)
      await connection.execute("DELETE FROM users WHERE id = ?", [userId]);

      await connection.commit();
      
      return res.json({ 
        message: "Profile and all associated data deleted successfully" 
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete profile", error: error.message });
  }
};

