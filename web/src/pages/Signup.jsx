import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useVolunteerStore from "../store/useVolunteerStore";

const Signup = () => {
  const navigate = useNavigate();
  const { signup, loading, error } = useVolunteerStore();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(form);
      navigate("/");
    } catch (error) {
      // Error is already handled and displayed via the store's error state
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="auth-card">
      <h2>Join Voluntry</h2>
      <p>Create an account to track your volunteer journey.</p>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
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
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Signup;

