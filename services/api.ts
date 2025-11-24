// services/api.ts
import { useAuthStore } from "@/stores/authStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError } from "axios";

export const API_URL = "https://477c70e74fd5.ngrok-free.app";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token automatically to requests
api.interceptors.request.use(
  async (config) => {
    // Get token from Zustand auth store
    const token = useAuthStore.getState().token;
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

export const tripsAPI = {
  createTrip: async (tripData: any) => {
    try {
      const res = await api.post("/trips", tripData);
      return { success: true, data: res.data };
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      return { success: false, message: axiosError.response?.data?.message || "Failed to create trip" };
    }
  },

  getTrips: async () => {
    try {
      const res = await api.get("/trips");
      return { success: true, data: res.data };
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      return { success: false, message: axiosError.response?.data?.message || "Failed to fetch trips" };
    }
  },

  getTripByUser: async (userId: string) => {
    try {
      const res = await api.get(`/trips/user/${userId}`);
      return { success: true, data: res.data };
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      return { success: false, message: axiosError.response?.data?.message || "Failed to fetch user trips" };
    }
  },

  joinTrip: async (tripId: string, userId: string) => {
    try {
      const res = await api.post(`/trips/${tripId}/join`, { userId });
      return { success: true, data: res.data };
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      return { success: false, message: axiosError.response?.data?.message || "Failed to join trip" };
    }
  },

  leaveTrip: async (tripId: string, userId: string) => {
    try {
      const res = await api.post(`/trips/${tripId}/leave`, { userId });
      return { success: true, data: res.data };
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      return { success: false, message: axiosError.response?.data?.message || "Failed to leave trip" };
    }
  },

  getTripById: async (tripId: string) => {
    try {
      const res = await api.get(`/trips/${tripId}`);
      // The backend might return data directly or wrapped in an object
      const tripData = res.data?.trip || res.data;
      return { success: true, data: tripData };
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      console.error("getTripById error:", axiosError.response?.data);
      return { success: false, message: axiosError.response?.data?.message || "Failed to fetch trip" };
    }
  },

  // Invitation related APIs
  inviteUser: async (tripId: string, userId: string, invitedBy: string) => {
    try {
      const res = await api.post(`/trips/${tripId}/invite`, { userId, invitedBy });
      return { success: true, data: res.data };
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      return { success: false, message: axiosError.response?.data?.message || "Failed to invite user" };
    }
  },

  getInvitationsForUser: async (userId: string) => {
    try {
      const res = await api.get(`/trips/invitations/${userId}`);
      return { success: true, data: res.data };
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      return { success: false, message: axiosError.response?.data?.message || "Failed to fetch invitations" };
    }
  },

  acceptInvitation: async (tripId: string, userId: string) => {
    try {
      const res = await api.post(`/trips/${tripId}/accept`, { userId });
      return { success: true, data: res.data };
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      return { success: false, message: axiosError.response?.data?.message || "Failed to accept invitation" };
    }
  },

  rejectInvitation: async (tripId: string, userId: string) => {
    try {
      const res = await api.post(`/trips/${tripId}/reject`, { userId });
      return { success: true, data: res.data };
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      return { success: false, message: axiosError.response?.data?.message || "Failed to reject invitation" };
    }
  },
};

export const badgesAPI = {
  getBadgesByUser: async (userId: string) => {
    try {
      const res = await api.get(`/badges/user/${userId}`);
      return { success: true, data: res.data };
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      return { success: false, message: axiosError.response?.data?.message || "Failed to fetch badges" };
    }
  },
};

export const gearAPI = {
  getGears: async () => {
    try {
      const res = await api.get("/gear");
      return { success: true, data: res.data };
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      return { success: false, message: axiosError.response?.data?.message || "Failed to fetch gears" };
    }
  },

  createGear: async (gearData: any) => {
    try {
      const res = await api.post("/gear", gearData);
      return { success: true, data: res.data };
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      return { success: false, message: axiosError.response?.data?.message || "Failed to create gear" };
    }
  },

  deleteGear: async (gearId: string) => {
    try {
      const res = await api.delete(`/gear/${gearId}`);
      return { success: true, data: res.data };
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      return { success: false, message: axiosError.response?.data?.message || "Failed to delete gear" };
    }
  },

  contactOwner: async (gearId: string) => {
    try {
      const res = await api.get(`/gear/${gearId}/contact`);
      return { success: true, data: res.data };
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      return { success: false, message: axiosError.response?.data?.message || "Failed to get owner contact" };
    }
  },
};

export default api;
