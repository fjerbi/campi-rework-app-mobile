// services/api.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError } from "axios";

const API_URL = "https://84abda4cf5fb.ngrok-free.app"; // ✅ Removed leading space

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token automatically to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await AsyncStorage.multiRemove(["authToken", "userData"]);
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (userData: any) => {
    try {
      const res = await api.post("/register", userData);
      return { success: true, data: res.data };
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      return { success: false, message: axiosError.response?.data?.message || "Registration failed" };
    }
  },

  login: async (email: string, password: string) => {
    try {
      const res = await api.post("/login", { email, password });
      return { success: true, data: res.data };
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      return { success: false, message: axiosError.response?.data?.message || "Login failed" };
    }
  },

  verifyToken: async () => {
    try {
      const res = await api.post("/checkTokenValidity");
      return { success: true, data: res.data };
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      return { success: false, message: axiosError.response?.data?.message || "Token verification failed" };
    }
  },
};

export default api;
