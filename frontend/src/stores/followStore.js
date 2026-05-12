import { create } from "zustand";
import axios from "axios";

const API = import.meta.env.VITE_URL;

export const useFollowStore = create((set, get) => ({

  followers: [],
  following: [],
  isLoadingFollowers: false,
  isLoadingFollowing: false,

  fetchFollowers: async (username) => {
    try {
      set({ isLoadingFollowers: true });
      const res = await axios.get(
        `${API}/user-api/followers/${username}`,
        { withCredentials: true }
      );
      set({ followers: res.data.payload });
    } catch (err) {
      console.log(err);
    } finally {
      set({ isLoadingFollowers: false });
    }
  },

  fetchFollowing: async (username) => {
    try {
      set({ isLoadingFollowing: true });
      const res = await axios.get(
        `${API}/user-api/following/${username}`,
        { withCredentials: true }
      );
      set({ following: res.data.payload });
    } catch (err) {
      console.log(err);
    } finally {
      set({ isLoadingFollowing: false });
    }
  },

  // Toggle follow state locally in BOTH arrays (without DB call — DB is handled by profileStore)
  updateFollowState: (userId, isFollowing) => {
    set((state) => ({
      followers: state.followers.map((u) =>
        u._id === userId ? { ...u, isFollowing } : u
      ),
      following: state.following.map((u) =>
        u._id === userId ? { ...u, isFollowing } : u
      ),
    }));
  },

  // Remove a user from followers list locally after removeFollower API call
  removeFromFollowersList: (userId) => {
    set((state) => ({
      followers: state.followers.filter((u) => u._id !== userId),
    }));
  },

  // Remove a user from following list locally after unfollow
  removeFromFollowingList: (userId) => {
    set((state) => ({
      following: state.following.filter((u) => u._id !== userId),
    }));
  },

  // Follow a user — hits DB and updates local state
  followUserInModal: async (userId) => {
    try {
      await axios.post(
        `${API}/user-api/follow/${userId}`,
        {},
        { withCredentials: true }
      );
      get().updateFollowState(userId, true);
    } catch (err) {
      console.log(err);
    }
  },

  // Unfollow a user — hits DB, updates local state, removes from following list
  unfollowUserInModal: async (userId) => {
    try {
      await axios.delete(
        `${API}/user-api/unfollow/${userId}`,
        { withCredentials: true }
      );
      get().updateFollowState(userId, false);
      get().removeFromFollowingList(userId);
    } catch (err) {
      console.log(err);
    }
  },

  // Remove a follower — hits DB and removes from followers list
  removeFollowerInModal: async (userId) => {
    try {
      await axios.delete(
        `${API}/user-api/removeFollower/${userId}`,
        { withCredentials: true }
      );
      get().removeFromFollowersList(userId);
    } catch (err) {
      console.log(err);
    }
  },

}));