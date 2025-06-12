import { create } from 'zustand';
import { axiosInstance } from "../lib/axios.js";

const useMovieStore = create((set, get) => ({
    // State
    movies: [],
    currentMovie: null,
    genres: [],
    filterOptions: {},
    likes: {},
    watchlist: [],
    currentUser: null,
    loading: false,
    error: null,
    watchlistMap: {},

    // Actions
    fetchMovies: async (page = 1, limit = 100, filters = {}) => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.get("/movies", {
                params: { page, limit, ...filters },
            });
            set({ movies: response.data.data || response.data, loading: false });
            return response.data;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    fetchMovieById: async (id) => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.get(`/movies/${id}`);
            set({ currentMovie: response.data.data || response.data, loading: false });
            return response.data.data || response.data;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    fetchGenres: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.get("/movies/genres/all");
            set({ genres: response.data.data || response.data, loading: false });
            return response.data.data || response.data;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    fetchFilterOptions: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.get("/movies/filters");
            set({ filterOptions: response.data.data || response.data, loading: false });
            return response.data.data || response.data;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    fetchMovieLikes: async (id) => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.get(`/likes/${id}`);
            set(state => ({
                likes: { ...state.likes, [id]: response.data },
                loading: false
            }));
            return response.data;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    likeMovie: async (movieId) => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.post(`/likes/${movieId}`);
            set(state => ({
                likes: { ...state.likes, [movieId]: response.data },
                loading: false
            }));
            return response.data;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    unlikeMovie: async (movieId) => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.delete(`/likes/${movieId}`);
            set(state => ({
                likes: { ...state.likes, [movieId]: response.data },
                loading: false
            }));
            return response.data;
        } catch (error) {
            set({ error: error.message, loading: false });
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

    fetchWatchlist: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.get("/users/watchlist");
            const watchlistMap = response.data.reduce((map, movie) => {
                map[movie._id] = true;
                return map;
            }, {});
            set({
                watchlist: response.data,
                watchlistMap,
                loading: false
            });
            return response.data;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    addToWatchlist: async (movieId) => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.post(`/users/watchlist/${movieId}`);
            set(state => ({
                watchlist: [...state.watchlist, response.data],
                watchlistMap: { ...state.watchlistMap, [movieId]: true },
                loading: false
            }));
            return response.data;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    removeFromWatchlist: async (movieId) => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.delete(`/users/watchlist/${movieId}`);
            set(state => {
                const updatedWatchlist = state.watchlist.filter(movie => movie._id !== movieId);
                const updatedMap = { ...state.watchlistMap };
                delete updatedMap[movieId];
                return {
                    watchlist: updatedWatchlist,
                    watchlistMap: updatedMap,
                    loading: false
                };
            });
            return response.data;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    getCurrentUser: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.get("/users/me");
            set({ currentUser: response.data, loading: false });
            return response.data;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    isLiked: (movieId) => {
        const likes = get().likes;
        return likes[movieId]?.liked === true;
    },

    isInWatchlist: (movieId) => {
        // Check both watchlist array and map for redundancy
        const state = get();
        return state.watchlist.some(movie => movie._id === movieId) ||
            !!state.watchlistMap[movieId];
    },

    // Utility functions
    clearError: () => set({ error: null }),
    clearMovies: () => set({ movies: [] }),
}));

export default useMovieStore;