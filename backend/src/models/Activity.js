import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      trim: true,
    },
    slots: {
      type: Number,
      default: 0,
      min: 0,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    state: {
      type: String,
      enum: ["draft", "open", "closed", "cancelled"],
      default: "draft",
    },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },
    participants: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      joinedAt: {
        type: Date,
        default: Date.now,
      },
      participantsCount: {
        type: Number,
        default: 1,
      },
    }],
    mediaUrls: [{
      type: String,
    }],
  },
  { timestamps: true }
);

// Indexes for better query performance
activitySchema.index({ owner: 1 });
activitySchema.index({ date: 1 });
activitySchema.index({ state: 1 });
activitySchema.index({ status: 1 });
activitySchema.index({ tags: 1 });

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;

