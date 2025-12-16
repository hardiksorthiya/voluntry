import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Activities from "./pages/Activities";
import History from "./pages/History";
import Settings from "./pages/Settings";
import useVolunteerStore from "./store/useVolunteerStore";

const App = () => {
  const { user, hydrate } = useVolunteerStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <div className="app-shell">
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/activities"
          element={
            <ProtectedRoute>
              <Layout>
                <Activities />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <Layout>
                <History />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            user && localStorage.getItem("token") ? (
              <Navigate to="/" replace />
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/signup"
          element={
            user && localStorage.getItem("token") ? (
              <Navigate to="/" replace />
            ) : (
              <Signup />
            )
          }
        />
      </Routes>
    </div>
  );
};

export default App;
