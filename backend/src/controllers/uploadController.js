import User from "../models/User.js";

// POST /upload/avatar - Upload avatar
export const uploadAvatar = async (req, res) => {
  try {
    // TODO: Implement actual file upload with multer
    // For now, this is a placeholder that accepts a URL
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ message: "File or URL is required" });
    }

    const userId = req.user.id;
    const user = await User.update(userId, {
      profile: { avatarUrl: url },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ url });
  } catch (error) {
    return res.status(500).json({ message: "Failed to upload avatar", error: error.message });
  }
};

