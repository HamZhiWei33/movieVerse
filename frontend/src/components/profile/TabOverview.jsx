import React from "react";
import ReviewChart from "./ReviewChart";
import ReviewGenreChart from "./ReviewGenreChart";

const mockMovies = [
  {
    id: 1,
    title: "The Shawshank Redemption",
    poster_path: "/edKpE9B5qN3e559OuMCLZdW1iBZ.jpg",
    vote_average: 8.7,
  },
  // Add more mock data if needed
];

const TabOverview = () => {
  // Get the first movie from the array
  const firstMovie = mockMovies[0];

  return (
    <div>
      {/* <ReviewChart />
      <ReviewGenreChart />
      {firstMovie && firstMovie.poster_path && (
        <img
          src={`https://image.tmdb.org/t/p/w500${firstMovie.poster_path}`}
          alt={firstMovie.title}
          style={{ width: "200px", height: "300px" }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/path/to/placeholder.jpg";
          }}
        />
      )} */}
    </div>
  );
};

export default TabOverview;
