import User from "../models/User.js";
import Activity from "../models/Activity.js";

// POST /upload/avatar - Upload avatar
export const uploadAvatar = async (req, res) => {
  try {
    // TODO: Implement actual file upload with multer
    // For now, this is a placeholder that accepts a URL
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ message: "File or URL is required" });
    }

    // Update user's avatar
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.profile.avatarUrl = url;
    await user.save();

    return res.status(200).json({ url });
  } catch (error) {
    return res.status(500).json({ message: "Failed to upload avatar", error: error.message });
  }
};

// POST /activities/:id/media - Upload activity media
export const uploadActivityMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const { mediaUrls } = req.body; // Array of URLs
    
    if (!mediaUrls || !Array.isArray(mediaUrls)) {
      return res.status(400).json({ message: "mediaUrls array is required" });
    }

    const activity = await Activity.findById(id);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Check if user is owner or admin
    if (activity.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only owner or admin can upload media" });
    }

    // Add media URLs
    activity.mediaUrls = [...(activity.mediaUrls || []), ...mediaUrls];
    await activity.save();

    return res.status(201).json({ mediaUrls: activity.mediaUrls });
  } catch (error) {
    return res.status(500).json({ message: "Failed to upload media", error: error.message });
  }
};

