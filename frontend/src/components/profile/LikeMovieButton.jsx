import { axiosInstance } from "../../lib/axios.js";

const LikeMovieButton = () => {
  const handleLikeMovie = async () => {
    try {
      const res = await axiosInstance.post(
        "/likes",
        {
          movieId: "6833551d0ef5ba229388e29b",
        },
        {
          withCredentials: true,
        }
      );

      console.log("Movie liked:", res.data);
    } catch (err) {
      console.error("Like error:", err.response?.data || err.message);
    }
  };

  return <button onClick={handleLikeMovie}>Like Movie</button>;
};

export default LikeMovieButton;
