import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

const useRankingStore = create((set, get) => ({
  // === RANKING PAGE STATE ===
  rankingMovies: [],
  rankingReviews: [],
  rankingGenres: [],
  selectedMovie: null,
  rankingLoading: false,
  rankingError: null,

  fetchRankingData: async () => {
    set({ rankingLoading: true, rankingError: null });
    try {
      const response = await axiosInstance.get("/rankings");
      const { movies = [], reviews = [], genres = [] } = response.data || {};

      set({
        rankingMovies: movies,
        rankingReviews: reviews,
        rankingGenres: genres,
        selectedMovie: movies[0] || null,
        rankingLoading: false,
      });
    } catch (error) {
      set({
        rankingError: error.message || "Failed to fetch ranking data",
        rankingLoading: false,
      });
      throw error;
    }
  },

  setSelectedMovie: (movie) => set({ selectedMovie: movie }),
}));

export default useRankingStore;
