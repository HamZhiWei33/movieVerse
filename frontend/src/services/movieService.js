import { axiosInstance } from "../lib/axios.js"; 

export const fetchMovies = async (page = 1, limit = 100, filters = {}) => {
  try {
    const response = await axiosInstance.get("/movies", {
      params: { page, limit, ...filters },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch movies", error);
    throw error;
  }
};

export const fetchMovieById = async (id) => {
  try {
    const response = await axiosInstance.get(`/movies/${id}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error(`Failed to fetch movie with ID ${id}`, error);
    throw error;
  }
};

export const fetchGenres = async () => {
  try {
    const response = await axiosInstance.get("/movies/genres/all");
    console.log("Genre API response:", response.data);
    return response.data.data || response.data;
  } catch (error) {
    console.error("Failed to fetch genres", error);
    throw error;
  }
};

export const fetchFilterOptions = async () => {
  try {
    const response = await axiosInstance.get("/movies/filters");
    return response.data.data || response.data;
  } catch (error) {
    console.error("Failed to fetch filter options", error);
    throw error;
  }
};

export const fetchMovieLikes = async (id) => {
  try {
    const response = await axiosInstance.get(`/likes/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch likes", error);
    throw error;
  }
};

export const likeMovie = async (movieId) => {
  try {
    const response = await axiosInstance.post(`/likes/${movieId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to like movie", error);
    throw error;
  }
};

export const unlikeMovie = async (movieId) => {
  try {
    const response = await axiosInstance.delete(`/likes/${movieId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to unlike movie", error);
    throw error;
  }
};

export const hasUserLikedMovie = async (movieId) => {
  try {
    const response = await axiosInstance.post(`/likes/${movieId}/check`);
    return response.data.liked;
  } catch (error) {
    console.error("Failed to check like status", error);
    return false;
  }
};

export const fetchWatchlistStatus = async (movieId) => {
  try {
    const response = await axiosInstance.get("/users/watchlist");
    const watchlist = response.data;
    return watchlist.some(movie => movie._id === movieId);
  } catch (error) {
    console.error("Failed to fetch watchlist status", error);
    throw error;
  }
};

export const addToWatchlist = async (movieId) => {
  try {
    const response = await axiosInstance.post(`/users/watchlist/${movieId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to add to watchlist", error);
    throw error;
  }
};

export const removeFromWatchlist = async (movieId) => {
  try {
    const response = await axiosInstance.delete(`/users/watchlist/${movieId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to remove from watchlist", error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await axiosInstance.get("/users/me");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch current user", error);
    throw error;
  }
};
