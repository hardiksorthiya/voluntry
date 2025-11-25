import { create } from "zustand";
import client from "../api/client";

const useVolunteerStore = create((set, get) => ({
  user: null,
  stats: null,
  activities: [],
  chatHistory: [],
  loading: false,
  error: null,

  async hydrate() {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const { data } = await client.get("/profile");
      set({
        user: {
          id: data._id,
          name: data.name,
          email: data.email,
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
      const { data } = await client.post("/auth/signup", payload);
      localStorage.setItem("token", data.token);
      set({ user: data.user, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message ?? "Signup failed", loading: false });
      throw error;
    }
  },

  logout() {
    localStorage.removeItem("token");
    set({ user: null, stats: null, activities: [], chatHistory: [] });
  },

  async fetchDashboard() {
    try {
      const [{ data }, { data: activities }] = await Promise.all([
        client.get("/stats/dashboard"),
        client.get("/volunteer"),
      ]);
      set({
        stats: data.stats ?? {
          hoursContributed: 0,
          eventsCompleted: 0,
          impactPoints: 0,
        },
        activities,
      });
    } catch (error) {
      set({ error: error.response?.data?.message ?? "Failed to load dashboard" });
    }
  },

  async saveActivity(activity) {
    const endpoint = activity._id ? `/volunteer/${activity._id}` : "/volunteer";
    const method = activity._id ? "put" : "post";
    const { data } = await client[method](endpoint, activity);
    await get().fetchDashboard();
    return data;
  },

  async deleteActivity(id) {
    await client.delete(`/volunteer/${id}`);
    await get().fetchDashboard();
  },

  async loadChatHistory() {
    try {
      const { data } = await client.get("/chat/history");
      set({ chatHistory: data });
    } catch (error) {
      set({ error: error.response?.data?.message ?? "Failed to load chat" });
    }
  },

  async sendChatMessage(content) {
    try {
      const { data } = await client.post("/chat", { content });
      set((state) => ({
        chatHistory: [...state.chatHistory, data.userMessage, data.aiMessage],
      }));
    } catch (error) {
      set({ error: error.response?.data?.message ?? "Failed to send message" });
    }
  },
}));

export default useVolunteerStore;

