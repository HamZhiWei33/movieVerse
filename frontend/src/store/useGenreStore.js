import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

const useGenreStore = create((set, get) => ({
  genreMap: {},

  fetchGenres: async () => {
    try {
      const response = await axiosInstance.get("/genres", {
        withCredentials: true,
      });

      const genres = response.data;
      console.log("Fetched genres:", genres); // debug

      const map = genres.reduce((acc, genre) => {
        acc[genre.id] = genre.name;
        return acc;
      }, {});

      set({ genreMap: map });
    } catch (error) {
      console.error(
        "Failed to fetch genres:",
        error.response?.data || error.message
      );
    }
  },
}));

export default useGenreStore;
