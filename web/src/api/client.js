import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

// Log API URL in development for debugging
if (import.meta.env.DEV) {
  console.log("API URL:", API_URL);
}

const client = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 second timeout
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for better error logging
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (import.meta.env.DEV) {
      console.error("API Error:", {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
    }
    return Promise.reject(error);
  }
);

export default client;

