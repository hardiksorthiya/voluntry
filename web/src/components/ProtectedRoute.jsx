import { Navigate } from "react-router-dom";
import useVolunteerStore from "../store/useVolunteerStore";

const ProtectedRoute = ({ children }) => {
  const { user } = useVolunteerStore();
  const token = localStorage.getItem("token");

  if (!user && !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

