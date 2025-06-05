import { axiosInstance } from "../../lib/axios.js";

const InsertReviewButton = () => {
  const handleInsertReview = async () => {
    try {
      const res = await axiosInstance.post(
        "/rating",
        {
          movieId: "6833551d0ef5ba229388e29a",
          rating: 4.5,
          review: "Great movie, really enjoyed it!",
        },
        {
          withCredentials: true, // Required if token is stored in cookies
        }
      );
      console.log("Review inserted:", res.data);
    } catch (err) {
      console.error("Review insert error:", err.response?.data || err.message);
    }
  };

  return <button onClick={handleInsertReview}>Insert Review</button>;
};

export default InsertReviewButton;
