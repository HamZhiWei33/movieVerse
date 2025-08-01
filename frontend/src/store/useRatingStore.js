// src/store/useRatingStore.js
import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from './useAuthStore.js';

const useRatingStore = create((set, get) => ({
  userReviews: [], // reviews made by current user
  reviewsByMovie: {}, // { [movieId]: Review[] }
  userReview: {}, // { [movieId]: Review }
  moviesById: {},
  error: null,
  isLoading: false,


  fetchUserReviews: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/users/review", {
        withCredentials: true,
      });
      set({ userReviews: response.data, isLoading: false });
    } catch (err) {
      console.error(
        "Failed to fetch user reviews:",
        err.response?.data || err.message
      );
      set({ error: err.response?.data || err.message, isLoading: false });
    }
  },

  fetchReviewsByMovie: async (movieId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/reviews/${movieId}`);
      const sortedReviews = response.data.sort((a, b) => 
        new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
    );
      set((state) => ({
        reviewsByMovie: {
          ...state.reviewsByMovie,
          [movieId]: sortedReviews,
        },
      }));
    } catch (err) {
      console.error(`Failed to fetch reviews for movie ${movieId}:`, err);
      set({ error: err.response?.data || err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUserReview: async (movieId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/reviews/${movieId}/user`, {
        withCredentials: true,
      });
      set((state) => ({
        userReview: { ...state.userReview, [movieId]: response.data },
      }));
    } catch (err) {
      console.error(`Failed to fetch user review for movie ${movieId}:`, err);
      set({ error: err.response?.data || err.message });
    } finally {
      set({ isLoading: false });
    }
  },

   addReview: async (movieId, { rating, review }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(
        `/reviews/${movieId}`,
        { rating, review },
        { withCredentials: true }
      );
      
      set((state) => {
        const updatedReviews = state.reviewsByMovie[movieId]
          ? [...state.reviewsByMovie[movieId], response.data.review]
          : [response.data.review];
          
        return {
          reviewsByMovie: {
            ...state.reviewsByMovie,
            [movieId]: updatedReviews,
          },
          userReview: { ...state.userReview, [movieId]: response.data.review },
          moviesById: {
            ...state.moviesById,
            [movieId]: response.data.movie 
          }
        };
      });
      
      return response.data;
    } catch (err) {
      console.error(`Failed to add review for movie ${movieId}:`, err);
      set({ error: err.response?.data || err.message });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  updateReview: async (movieId, { rating, review }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.put(
        `/reviews/${movieId}`,
        { rating, review },
        { withCredentials: true }
      );
      
      set((state) => {
        const updatedList = state.reviewsByMovie[movieId]?.map((r) =>
          r.userId === useAuthStore.getState().authUser?.id ? response.data.review : r
        ) || [];
        
        return {
          reviewsByMovie: { ...state.reviewsByMovie, [movieId]: updatedList },
          userReview: { ...state.userReview, [movieId]: response.data.review },
          moviesById: {
            ...state.moviesById,
            [movieId]: response.data.movie 
          }
        };
      });
      
      return response.data;
    } catch (err) {
      console.error(`Failed to update review for movie ${movieId}:`, err);
      set({ error: err.response?.data || err.message });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

}));

export default useRatingStore;
