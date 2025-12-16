import { Link, useLocation, useNavigate } from "react-router-dom";
import useVolunteerStore from "../store/useVolunteerStore";
import "./Sidebar.css";

const Sidebar = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useVolunteerStore();

  const menuItems = [
    { path: "/", label: "Overview", icon: "📊" },
    { path: "/profile", label: "Profile", icon: "👤" },
    { path: "/activities", label: "Activities", icon: "📋" },
    { path: "/history", label: "History", icon: "📜" },
    { path: "/settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-icon">V+</span>
          {!collapsed && <span className="logo-text">volunteer connect</span>}
        </div>
      </div>

      <button 
        className={`sidebar-primary-btn ${collapsed ? "collapsed" : ""}`} 
        onClick={() => navigate("/activities")}
        title={collapsed ? "New Activity" : ""}
      >
        <span className="btn-icon">+</span>
        {!collapsed && <span>New Activity</span>}
      </button>

      <nav className="sidebar-nav">
        <ul className="nav-menu">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-item ${isActive ? "active" : ""} ${collapsed ? "collapsed" : ""}`}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!collapsed && <span className="nav-label">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {!collapsed && (
        <div className="sidebar-footer">
          <div className="mobile-app-promo">
            <div className="promo-icon">📱</div>
            <div className="promo-content">
              <p className="promo-title">Get mobile app</p>
              <div className="app-stores">
                <span className="store-icon">📱</span>
                <span className="store-icon">🍎</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;

