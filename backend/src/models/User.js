import bcrypt from "bcryptjs";
import { pool } from "../config/db.js";

class User {
  // Create a new user
  static async create(userData) {
    const connection = await pool.getConnection();
    try {
      const {
        name,
        email,
        password,
        role = "user",
        profile = {},
        stats = {},
      } = userData;

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Prepare profile data
      const profileSkills = profile.skills ? JSON.stringify(profile.skills) : null;
      const profileSocials = profile.socials ? JSON.stringify(profile.socials) : null;

      const query = `
        INSERT INTO users (
          name, email, password, role,
          profile_bio, profile_phone, profile_skills, profile_availability,
          profile_location, profile_avatarUrl, profile_socials,
          stats_hoursContributed, stats_eventsCompleted, stats_impactPoints
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const [result] = await connection.execute(query, [
        name,
        email,
        hashedPassword,
        role,
        profile.bio || null,
        profile.phone || null,
        profileSkills,
        profile.availability || "flexible",
        profile.location || null,
        profile.avatarUrl || null,
        profileSocials,
        stats.hoursContributed || 0,
        stats.eventsCompleted || 0,
        stats.impactPoints || 0,
      ]);

      return await this.findById(result.insertId);
    } finally {
      connection.release();
    }
  }

  // Find user by ID
  static async findById(id, includePassword = false) {
    const connection = await pool.getConnection();
    try {
      const selectFields = includePassword
        ? "*"
        : "id, name, email, role, refreshToken, profile_bio, profile_phone, profile_skills, profile_availability, profile_location, profile_avatarUrl, profile_socials, stats_hoursContributed, stats_eventsCompleted, stats_impactPoints, createdAt, updatedAt";

      const [rows] = await connection.execute(
        `SELECT ${selectFields} FROM users WHERE id = ?`,
        [id]
      );

      if (rows.length === 0) return null;
      return this.formatUser(rows[0], includePassword);
    } finally {
      connection.release();
    }
  }

  // Find user by email
  static async findByEmail(email, includePassword = false) {
    const connection = await pool.getConnection();
    try {
      const selectFields = includePassword
        ? "*"
        : "id, name, email, role, refreshToken, profile_bio, profile_phone, profile_skills, profile_availability, profile_location, profile_avatarUrl, profile_socials, stats_hoursContributed, stats_eventsCompleted, stats_impactPoints, createdAt, updatedAt";

      const [rows] = await connection.execute(
        `SELECT ${selectFields} FROM users WHERE email = ?`,
        [email.toLowerCase()]
      );

      if (rows.length === 0) return null;
      return this.formatUser(rows[0], includePassword);
    } finally {
      connection.release();
    }
  }

  // Update user
  static async update(id, updateData) {
    const connection = await pool.getConnection();
    try {
      const updates = [];
      const values = [];

      // Handle password update
      if (updateData.password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(updateData.password, salt);
        updates.push("password = ?");
        values.push(hashedPassword);
        delete updateData.password;
      }

      // Handle basic fields
      if (updateData.name !== undefined) {
        updates.push("name = ?");
        values.push(updateData.name);
      }
      if (updateData.email !== undefined) {
        updates.push("email = ?");
        values.push(updateData.email.toLowerCase());
      }
      if (updateData.role !== undefined) {
        updates.push("role = ?");
        values.push(updateData.role);
      }
      if (updateData.refreshToken !== undefined) {
        updates.push("refreshToken = ?");
        values.push(updateData.refreshToken);
      }

      // Handle profile fields
      if (updateData.profile) {
        if (updateData.profile.bio !== undefined) {
          updates.push("profile_bio = ?");
          values.push(updateData.profile.bio);
        }
        if (updateData.profile.phone !== undefined) {
          updates.push("profile_phone = ?");
          values.push(updateData.profile.phone);
        }
        if (updateData.profile.skills !== undefined) {
          updates.push("profile_skills = ?");
          values.push(JSON.stringify(updateData.profile.skills));
        }
        if (updateData.profile.availability !== undefined) {
          updates.push("profile_availability = ?");
          values.push(updateData.profile.availability);
        }
        if (updateData.profile.location !== undefined) {
          updates.push("profile_location = ?");
          values.push(updateData.profile.location);
        }
        if (updateData.profile.avatarUrl !== undefined) {
          updates.push("profile_avatarUrl = ?");
          values.push(updateData.profile.avatarUrl);
        }
        if (updateData.profile.socials !== undefined) {
          updates.push("profile_socials = ?");
          values.push(JSON.stringify(updateData.profile.socials));
        }
      }

      // Handle stats fields
      if (updateData.stats) {
        if (updateData.stats.hoursContributed !== undefined) {
          updates.push("stats_hoursContributed = ?");
          values.push(updateData.stats.hoursContributed);
        }
        if (updateData.stats.eventsCompleted !== undefined) {
          updates.push("stats_eventsCompleted = ?");
          values.push(updateData.stats.eventsCompleted);
        }
        if (updateData.stats.impactPoints !== undefined) {
          updates.push("stats_impactPoints = ?");
          values.push(updateData.stats.impactPoints);
        }
      }

      // Handle direct profile/stats updates (for backward compatibility)
      Object.keys(updateData).forEach((key) => {
        if (["name", "email", "role", "refreshToken", "password", "profile", "stats"].includes(key)) {
          return;
        }
        if (key.startsWith("profile_")) {
          updates.push(`${key} = ?`);
          values.push(updateData[key]);
        } else if (key.startsWith("stats_")) {
          updates.push(`${key} = ?`);
          values.push(updateData[key]);
        }
      });

      if (updates.length === 0) {
        return await this.findById(id);
      }

      values.push(id);
      await connection.execute(
        `UPDATE users SET ${updates.join(", ")} WHERE id = ?`,
        values
      );

      return await this.findById(id);
    } finally {
      connection.release();
    }
  }

  // Delete user
  static async delete(id) {
    const connection = await pool.getConnection();
    try {
      await connection.execute("DELETE FROM users WHERE id = ?", [id]);
      return true;
    } finally {
      connection.release();
    }
  }

  // Find all users with pagination
  static async findAll(options = {}) {
    const connection = await pool.getConnection();
    try {
      const { page = 1, limit = 20, search = "", role = "" } = options;
      const offset = (page - 1) * limit;

      let query = "SELECT id, name, email, role, profile_bio, profile_phone, profile_skills, profile_availability, profile_location, profile_avatarUrl, profile_socials, stats_hoursContributed, stats_eventsCompleted, stats_impactPoints, createdAt, updatedAt FROM users WHERE 1=1";
      const params = [];

      if (search) {
        query += " AND (name LIKE ? OR email LIKE ?)";
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm);
      }

      if (role) {
        query += " AND role = ?";
        params.push(role);
      }

      query += " ORDER BY createdAt DESC LIMIT ? OFFSET ?";
      params.push(limit, offset);

      const [rows] = await connection.execute(query, params);

      // Get total count
      let countQuery = "SELECT COUNT(*) as total FROM users WHERE 1=1";
      const countParams = [];
      if (search) {
        countQuery += " AND (name LIKE ? OR email LIKE ?)";
        const searchTerm = `%${search}%`;
        countParams.push(searchTerm, searchTerm);
      }
      if (role) {
        countQuery += " AND role = ?";
        countParams.push(role);
      }
      const [countResult] = await connection.execute(countQuery, countParams);
      const total = countResult[0].total;

      return {
        users: rows.map((row) => this.formatUser(row)),
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      };
    } finally {
      connection.release();
    }
  }

  // Format user data
  static formatUser(row, includePassword = false) {
    const user = {
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role === "volunteer" ? "user" : row.role, // Migrate volunteer to user
      profile: {
        bio: row.profile_bio || null,
        phone: row.profile_phone || null,
        skills: row.profile_skills ? JSON.parse(row.profile_skills) : [],
        availability: row.profile_availability || "flexible",
        location: row.profile_location || null,
        avatarUrl: row.profile_avatarUrl || null,
        socials: row.profile_socials ? JSON.parse(row.profile_socials) : [],
      },
      stats: {
        hoursContributed: row.stats_hoursContributed || 0,
        eventsCompleted: row.stats_eventsCompleted || 0,
        impactPoints: row.stats_impactPoints || 0,
      },
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };

    if (includePassword) {
      user.password = row.password;
    }

    if (row.refreshToken) {
      user.refreshToken = row.refreshToken;
    }

    return user;
  }

  // Compare password
  async comparePassword(candidate) {
    const user = await User.findById(this.id, true);
    if (!user || !user.password) {
      return false;
    }
    return bcrypt.compare(candidate, user.password);
  }
}

export default User;
