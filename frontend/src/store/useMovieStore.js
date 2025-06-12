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
            const { liked, likeCount } = response.data;

            set(state => ({
                likes: {
                    ...state.likes,
                    [id]: { liked, likeCount }
                },
                loading: false
            }));
            return response.data;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
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
                }
            }
        });

        try {
            const response = await axiosInstance.post(`/likes/${movieId}`);
            return response.data;
        } catch (error) {
            // Rollback if error
            set({
                likes: {
                    ...state.likes,
                    [movieId]: previous || { liked: false, likeCount: 0 },
                },
                error: error.message
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
                }
            }
        });

        try {
            const response = await axiosInstance.delete(`/likes/${movieId}`);
            return response.data;
        } catch (error) {
            // Rollback if error
            set({
                likes: {
                    ...state.likes,
                    [movieId]: previous || { liked: true, likeCount: 1 },
                },
                error: error.message
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

    fetchWatchlist: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.get("/users/watchlist");
            const watchlistMap = {};
            const watchlist = response.data.map(movie => {
                watchlistMap[movie._id] = true;
                return movie;
            });
            set({
                watchlist,
                watchlistMap,
                loading: false
            });
            return watchlist;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    addToWatchlist: async (movieId) => {
        const state = get();
        // Optimistic update
        const movieStub = { _id: movieId }; // Minimal info to add to array
        set({
            watchlist: [...state.watchlist, movieStub],
            watchlistMap: { ...state.watchlistMap, [movieId]: true }
        });

        try {
            const response = await axiosInstance.post(`/users/watchlist/${movieId}`);
            // Optionally replace the stub with full data
            set(state => ({
                watchlist: state.watchlist.map(movie =>
                    movie._id === movieId ? response.data : movie
                )
            }));
            return response.data;
        } catch (error) {
            // Rollback if error
            const filtered = state.watchlist.filter(movie => movie._id !== movieId);
            const updatedMap = { ...state.watchlistMap };
            delete updatedMap[movieId];
            set({
                watchlist: filtered,
                watchlistMap: updatedMap,
                error: error.message
            });
            throw error;
        }
    },

    removeFromWatchlist: async (movieId) => {
        const state = get();
        const previousWatchlist = [...state.watchlist];
        // Optimistic update
        set({
            watchlist: state.watchlist.filter(movie => movie._id !== movieId),
            watchlistMap: Object.fromEntries(
                Object.entries(state.watchlistMap).filter(([id]) => id !== movieId)
            )
        });

        try {
            const response = await axiosInstance.delete(`/users/watchlist/${movieId}`);
            return response.data;
        } catch (error) {
            // Rollback if error
            set({
                watchlist: previousWatchlist,
                watchlistMap: { ...state.watchlistMap, [movieId]: true },
                error: error.message
            });
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
        const state = get();
        return !!state.watchlistMap[movieId]; // Avoids double-checking watchlist array
    },

    getLikeCount: (movieId) => {
        const likes = get().likes;
        return likes[movieId]?.likeCount || 0;
    },

    // Utility functions
    clearError: () => set({ error: null }),
    clearMovies: () => set({ movies: [] }),
}));

export default useMovieStore;