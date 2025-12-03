import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const socialSchema = new mongoose.Schema({
  provider: String,
  handle: String,
});

const profileSchema = new mongoose.Schema({
  bio: String,
  phone: String,
  skills: [String],
  availability: {
    type: String,
    default: "flexible",
  },
  location: String,
  avatarUrl: String,
  socials: [socialSchema],
});

const statsSchema = new mongoose.Schema({
  hoursContributed: {
    type: Number,
    default: 0,
  },
  eventsCompleted: {
    type: Number,
    default: 0,
  },
  impactPoints: {
    type: Number,
    default: 0,
  },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "manager", "admin", "volunteer"], // Keep "volunteer" for backward compatibility
      default: "user",
    },
    refreshToken: {
      type: String,
      select: false,
    },
    profile: profileSchema,
    stats: statsSchema,
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Initialize profile and stats if they don't exist (for backward compatibility)
userSchema.pre("save", function initializeSubdocuments() {
  if (!this.profile) {
    this.profile = {};
  }
  if (!this.stats) {
    this.stats = {
      hoursContributed: 0,
      eventsCompleted: 0,
      impactPoints: 0,
    };
  }
  // Migrate "volunteer" role to "user"
  if (this.role === "volunteer") {
    this.role = "user";
  }
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;

