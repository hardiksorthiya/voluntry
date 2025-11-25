import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useVolunteerStore from "../store/useVolunteerStore";

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useVolunteerStore();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="auth-card">
      <h2>Welcome back 👋</h2>
      <p>Continue making impact by logging in.</p>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          placeholder="email@example.com"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
      <p>
        Need an account? <Link to="/signup">Create one</Link>
      </p>
    </div>
  );
};

export default Login;

