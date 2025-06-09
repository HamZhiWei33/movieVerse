import axios from "axios";

const API_BASE_URL = "http://localhost:5001";

export const fetchMovies = async (page = 1, limit = 100, filters = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/movies`, {
      params: { 
        page, 
        limit,
        ...filters 
      }
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch movies", error);
    throw error;
  }
};

export const fetchGenres = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/movies/genres/all`);
    console.log("Genre API response:", response.data);
    // Ensure we return the data array
    return response.data.data || response.data;
  } catch (error) {
    console.error("Failed to fetch genres", error);
    throw error;
  }
};

export const fetchFilterOptions = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/movies/filters`);
    return response.data.data || response.data;
  } catch (error) {
    console.error("Failed to fetch filter options", error);
    throw error;
  }
};


export const fetchReviews = async (movieId = null) => {
  try {
    const url = movieId 
      ? `${API_BASE_URL}/api/reviews?movieId=${movieId}`
      : `${API_BASE_URL}/api/reviews`;
    
    const response = await axios.get(url);
    // Ensure we return the data array
    return response.data.data || response.data;
  } catch (error) {
    console.error("Failed to fetch reviews", error);
    throw error;
  }
};
