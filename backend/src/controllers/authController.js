import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { signToken, signRefreshToken, verifyToken } from "../utils/token.js";

// POST /auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    // Validate email uniqueness
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const user = await User.create({ name, email, password });
    const token = signToken(user);
    const refreshToken = signRefreshToken(user);

    // Save refresh token
    await User.update(user.id, { refreshToken });

    return res.status(201).json({
      token,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Email already registered" });
    }
    return res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

// POST /auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findByEmail(email, true); // includePassword = true
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken(user);
    const refreshToken = signRefreshToken(user);

    // Save refresh token
    await User.update(user.id, { refreshToken });

    return res.status(200).json({
      token,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// POST /auth/refresh
export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    const decoded = verifyToken(refreshToken);
    if (decoded.type !== "refresh") {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const user = await User.findById(decoded.sub);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const newToken = signToken(user);
    const newRefreshToken = signRefreshToken(user);

    // Update refresh token
    await User.update(user.id, { refreshToken: newRefreshToken });

    return res.status(200).json({
      token: newToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid refresh token", error: error.message });
  }
};

// POST /auth/logout
export const logout = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      await User.update(user.id, { refreshToken: null });
    }

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Logout failed", error: error.message });
  }
};


