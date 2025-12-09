import User from "../models/User.js";
import { isValidId } from "../utils/validation.js";
import { pool } from "../config/db.js";

// PUT /setup/make-admin/:id - Make a user admin (for initial setup)
// NO AUTHENTICATION REQUIRED - for initial setup only
// Only works if no admins exist yet
export const makeUserAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const connection = await pool.getConnection();
    try {
      // Check if there are any existing admins
      const [adminResult] = await connection.execute(
        "SELECT COUNT(*) as total FROM users WHERE role = ?",
        ["admin"]
      );
      const adminCount = adminResult[0].total;
      
      // Only allow if no admins exist (for initial setup)
      if (adminCount > 0) {
        return res.status(403).json({ 
          message: "Admin already exists. Please use /api/admin/users/:id/role endpoint with admin authentication to change roles." 
        });
      }

      // Find and update user
      const user = await User.update(id, { role: "admin" });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ 
        message: "User role updated to admin successfully. You can now login as admin!",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    return res.status(500).json({ 
      message: "Failed to update user role", 
      error: error.message 
    });
  }
};

