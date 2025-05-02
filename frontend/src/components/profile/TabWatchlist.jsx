import React from "react";
import WatchList from "./WatchList.jsx";
import { getMovieObject } from "./watchlist.js";
import { useLocation } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
const TabWatchlist = () => {
  const watchListMovies = getMovieObject("U2"); // Assume this returns an array of movie objects
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "default";
  // Scroll to section when component mounts or hash changes
  useEffect(() => {
    if (location.hash === "#watchlist") {
      setTimeout(() => {
        const element = document.getElementById("watchlist");
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100); // Small delay to ensure DOM is ready
    }
  }, [location.hash]);
  return (
    <div id="watchlist">
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
