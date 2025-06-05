import { axiosInstance } from "../../lib/axios.js";

const InsertButton = () => {
  const handleInsert = async () => {
    try {
      const res = await axiosInstance.post("/users/watchlist", {
        movieId: "6833551d0ef5ba229388e29d",
      });
      console.log("Inserted:", res.data);
    } catch (err) {
      console.error("Insert error:", err.response?.data || err.message);
    }
  };

  return <button onClick={handleInsert}>Insert Movie to Watchlist</button>;
};

export default InsertButton;
