import axios from "axios";

const API = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000/api",
});

API.interceptors.request.use((config) => {
  if (API.token) {
    config.headers.Authorization = `Bearer ${API.token}`;
  }
  return config;
});

export const setToken = (token) => {
  API.token = token;
};

export default API;

