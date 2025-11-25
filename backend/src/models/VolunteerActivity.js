import mongoose from "mongoose";

const volunteerActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    status: {
      type: String,
      enum: ["planned", "in_progress", "completed"],
      default: "planned",
    },
    hours: {
      type: Number,
      default: 0,
    },
    impactScore: {
      type: Number,
      default: 0,
    },
    date: Date,
  },
  { timestamps: true }
);

const VolunteerActivity = mongoose.model(
  "VolunteerActivity",
  volunteerActivitySchema
);

export default VolunteerActivity;

