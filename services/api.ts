import axios from "axios";
import * as SecureStore from "expo-secure-store";

// Base URL for Oreon API
const API_URL = "http://192.168.18.3:3000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to every request automatically
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("anli_customer_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear storage silently
      SecureStore.deleteItemAsync("anli_customer_token");
      SecureStore.deleteItemAsync("anli_customer_user");
    }
    return Promise.reject(error);
  }
);

export default api;
