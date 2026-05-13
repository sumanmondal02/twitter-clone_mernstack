import { create } from "zustand";
import axios from "axios";

const API = import.meta.env.VITE_URL;
const opts = { withCredentials: true };

// Normalizes the raw user object from backend (_id → id, pulls isAdmin up)
const normalize = (user) => {
  if (!user)return null;
  return { ...user, id: user._id, isAdmin: user.isAdmin ?? false, profileImageUrl: user.profileImageUrl || user.profilePicture || user.avatar || "", };
};

export const useAuth = create((set) => ({
  currentUser: JSON.parse(localStorage.getItem("currentUser")) || null,
  isAuthenticated: !!localStorage.getItem("currentUser"),
  isAdmin: false,
  error: null,
  isCheckingAuth: true,
  isLoggingIn: false,
  isRegistering: false,

  // register
  register: async (formData) => {
    try {
      set({ isRegistering: true, error: null });
      const res = await axios.post(`${API}/auth/register`, formData, {
        ...opts,
        headers: { "Content-Type": "multipart/form-data" },
      });
      set({ isRegistering: false });
      return {
        success: true,
        message: res.data.message || "Account created successfully! Please log in.",
      };
    } catch (err) {
      set({ error: err.response?.data?.message || "Registration failed" });
      return { success: false, message: err.response?.data?.message || "Registration failed" };
    } finally {
      set({ isRegistering: false });
    }
  },

  // login
  login: async (credentials) => {
    try {
      set({ isLoggingIn: true, error: null });
      const res = await axios.post(`${API}/auth/login`, credentials, opts);
      const user = normalize(res.data.payload);
      localStorage.setItem(
        "currentUser",
        JSON.stringify(user)
      );
      set({
        currentUser: user,
        isAuthenticated: true,
        isAdmin: user?.isAdmin ?? false,
      });
      return { success: true, message: "Login successful" };
    } catch (err) {
      set({
        currentUser: null,
        isAuthenticated: false,
        isAdmin: false,
        error: err.response?.data?.message || "Login failed. Please try again.",
      });
      return { success: false, message: err.response?.data?.message || "Login failed. Please try again." };
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // logout
  logout: async () => {
    try {
      await axios.post(`${API}/auth/logout`, {}, opts);
    } catch (_) {
        // Even if logout request fails, we want to clear auth state on frontend
    } finally {
      localStorage.removeItem("currentUser");
      set({ 
        currentUser: null,
        isAuthenticated: false,
        isAdmin: false,
        error: null,
      });
    }
  },

  // checkAuth (page refresh)
  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });
      const res = await axios.get(`${API}/auth/check-auth`, opts);
      const user = normalize(res.data.payload);
      localStorage.setItem("currentUser", JSON.stringify(user));
      set({
        currentUser: user,
        isAuthenticated: true,
        isAdmin: user?.isAdmin ?? false,
      });
    } catch (_) {
      set({
        currentUser: null,
        isAuthenticated: false,
        isAdmin: false,
      });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  updateCurrentUser: (updatedUser) => {

  const normalizedUser = normalize(updatedUser);
  localStorage.setItem(
    "currentUser",
    JSON.stringify(normalizedUser)
  );

  set({
    currentUser: normalizedUser,
    isAuthenticated: true,
    isAdmin: normalizedUser?.isAdmin ?? false,
  });

},

  clearError: () => set({ error: null }),
  resetAuth: () => set({
    currentUser: null,
    isAuthenticated: false,
    isAdmin: false,
    error: null,
  }),
}));