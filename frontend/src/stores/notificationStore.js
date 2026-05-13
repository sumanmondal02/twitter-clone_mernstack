import { create } from "zustand";
import axios from "axios";

const API = import.meta.env.VITE_URL;
const opts = { withCredentials: true };

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  showPast: false,

  setShowPast: (val) => set({ showPast: val }),

  fetchNotifications: async () => {
    try {
      set({ isLoading: true });
      const res = await axios.get(`${API}/notification-api/`, opts);
      set({ notifications: res.data.payload || [] });
    } catch (err) {
      console.log(err);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const res = await axios.get(`${API}/notification-api/unreadcount`, opts);
      set({ unreadCount: res.data.payload?.count || 0 });
    } catch (err) {
      console.log(err);
    }
  },

  markAllRead: async () => {
    try {
      await axios.patch(`${API}/notification-api/markread`, {}, opts);
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      }));
    } catch (err) {
      console.log(err);
    }
  },

  markAsRead: async (id) => {
    try {
      await axios.patch(`${API}/notification-api/markread/${id}`,{},opts);
      set((state) => ({
        notifications: state.notifications.map((n) => 
                n._id === id ? {
                  ...n,
                  isRead: true,
                } : n
          ),
        unreadCount:Math.max(state.unreadCount - 1, 0),
      }));
    } catch (err) {
      console.log(err);
    }},

  deleteNotification: async (id) => {
    try {
      await axios.delete(`${API}/notification-api/${id}`, opts);
      set((state) => ({
        notifications: state.notifications.filter((n) => n._id !== id),
      }));
    } catch (err) {
      console.log(err);
    }},

  clearAll: async () => {
    try {
      await axios.delete(`${API}/notification-api/clear`, opts);
      set({ notifications: [], unreadCount: 0 });
    } catch (err) {
      console.log(err);
    }},
}));