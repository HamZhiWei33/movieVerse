import { create } from 'zustand';
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from './useAuthStore.js';

const useMovieStore = create((set, get) => ({
    // State
    movies: [],
    genres: [],
    filterOptions: {},
    likes: {},
    watchlist: [],
    loading: false,
    error: null,
    currentPage: 1,
    hasMore: true,
    lastUsedFilters: {},
    isFetchingMore: false,
    watchlistStatuses: {},
    recommendedMovies: [],
    randomRecommendedMovies: [],
    updatingWatchlist: false,

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
            const hasMore = response.data.pagination?.hasMore ?? true;

            // Only update state if we got new movies
            if (newMovies.length > 0) {
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

                set({
                    movies: uniqueMovies,
                    currentPage: state.currentPage + 1,
                    hasMore,
                    isFetchingMore: false
                });
            } else {
                // No more movies available
                set({
                    hasMore: false,
                    isFetchingMore: false
                });
            }

            return { data: newMovies };
        } catch (error) {
            set({
                error: error.message,
                isFetchingMore: false
            });
            throw error;
        }
    },

    fetchMovieById: async (movieId) => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.get(`/movies/${movieId}`);
            return response.data.data || response.data;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        } finally {
            set({ loading: false });
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

    fetchMovieLikes: async (movieId) => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.get(`/likes/${movieId}`);
            const { count, likes } = response.data;

            const currentUser = useAuthStore.getState().authUser;
            const liked = currentUser ? likes.some(like => like.userId === currentUser._id) : false;

            set(state => ({
                likes: {
                    ...state.likes,
                    [movieId]: { liked, likeCount: count }
                },
                loading: false
            }));
            return response.data;
        } catch (error) {
            set({ error: error.message, loading: false });
            console.log(error);
            throw error;
        }
    },

    toggleLike: async (movieId) => {
        const state = get();
        const previous = state.likes[movieId];
        const liked = previous.liked;

        set({
            likes: {
                ...state.likes,
                [movieId]: {
                    liked: !liked,
                    likeCount: (previous?.likeCount || 0) + (liked ? -1 : 1),
                }
            }
        });

        try {
            if (!liked) {
                await axiosInstance.post(`/likes/${movieId}`);
            } else {
                await axiosInstance.delete(`/likes/${movieId}`);
            }
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

    fetchWatchlist: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.get("/users/watchlist");
            const watchlist = response.data;
            set({
                watchlist,
                loading: false
            });
            return watchlist;
        } catch (error) {
            set({ error: error.message, loading: false });
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
            },
            watchlist: state.watchlist.filter((movie) => movie._id !== movieId),
        });

        try {
            await axiosInstance.delete(`/users/watchlist/${movieId}`);
            set({
                watchlist: state.watchlist.filter((movie) => movie._id !== movieId)
            });
        } catch (error) {
            // Rollback on error
            set({
                watchlistStatuses: state.watchlistStatuses,
                watchlist: state.watchlist
            });
            throw error;
        }
    },

    toggleWatchlist: async (movieId) => {
        const state = get();
        const inWatchlist = state.isInWatchlist(movieId);

        set({
            watchlistStatuses: {
                ...state.watchlistStatuses,
                [movieId]: {
                    inWatchlist: !inWatchlist
                }
            }
        });

        try {
            if (!inWatchlist) {
                const response = await axiosInstance.get(`/movies/${movieId}`);
                const movie = response.data.data || response.data;
                set({
                    watchlist: [
                        movie,
                        ...state.watchlist
                    ]
                });
                await axiosInstance.post(`/users/watchlist/${movieId}`);
            } else {

                set({
                    watchlist: state.watchlist.filter((movie) => movie._id !== movieId)
                });
                await axiosInstance.delete(`/users/watchlist/${movieId}`);
            }
        } catch (error) {
            // Rollback on error
            set({
                watchlistStatuses: state.watchlistStatuses,
                watchlist: state.watchlist
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

    isInWatchlist: (movieId) => {
        return get().watchlist.some((movie) => movie._id === movieId);
    },

    getRecommendedMovies: async () => {
        try {
            const response = await axiosInstance.get("/movies/recommended");
            set({ recommendedMovies: response.data.movies });
            return response.data;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Utility functions
    clearError: () => set({ error: null }),
    clearMovies: () => set({ movies: [] }),
}));

export default useMovieStore;