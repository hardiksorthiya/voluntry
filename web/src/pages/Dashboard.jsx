import { useEffect } from "react";
import useVolunteerStore from "../store/useVolunteerStore";
import "./Dashboard.css";

const Dashboard = () => {
  const { stats, fetchDashboard, user } = useVolunteerStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const statCards = [
    {
      label: "Hours Contributed",
      value: stats?.hoursContributed ?? 0,
      icon: "⏱️",
      color: "#8b5cf6",
      bgColor: "#f3f4f6",
    },
    {
      label: "Events Completed",
      value: stats?.eventsCompleted ?? 0,
      icon: "📅",
      color: "#3b82f6",
      bgColor: "#eff6ff",
    },
    {
      label: "Impact Points",
      value: stats?.impactPoints ?? 0,
      icon: "⭐",
      color: "#f59e0b",
      bgColor: "#fffbeb",
    },
    {
      label: "Active Projects",
      value: stats?.activeProjects ?? 0,
      icon: "🚀",
      color: "#ec4899",
      bgColor: "#fdf2f8",
    },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.name || "User"}! 👋</h1>
          <p>Here's your volunteer impact summary</p>
        </div>
      </div>

      <div className="stats-grid">
        {statCards.map((card, index) => (
          <div key={index} className="stat-card-modern">
            <div className="stat-card-header">
              <div
                className="stat-icon-wrapper"
                style={{ backgroundColor: card.bgColor }}
              >
                <span className="stat-icon">{card.icon}</span>
              </div>
              <button className="stat-menu-btn">⋯</button>
            </div>
            <div className="stat-content">
              <p className="stat-value-modern">{card.value.toLocaleString()}</p>
              <p className="stat-label-modern">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-charts">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Activity Overview</h3>
            <select className="chart-filter">
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
          </div>
          <div className="chart-placeholder">
            <p>Chart visualization coming soon</p>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Impact Distribution</h3>
          </div>
          <div className="chart-placeholder">
            <p>Chart visualization coming soon</p>
          </div>
        </div>
      </div>

      <div className="dashboard-bottom">
        <div className="activity-list-card">
          <h3>Recent Activities</h3>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">🌱</div>
              <div className="activity-info">
                <p className="activity-title">Community Garden Project</p>
                <p className="activity-date">2 days ago</p>
              </div>
              <span className="activity-badge">Completed</span>
            </div>
            <div className="activity-item">
              <div className="activity-icon">📚</div>
              <div className="activity-info">
                <p className="activity-title">Reading Program</p>
                <p className="activity-date">5 days ago</p>
              </div>
              <span className="activity-badge">Completed</span>
            </div>
            <div className="activity-item">
              <div className="activity-icon">🏥</div>
              <div className="activity-info">
                <p className="activity-title">Health Awareness Campaign</p>
                <p className="activity-date">1 week ago</p>
              </div>
              <span className="activity-badge">Completed</span>
            </div>
          </div>
        </div>

        <div className="impact-card">
          <h3>This Month's Impact</h3>
          <div className="impact-content">
            <div className="impact-value">{stats?.impactPoints ?? 0}</div>
            <p className="impact-label">Total Impact Points</p>
            <div className="impact-trend">
              <span className="trend-up">↑ 12%</span>
              <span className="trend-text">from last month</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

