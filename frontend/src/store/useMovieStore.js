import { create } from 'zustand';
import { axiosInstance } from "../lib/axios.js";
import { checkWatchlistStatus } from '../../../backend/src/controllers/user.controller.js';

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
    currentPage: 1,
    hasMore: true,
    isFetchingMore: false,
    watchlistStatuses: {},

    getState: () => get(),

    // In your useMovieStore.js
    lastUsedFilters: {},

    // Add this new method to your store
    fetchMoviesFromTMDB: async (page = 1, limit = 20) => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.get("/movies/tmdb", {
                params: { page, limit }
            });

            const newMovies = response.data.data;
            const hasMore = true; // TMDB has virtually infinite movies

            return {
                movies: newMovies,
                hasMore,
                currentPage: page
            };
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    fetchMovies: async (page = 1, limit = 20, filters = {}, append = false) => {
        if (get().isFetchingMore) return;

        set({
            loading: page === 1,
            isFetchingMore: page > 1,
            error: null,
            lastUsedFilters: filters
        });

        try {
            const response = await axiosInstance.get("/movies", {
                params: {
                    page,
                    limit,
                    ...filters,
                    fallback: 'true' // Enable TMDB fallback
                },
            });

            const newMovies = response.data.data;

            // Deduplicate movies by _id and tmdbId
            const uniqueMovies = newMovies.reduce((acc, movie) => {
                const existing = acc.find(m =>
                    m._id === movie._id ||
                    (m.tmdbId && movie.tmdbId && m.tmdbId === movie.tmdbId)
                );
                if (!existing) {
                    acc.push(movie);
                }
                return acc;
            }, append ? [...get().movies] : []);

            const hasMore = response.data.pagination?.hasMore ?? true; // Default to true for TMDB fallback

            set({
                movies: uniqueMovies,
                currentPage: page,
                hasMore,
                loading: false,
                isFetchingMore: false
            });

            return { data: uniqueMovies };
        } catch (error) {
            set({
                error: error.message,
                loading: false,
                isFetchingMore: false
            });
            throw error;
        }
    },

    loadMoreMovies: async () => {
    const state = get();
    if (state.isFetchingMore || !state.hasMore) return;

    set({ isFetchingMore: true, error: null });

    try {
        const response = await axiosInstance.get("/movies", {
            params: {
                page: state.currentPage + 1,
                limit: 20,
                ...state.lastUsedFilters,
                fallback: 'true'
            },
        });

        const newMovies = response.data.data;

        const uniqueMovies = newMovies.reduce((acc, movie) => {
            const exists = state.movies.some(m => 
                m._id === movie._id || 
                (m.tmdbId && movie.tmdbId && m.tmdbId === movie.tmdbId)
            );
            if (!exists) {
                acc.push(movie);
            }
            return acc;
        }, [...state.movies]);

        const hasMore = response.data.pagination?.hasMore ?? true;

        set({
            movies: uniqueMovies,
            currentPage: state.currentPage + 1,
            hasMore,
            isFetchingMore: false
        });

        return { data: uniqueMovies };
    } catch (error) {
        set({
            error: error.message,
            isFetchingMore: false
        });
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
        // console.log(id);
        try {
            const response = await axiosInstance.get(`/likes/${id}`);
            const { count, likes } = response.data;
            // console.log(response.data);
            // console.log(count);
            // console.log(likes);

            set(state => ({
                likes: {
                    ...state.likes,
                    [id]: { liked: likes, likeCount: count }
                },
                loading: false
            }));
            // console.log(get().likes);
            return response.data;
        } catch (error) {
            set({ error: error.message, loading: false });
            console.log(error);
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
        console.log(movieId);
        console.log(get().likes);

        try {
            const response = await axiosInstance.post(`/likes/${movieId}`);
            console.log(response.data);
            return response.data;
        } catch (error) {
            // Rollback if error
            console.error("Rollback!")
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
        set({
            watchlistStatuses: {
                ...state.watchlistStatuses,
                [movieId]: {
                    inWatchlist: true
                }
            }
        });

        try {
            await axiosInstance.post(`/users/watchlist/${movieId}`);
            // No need to refetch if optimistic update is correct
        } catch (error) {
            // Rollback on error
            set({
                watchlistStatuses: state.watchlistStatuses
            });
            throw error;
        }
    },

    removeFromWatchlist: async (movieId) => {
        const state = get();

        // Optimistic update
        set({
            watchlistStatuses: {
                ...state.watchlistStatuses,
                [movieId]: {
                    inWatchlist: false
                }
            }
        });

        try {
            await axiosInstance.delete(`/users/watchlist/${movieId}`);
            // No need to refetch if optimistic update is correct
        } catch (error) {
            // Rollback on error
            set({
                watchlistStatuses: state.watchlistStatuses
            });
            throw error;
        }
    },

    checkWatchlistStatus: async (movieId) => {
        try {
            const response = await axiosInstance.get(`/users/watchlist/${movieId}/status`);

            set(state => ({
                watchlistStatuses: {
                    ...state.watchlistStatuses,
                    [movieId]: {
                        inWatchlist: response.data.inWatchlist
                    }
                }
            }));

            return response.data.inWatchlist;
        } catch (error) {
            console.error("Failed to fetch watchlist status:", error);

            // Set default state
            set(state => ({
                watchlistStatuses: {
                    ...state.watchlistStatuses,
                    [movieId]: {
                        inWatchlist: false
                    }
                }
            }));

            return false;
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