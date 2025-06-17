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

  likes: {},
  watchlist: [],
  watchlistMap: {},
  currentUser: null,

  // === LIKE HANDLERS ===
  fetchMovieLikes: async (id) => {
    try {
      const response = await axiosInstance.get(`/likes/${id}`);
      const { liked, likeCount } = response.data;
      set((state) => ({
        likes: {
          ...state.likes,
          [id]: { liked, likeCount },
        },
      }));
      return response.data;
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  },

  likeMovie: async (movieId) => {
    const state = get();
    const previous = state.likes[movieId];
    // Optimistic update
    set({
      likes: {
        ...state.likes,
        [movieId]: {
          liked: true,
          likeCount: (previous?.likeCount || 0) + 1,
        },
      },
    });

    try {
      const response = await axiosInstance.post(`/likes/${movieId}`);
      console.log("Like response testing:", response.data);
      return response.data;
    } catch (error) {
      // Rollback if error
      set({
        likes: {
          ...state.likes,
          [movieId]: previous || { liked: false, likeCount: 0 },
        },
        error: error.message,
      });
      throw error;
    }
  },

  unlikeMovie: async (movieId) => {
    const state = get();
    const previous = state.likes[movieId];
    // Optimistic update
    set({
      likes: {
        ...state.likes,
        [movieId]: {
          liked: false,
          likeCount: Math.max((previous?.likeCount || 1) - 1, 0),
        },
      },
    });

    try {
      const response = await axiosInstance.delete(`/likes/${movieId}`);
      console.log("Unlike response testing:", response.data);
      return response.data;
    } catch (error) {
      // Rollback if error
      set({
        likes: {
          ...state.likes,
          [movieId]: previous || { liked: true, likeCount: 1 },
        },
        error: error.message,
      });
      throw error;
    }
  },
  hasUserLikedMovie: async (movieId) => {
  try {
    const response = await axiosInstance.post(`/likes/${movieId}/check`);
    return response.data.liked;
  } catch (error) {
    console.error("Failed to check like status", error);
    return false;
  }
},


  // unlikeMovie: async (movieId) => {
  //   const prev = get().likes[movieId];
  //   set({
  //     likes: {
  //       ...get().likes,
  //       [movieId]: {
  //         liked: false,
  //         likeCount: Math.max((prev?.likeCount || 1) - 1, 0),
  //       },
  //     },
  //   });

  //   try {
  //     await axiosInstance.delete(`/likes/${movieId}`);
  //     console.log("Movie unliked successfully");
  //   } catch (error) {
  //     set({
  //       likes: {
  //         ...get().likes,
  //         [movieId]: prev || { liked: true, likeCount: 1 },
  //       },
  //     });
  //     console.error("Failed to unlike movie:", error);
  //   }
  // },

  isLiked: (movieId) => get().likes[movieId]?.liked === true,

  getLikeCount: (movieId) => get().likes[movieId]?.likeCount || 0,

  // === WATCHLIST ===
  fetchWatchlist: async () => {
    try {
      const response = await axiosInstance.get("/users/watchlist");
      const watchlist = response.data;
      const watchlistMap = {};
      watchlist.forEach((movie) => {
        watchlistMap[movie._id] = true;
      });
      set({ watchlist, watchlistMap });
    } catch (error) {
      console.error("Failed to fetch watchlist:", error);
    }
  },

  addToWatchlist: async (movieId) => {
    const state = get();
    set({
      watchlist: [...state.watchlist, { _id: movieId }],
      watchlistMap: { ...state.watchlistMap, [movieId]: true },
    });

    try {
      const response = await axiosInstance.post(`/users/watchlist/${movieId}`);
      set((state) => ({
        watchlist: state.watchlist.map((m) =>
          m._id === movieId ? response.data : m
        ),
      }));
    } catch (error) {
      const rollback = state.watchlist.filter((m) => m._id !== movieId);
      const map = { ...state.watchlistMap };
      delete map[movieId];
      set({ watchlist: rollback, watchlistMap: map });
      console.error("Failed to add to watchlist:", error);
    }
  },

  removeFromWatchlist: async (movieId) => {
    const state = get();
    const prevList = [...state.watchlist];
    set({
      watchlist: state.watchlist.filter((m) => m._id !== movieId),
      watchlistMap: Object.fromEntries(
        Object.entries(state.watchlistMap).filter(([id]) => id !== movieId)
      ),
    });

    try {
      await axiosInstance.delete(`/users/watchlist/${movieId}`);
    } catch (error) {
      set({
        watchlist: prevList,
        watchlistMap: { ...state.watchlistMap, [movieId]: true },
      });
      console.error("Failed to remove from watchlist:", error);
    }
  },

  isInWatchlist: (movieId) => !!get().watchlistMap[movieId],

  // === USER ===
  getCurrentUser: async () => {
    try {
      const response = await axiosInstance.get("/users/me");
      set({ currentUser: response.data });
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  },
}));

export default useRankingStore;
