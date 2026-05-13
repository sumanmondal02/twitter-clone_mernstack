import { create } from "zustand";
import axios from "axios";

const API = import.meta.env.VITE_URL;
const opts = { withCredentials: true };

export const useSuggestionsStore = create((set) => ({
  suggestions: [],
  isLoading: false,

  fetchSuggestions: async () => {
    try {
      set({ isLoading: true });
      const res = await axios.get(`${API}/user-api/suggestions`, opts);
      set({ suggestions: res.data.payload || [] });
    } catch (err) {
      console.log(err);
    } finally {
      set({ isLoading: false });
    }
  },

  followUser: async (userId) => {
    try {
      await axios.post(`${API}/user-api/follow/${userId}`, {}, opts);
      set((state) => ({
        suggestions: state.suggestions.filter((u) => u._id !== userId),
      }));
    } catch (err) {
      console.log(err);
    }
  },
}));