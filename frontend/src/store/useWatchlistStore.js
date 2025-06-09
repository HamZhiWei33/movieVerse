// src/store/useWatchlistStore.js
import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

const useWatchlistStore = create((set, get) => ({
  user: null,
  watchlist: [],

  setUser: (userData) => set({ user: userData }),

  fetchWatchlist: async () => {
    try {
      const response = await axiosInstance.get("/users/watchlist", {
        withCredentials: true,
      });
      console.log("Fetched watchlist:", response.data); // debug
      set({ watchlist: response.data });
    } catch (err) {
      console.error(
        "Failed to fetch watchlist:",
        err.response?.data || err.message
      );
    }
  },
}));

export default useWatchlistStore;
