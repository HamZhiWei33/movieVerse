import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import WatchList from "./WatchList.jsx";
import useMovieStore from "../../store/useMovieStore";
import useGenreStore from "../../store/useGenreStore";

const TabWatchlist = () => {
  const location = useLocation();
  const { watchlist: globalWatchlist, fetchWatchlist } = useMovieStore();
  const [watchlist, setWatchlist] = useState([]);
  const { genreMap, fetchGenres } = useGenreStore();

  // Fetch data on mount
  useEffect(() => {
    if (Object.keys(genreMap).length === 0) {
      fetchGenres();
    }
    fetchWatchlist();
  }, []);

  useEffect(() => {
    setWatchlist(globalWatchlist);
  }, [globalWatchlist]);

  // Scroll to #watchlist if hash changes
  useEffect(() => {
    if (location.hash === "#watchlist") {
      setTimeout(() => {
        const element = document.getElementById("watchlist");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, [location.hash]);

  if (!Array.isArray(watchlist) || watchlist.length === 0) {
    return (
      <section className="watchlist-section" aria-label="profile-review">
        <div style={{ "marginTop": "2rem" }} className="no-movies-message">
          <span>No movie in Watchlist</span>
        </div>
      </section>
    );
  }

  const handleRemove = (movieId) => {
    setWatchlist((prev) => prev.filter((movie) => movie._id !== movieId));
  };

  return (
    <div id="watchlist">
      {Array.isArray(watchlist) &&
        watchlist.length > 0 &&
        watchlist.map((movie) => (
          <WatchList
            key={movie._id}
            movie={{
              ...movie,
              genre: movie.genre.map((id) => genreMap[id] || "Unknown"),
            }}
            onRemove={handleRemove}
          />
        ))}
    </div>
  );
};

export default TabWatchlist;
