import "./StatCard.css";

const StatCard = ({ label, value, accent }) => (
  <div className="stat-card" style={{ borderColor: accent }}>
    <p className="stat-label">{label}</p>
    <p className="stat-value">{value}</p>
  </div>
);

export default StatCard;

