import { create } from "zustand";
import axios from "axios";

const API = import.meta.env.VITE_URL;

export const useSearchStore = create((set) => ({
  results: [],
  isSearching: false,
  query: "",

  setQuery: (q) => set({ query: q }),

  searchUsers: async (q) => {
    if (!q.trim()) return set({ results: [] });
    try {
      set({ isSearching: true });
      const res = await axios.get(`${API}/user-api/search?q=${q}`, {
        withCredentials: true,
      });
      set({ results: res.data.payload || [] });
    } catch (err) {
      set({ results: [] });
    } finally {
      set({ isSearching: false });
    }
  },

  clearSearch: () => set({ results: [], query: "" }),
}));