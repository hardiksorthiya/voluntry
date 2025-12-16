import axios from "axios";
import { Platform } from "react-native";

// Get API URL from environment or use default
// For physical devices/emulators, replace localhost with your computer's IP address
// Example: http://192.168.1.100:4000/api
const getApiUrl = () => {
  // HARDCODED IP for your network - change this if your IP changes
  // Current IP detected: 192.168.1.6 (Auto-detected)
  const HARDCODED_IP = "192.168.1.6";
  const API_URL = `http://${HARDCODED_IP}:4000/api`;
  
  // If environment variable is set, use it (highest priority)
  if (process.env.EXPO_PUBLIC_API_URL) {
    console.log('🌐 Using API URL from .env:', process.env.EXPO_PUBLIC_API_URL);
    return process.env.EXPO_PUBLIC_API_URL;
  }
  
  // For physical devices, use hardcoded IP (your Ethernet IP)
  // This ensures it works even if .env isn't loaded
  console.log('🌐 Using hardcoded API URL:', API_URL);
  console.log('📱 Platform:', Platform.OS);
  
  // For Android Emulator, use 10.0.2.2 to access host machine
  if (Platform.OS === 'android' && __DEV__) {
    // Check if running on emulator (you can detect this better if needed)
    // For now, use hardcoded IP for physical devices
    return API_URL;
  }
  
  // For iOS Simulator or physical devices, use hardcoded IP
  return API_URL;
};

const baseURL = getApiUrl();
console.log('🚀 API Base URL:', baseURL);

const API = axios.create({
  baseURL: baseURL,
  timeout: 20000, // Increased timeout for slower connections
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use(
  (config) => {
    if (API.token) {
      config.headers.Authorization = `Bearer ${API.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      if (status === 401) {
        // Unauthorized - token might be invalid
        API.token = null;
      }
      
      return Promise.reject({
        message: data?.message || 'An error occurred',
        status,
        data,
      });
    } else if (error.request) {
      // Request was made but no response received
      console.error('❌ Network Error Details:');
      console.error('Request URL:', error.config?.url);
      console.error('Base URL:', error.config?.baseURL);
      console.error('Full URL:', error.config?.baseURL + error.config?.url);
      console.error('Error:', error.message);
      
      // Extract IP from baseURL for error message
      const ipMatch = baseURL.match(/http:\/\/([\d.]+):/);
      const serverIP = ipMatch ? ipMatch[1] : HARDCODED_IP;
      
      return Promise.reject({
        message: `Network error. Cannot reach server at ${baseURL}.\n\nQuick Fix:\n1. Run: npm run update-ip (auto-detects and updates IP)\n2. Or manually update HARDCODED_IP in src/api.js (currently: ${HARDCODED_IP})\n\nTroubleshooting:\n1. Backend is running (cd backend && npm start)\n2. Phone and PC on same WiFi network\n3. Test from phone browser: http://${serverIP}:4000/health\n4. Check Windows Firewall allows Node.js\n5. Restart Expo: npx expo start --clear`,
        status: 0,
        url: baseURL,
      });
    } else {
      // Something else happened
      return Promise.reject({
        message: error.message || 'An unexpected error occurred',
      });
    }
  }
);

export const setToken = (token) => {
  API.token = token;
  if (token) {
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common['Authorization'];
  }
};

export default API;

