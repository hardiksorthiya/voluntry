import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import useVolunteerStore from "./store/useVolunteerStore";

const App = () => {
  const { user, hydrate } = useVolunteerStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <div className="app-shell">
      {user && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/" replace /> : <Signup />}
        />
      </Routes>
    </div>
  );
};

export default App;
