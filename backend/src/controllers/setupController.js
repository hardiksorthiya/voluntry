import User from "../models/User.js";

// PUT /setup/make-admin/:id - Make a user admin (for initial setup)
// NO AUTHENTICATION REQUIRED - for initial setup only
// Only works if no admins exist yet
export const makeUserAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if there are any existing admins
    const adminCount = await User.countDocuments({ role: "admin" });
    
    // Only allow if no admins exist (for initial setup)
    if (adminCount > 0) {
      return res.status(403).json({ 
        message: "Admin already exists. Please use /api/admin/users/:id/role endpoint with admin authentication to change roles." 
      });
    }

    // Find and update user
    const user = await User.findByIdAndUpdate(
      id,
      { role: "admin" },
      { new: true }
    ).select("-password -refreshToken");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ 
      message: "User role updated to admin successfully. You can now login as admin!",
      user 
    });
  } catch (error) {
    return res.status(500).json({ 
      message: "Failed to update user role", 
      error: error.message 
    });
  }
};

