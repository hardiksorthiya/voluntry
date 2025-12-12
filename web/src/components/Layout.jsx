import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import useVolunteerStore from "../store/useVolunteerStore";
import "./Layout.css";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { user, logout } = useVolunteerStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="layout-container">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className={`main-content ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <header className="main-header">
          <button
            className="hamburger-menu-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <div className="header-search">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
            />
          </div>
          <div className="header-right">
            <button className="notification-btn" aria-label="Notifications">
              🔔
            </button>
            <div className="user-profile-container">
              <div 
                className="user-profile"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <div className="user-avatar">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <span className="user-name">{user?.name || "User"}</span>
                <span className="dropdown-icon">▼</span>
              </div>
              {profileDropdownOpen && (
                <div className="profile-dropdown">
                  <button 
                    className="dropdown-item"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      navigate("/profile");
                    }}
                  >
                    Profile
                  </button>
                  <button 
                    className="dropdown-item"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      navigate("/settings");
                    }}
                  >
                    Settings
                  </button>
                  <div className="dropdown-divider"></div>
                  <button 
                    className="dropdown-item logout"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="content-area">{children}</main>
      </div>
      {profileDropdownOpen && (
        <div
          className="dropdown-overlay"
          onClick={() => setProfileDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;

