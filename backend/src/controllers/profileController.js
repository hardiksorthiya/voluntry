import User from "../models/User.js";
import ChatMessage from "../models/ChatMessage.js";
import VolunteerActivity from "../models/VolunteerActivity.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({
      _id: user._id,
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
    const { name, email, bio, phone, location, skills, availability, avatarUrl, socials } = req.body;
    
    // Build update object
    const updateFields = {};
    
    // Update main user fields
    if (name !== undefined) updateFields.name = name;
    if (email !== undefined) {
      // Check if email is already taken by another user
      const existingUser = await User.findOne({ email, _id: { $ne: req.user._id } });
      if (existingUser) {
        return res.status(409).json({ message: "Email already in use" });
      }
      updateFields.email = email;
    }

    // Build profile update object
    const profileUpdate = {};
    if (bio !== undefined) profileUpdate['profile.bio'] = bio;
    if (phone !== undefined) profileUpdate['profile.phone'] = phone;
    if (location !== undefined) profileUpdate['profile.location'] = location;
    if (skills !== undefined) profileUpdate['profile.skills'] = skills;
    if (availability !== undefined) profileUpdate['profile.availability'] = availability;
    if (avatarUrl !== undefined) profileUpdate['profile.avatarUrl'] = avatarUrl;
    if (socials !== undefined) profileUpdate['profile.socials'] = socials;

    // Merge all updates
    const finalUpdate = { ...updateFields, ...profileUpdate };

    // Use findByIdAndUpdate with $set to ensure nested documents are saved
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: finalUpdate },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
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
    const userId = req.user._id;

    // Delete all related data
    await Promise.all([
      ChatMessage.deleteMany({ user: userId }),
      VolunteerActivity.deleteMany({ user: userId }),
      User.findByIdAndDelete(userId),
    ]);

    return res.json({ 
      message: "Profile and all associated data deleted successfully" 
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete profile", error: error.message });
  }
};

