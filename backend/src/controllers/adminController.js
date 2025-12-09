import User from "../models/User.js";
import { isValidId } from "../utils/validation.js";
import { pool } from "../config/db.js";

// GET /admin/users - Admin list users
export const listUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const { search, role } = req.query;

    const result = await User.findAll({ page, limit, search, role });

    return res.status(200).json({
      users: result.users,
      meta: result.meta,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};

// PUT /admin/users/:id/role - Change user role
export const changeUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    
    if (!role || !["user", "manager", "admin"].includes(role)) {
      return res.status(400).json({ message: "Valid role (user/manager/admin) is required" });
    }

    const user = await User.update(id, { role });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Failed to change user role", error: error.message });
  }
};

// DELETE /admin/users/:id - Remove user
export const removeUser = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user.id;
    
    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    // Prevent deleting yourself
    if (id == currentUserId) {
      return res.status(400).json({ message: "Cannot delete your own account" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Delete related data
      await connection.execute("DELETE FROM users WHERE id = ?", [id]);

      await connection.commit();
      
      return res.status(200).json({ message: "User removed successfully" });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    return res.status(500).json({ message: "Failed to remove user", error: error.message });
  }
};

