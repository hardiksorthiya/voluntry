import "./ActivityList.css";

const statusColors = {
  planned: "#fbbf24",
  in_progress: "#34d399",
  completed: "#60a5fa",
};

const ActivityList = ({ activities = [], onEdit, onDelete }) => (
  <div className="activity-list">
    {activities.map((activity) => (
      <div key={activity._id} className="activity-card">
        <div>
          <p className="activity-title">{activity.title}</p>
          <p className="activity-desc">{activity.description}</p>
        </div>
        <div className="activity-meta">
          <span
            className="activity-status"
            style={{ background: statusColors[activity.status] }}
          >
            {activity.status.replace("_", " ")}
          </span>
          <p>{activity.hours}h</p>
        </div>
        <div className="activity-actions">
          <button onClick={() => onEdit(activity)}>Edit</button>
          <button onClick={() => onDelete(activity._id)}>Delete</button>
        </div>
      </div>
    ))}
  </div>
);

export default ActivityList;

