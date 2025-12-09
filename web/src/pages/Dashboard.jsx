import { useEffect } from "react";
import useVolunteerStore from "../store/useVolunteerStore";
import StatCard from "../components/StatCard";

const Dashboard = () => {
  const { stats, fetchDashboard, user } = useVolunteerStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name || "User"}! 👋</h1>
        <p>Here's your volunteer impact summary</p>
      </div>

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
    </div>
  );
};

export default Dashboard;

