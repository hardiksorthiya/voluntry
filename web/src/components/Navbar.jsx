import { Link, useNavigate } from "react-router-dom";
import { useCallback } from "react";
import useVolunteerStore from "../store/useVolunteerStore";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useVolunteerStore();

  const handleLogout = useCallback(() => {
    logout();
    navigate("/login", { replace: true });
  }, [logout, navigate]);

  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => navigate("/")}>
        Voluntry
      </div>
      <div className="nav-links">
        <Link to="/">Dashboard</Link>
        <Link to="/profile">Profile</Link>
      </div>
      <div className="nav-actions">
        <span>{user?.name}</span>
        <button onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

