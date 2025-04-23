import React from "react";
import WatchList from "./WatchList.jsx";
import { getMovieObject } from "./watchlist.js";

const TabWatchlist = () => {
  const watchListMovies = getMovieObject("U2"); // Assume this returns an array of movie objects

  // Temporary placeholders for props (adjust these according to your actual logic or props)
  const likedMovies = []; // Add logic to get this user's liked movies
  const addToWatchlistMovies = []; // Add logic to get user's watchlist
  const toggleLike = (title) => console.log("Toggled like:", title);
  const toggleAddToWatchlist = (title) =>
    console.log("Toggled watchlist:", title);

  return (
    <div>
      {watchListMovies.length === 0 ? (
        <p>No movies in watchlist.</p>
      ) : (
        watchListMovies.map((movie) => (
          <WatchList key={movie.id} movie={movie} />
        ))
      )}
    </div>
  );
};

export default TabWatchlist;
