import { create } from "zustand";
import client from "../api/client";

const useVolunteerStore = create((set, get) => ({
  user: null,
  stats: null,
  loading: false,
  error: null,

  async hydrate() {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const { data } = await client.get("/users/me");
      set({
        user: {
          id: data.user?.id || data.user?._id,
          name: data.user?.name,
          email: data.user?.email,
        },
      });
    } catch (error) {
      console.error("Failed to hydrate session", error);
      localStorage.removeItem("token");
    }
  },

  setUser(user) {
    set({ user });
  },

  async login(credentials) {
    set({ loading: true, error: null });
    try {
      const { data } = await client.post("/auth/login", credentials);
      localStorage.setItem("token", data.token);
      set({ user: data.user, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message ?? "Login failed", loading: false });
      throw error;
    }
  },

  async signup(payload) {
    set({ loading: true, error: null });
    try {
      const { data } = await client.post("/auth/register", payload);
      localStorage.setItem("token", data.token);
      set({ user: data.user, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message ?? "Signup failed", loading: false });
      throw error;
    }
  },

  logout() {
    localStorage.removeItem("token");
    set({ user: null, stats: null });
  },

  async fetchDashboard() {
    try {
      const { data } = await client.get("/stats/dashboard");
      set({
        stats: data.stats ?? {
          hoursContributed: 0,
          eventsCompleted: 0,
          impactPoints: 0,
        },
      });
    } catch (error) {
      set({ error: error.response?.data?.message ?? "Failed to load dashboard" });
    }
  },
}));

export default useVolunteerStore;

