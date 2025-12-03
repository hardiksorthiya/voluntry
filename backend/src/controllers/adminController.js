import User from "../models/User.js";
import Activity from "../models/Activity.js";

// GET /admin/users - Admin list users
export const listUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const { search, role } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (role) {
      query.role = role;
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select("-password -refreshToken")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      User.countDocuments(query),
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

// PUT /admin/users/:id/role - Change user role
export const changeUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!role || !["user", "manager", "admin"].includes(role)) {
      return res.status(400).json({ message: "Valid role (user/manager/admin) is required" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select("-password -refreshToken");

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
    
    // Prevent deleting yourself
    if (id === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot delete your own account" });
    }

    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Clean up related data
    await Promise.all([
      Activity.deleteMany({ owner: id }),
      Activity.updateMany(
        { "participants.user": id },
        { $pull: { participants: { user: id } } }
      ),
    ]);

    return res.status(200).json({ message: "User removed successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to remove user", error: error.message });
  }
};

// GET /admin/activities - Admin control activities
export const listActivities = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const { search, state, status } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (state) {
      query.state = state;
    }
    if (status) {
      query.status = status;
    }

    const [activities, total] = await Promise.all([
      Activity.find(query)
        .populate("owner", "name email")
        .populate("participants.user", "name email")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
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
    return res.status(500).json({ message: "Failed to fetch activities", error: error.message });
  }
};

