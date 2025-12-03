import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    activity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Activity",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["present", "absent"],
      required: true,
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Indexes
attendanceSchema.index({ activity: 1, user: 1 });
attendanceSchema.index({ user: 1 });

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;

