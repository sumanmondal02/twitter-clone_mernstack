import { create } from "zustand";
import axios from "axios";

const API = import.meta.env.VITE_URL;

axios.defaults.withCredentials = true;

export const useProfile = create((set) => ({
  profile: null,
  isOwnProfile: false,
  isFollowing: false,
  isLoading: false,

  async getProfile(username) {
    try {
      set({ isLoading: true });

      const res = await axios.get(
        `${API}/user-api/profile/${username}`
      );

      set({
        profile: res.data.payload,
        isOwnProfile: res.data.isOwnProfile,
        isFollowing: res.data.isFollowing,
      });

    } catch (err) {
      console.log(err);

      set({
        profile: null,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  setProfile: (updatedProfile) => {
    set({
      profile: updatedProfile
    });
  },

  async followUser(userId) {
    try {
      await axios.post(
        `${API}/user-api/follow/${userId}`
      );

      set((state) => ({
        isFollowing: true,
        profile: {
          ...state.profile,
          followerCount:
            (state.profile?.followerCount || 0) + 1,
        },
      }));
    } catch (err) {
      console.log(err);
    }
  },

  async unfollowUser(userId) {
    try {
      await axios.delete(
        `${API}/user-api/unfollow/${userId}`
      );

      set((state) => ({
        isFollowing: false,
        profile: {
          ...state.profile,
          followerCount:
            Math.max(
              0,
              (state.profile?.followerCount || 0) - 1
            ),
        },
      }));
    } catch (err) {
      console.log(err);
    }
  },
}));