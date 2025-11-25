import VolunteerActivity from "../models/VolunteerActivity.js";
import User from "../models/User.js";

export const listActivities = async (req, res) => {
  try {
    const activities = await VolunteerActivity.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    return res.json(activities);
  } catch (error) {
    return res.status(500).json({ message: "Failed to list activities", error: error.message });
  }
};

export const createActivity = async (req, res) => {
  try {
    const activity = await VolunteerActivity.create({
      ...req.body,
      user: req.user._id,
    });
    return res.status(201).json(activity);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create activity", error: error.message });
  }
};

export const updateActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await VolunteerActivity.findOneAndUpdate(
      { _id: id, user: req.user._id },
      req.body,
      { new: true }
    );
    return res.json(activity);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update activity", error: error.message });
  }
};

export const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;
    await VolunteerActivity.findOneAndDelete({ _id: id, user: req.user._id });
    return res.json({ message: "Activity deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete activity", error: error.message });
  }
};

export const refreshStats = async (req, res) => {
  try {
    const activities = await VolunteerActivity.find({ user: req.user._id });
    const totals = activities.reduce(
      (acc, activity) => {
        acc.hours += activity.hours ?? 0;
        acc.events += activity.status === "completed" ? 1 : 0;
        acc.impact += activity.impactScore ?? 0;
        return acc;
      },
      { hours: 0, events: 0, impact: 0 }
    );

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        stats: {
          hoursContributed: totals.hours,
          eventsCompleted: totals.events,
          impactPoints: totals.impact,
        },
      },
      { new: true }
    );

    return res.json(user.stats);
  } catch (error) {
    return res.status(500).json({ message: "Failed to refresh stats", error: error.message });
  }
};

