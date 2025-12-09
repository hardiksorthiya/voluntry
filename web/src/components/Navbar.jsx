import { Link, useNavigate } from "react-router-dom";
import useVolunteerStore from "../store/useVolunteerStore";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useVolunteerStore();

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
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

