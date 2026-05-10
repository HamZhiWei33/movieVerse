import { create } from 'zustand';
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from './useAuthStore.js';
import useMovieStore from './useMovieStore.js';

function isLikedByUser(likes, currentUser) {
    if (!currentUser) return false;
    return likes.some(like => like.userId === currentUser._id);
}

const useLikeStore = create((set, get) => ({
    likes: {},
    loading: false,
    error: null,
    isFetchingAllMovieLikes: false,

    fetchMovieLikes: async (movieId) => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.get(`/likes/${movieId}`);
            const { count, likes } = response.data;

            const currentUser = useAuthStore.getState().authUser;
            const liked = isLikedByUser(likes, currentUser);

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

    fetchAllMovieLikes: async () => {
        if (get().isFetchingAllMovieLikes) return;

        const movieStore = useMovieStore.getState();
        const movieIds = [
            ...new Set([...movieStore.movies, ...movieStore.watchlist])
        ].map(movie => movie._id.toString());

        return await get().fetchBulkMovieLikes(movieIds);
    },

    fetchBulkMovieLikes: async (movieIds) => {
        const state = get();
        if (state.isFetchingAllMovieLikes) return;

        set({ isFetchingAllMovieLikes: true, error: null });

        const CHUNK_SIZE = 2000;

        const chunks = Array.from(
            { length: Math.ceil(movieIds.length / CHUNK_SIZE) },
            (_, i) => movieIds.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE)
        );

        try {
            const currentUser = useAuthStore.getState().authUser;

            const responses = await Promise.all(
                chunks.map(chunk =>
                    axiosInstance.post("/likes/bulk", { movieIds: chunk })
                )
            );

            const newLikesState = responses.reduce((acc, { data: { likesByMovie } }) => {
                Object.entries(likesByMovie).forEach(([movieId, { count, likes }]) => {
                    acc[movieId] = {
                        liked: isLikedByUser(likes, currentUser),
                        likeCount: count
                    };
                });
                return acc;
            }, {});

            set(state => ({
                likes: {
                    ...state.likes,
                    ...newLikesState
                },
                isFetchingAllMovieLikes: false
            }));

            return responses;

        } catch (error) {
            console.error(error);
            set({
                error: error?.response?.data?.message || error.message,
                isFetchingAllMovieLikes: false
            });
            throw error;
        }
    },

    toggleLike: async (movieId) => {
        const state = get();
        const previous = state.likes[movieId] || { liked: false, likeCount: 0 };
        const liked = previous.liked;

        set({
            likes: {
                ...state.likes,
                [movieId]: {
                    liked: !liked,
                    likeCount: previous.likeCount + (liked ? -1 : 1),
                }
            }
        });

        try {
            if (liked) {
                await axiosInstance.delete(`/likes/${movieId}`);
            } else {
                await axiosInstance.post(`/likes/${movieId}`);
            }
        } catch (error) {
            // Rollback if error
            console.error("Rollback!")
            set({
                likes: {
                    ...state.likes,
                    [movieId]: previous,
                },
                error: error.message
            });
            throw error;
        }
    },

    clearError: () => set({ error: null }),
    resetLikeStore: () => set({ likes: {} }),
}));

export default useLikeStore;