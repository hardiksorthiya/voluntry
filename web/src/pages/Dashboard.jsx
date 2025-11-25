import { useEffect, useState } from "react";
import useVolunteerStore from "../store/useVolunteerStore";
import StatCard from "../components/StatCard";
import ActivityList from "../components/ActivityList";

const emptyActivity = {
  title: "",
  description: "",
  status: "planned",
  hours: 1,
  impactScore: 1,
};

const Dashboard = () => {
  const { stats, activities, fetchDashboard, saveActivity, deleteActivity } =
    useVolunteerStore();
  const [form, setForm] = useState(emptyActivity);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const submitActivity = async (e) => {
    e.preventDefault();
    await saveActivity(form);
    setForm(emptyActivity);
  };

  const editActivity = (activity) => setForm(activity);

  return (
    <div className="dashboard">
      <section className="stats-grid">
        <StatCard label="Hours" value={stats?.hoursContributed ?? 0} accent="#a7f3d0" />
        <StatCard
          label="Events"
          value={stats?.eventsCompleted ?? 0}
          accent="#bfdbfe"
        />
        <StatCard
          label="Impact points"
          value={stats?.impactPoints ?? 0}
          accent="#fde68a"
        />
      </section>

      <section className="activity-section">
        <form className="activity-form" onSubmit={submitActivity}>
          <h3>{form._id ? "Edit activity" : "Add activity"}</h3>
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
          />
          <div className="grid-two">
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="planned">Planned</option>
              <option value="in_progress">In progress</option>
              <option value="completed">Completed</option>
            </select>
            <input
              type="number"
              min="0"
              placeholder="Hours"
              value={form.hours}
              onChange={(e) => setForm({ ...form, hours: Number(e.target.value) })}
            />
          </div>
          <input
            type="number"
            min="0"
            placeholder="Impact score"
            value={form.impactScore}
            onChange={(e) =>
              setForm({ ...form, impactScore: Number(e.target.value) })
            }
          />
          <button type="submit">{form._id ? "Update" : "Save"} activity</button>
        </form>

        <ActivityList
          activities={activities}
          onEdit={editActivity}
          onDelete={deleteActivity}
        />
      </section>
    </div>
  );
};

export default Dashboard;

