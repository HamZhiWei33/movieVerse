// src/store/useRatingStore.js
import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

const useRatingStore = create((set) => ({
  user: null,
  userReviews: [],
  error: null,
  isLoading: false,

  setUser: (userData) => set({ user: userData }),

  fetchUserReviews: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/users/review", {
        withCredentials: true,
      });
      console.log("Fetched reviews:", response.data);
      set({ userReviews: response.data, isLoading: false });
    } catch (err) {
      console.error(
        "Failed to fetch user reviews:",
        err.response?.data || err.message
      );
      set({
        error: err.response?.data || err.message,
        isLoading: false,
      });
    }
  },
}));

export default useRatingStore;
