import { create } from "zustand";
import axios from "axios";

const API = import.meta.env.VITE_URL;

export const useTrendingStore = create((set) => ({
  trends: [],
  isLoading: false,

  fetchTrends: async () => {
    try {
      set({ isLoading: true });
      const res = await axios.get(`${API}/post-api/trending`, { withCredentials: true });
      set({ trends: res.data.payload || [] });
    } catch (err) {
      console.log(err);
    } finally {
      set({ isLoading: false });
    }
  },
}));