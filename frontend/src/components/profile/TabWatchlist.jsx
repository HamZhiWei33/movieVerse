import React, { useEffect, useState } from "react";
import WatchList from "./WatchList.jsx";
import { useLocation, useSearchParams } from "react-router-dom";
import useWatchlistStore from "../../store/useWatchlistStore.js";
import useGenreStore from "../../store/useGenreStore.js"; // Assuming you have a genre store
const TabWatchlist = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "default";
  const { watchlist: globalWatchlist, fetchWatchlist } = useWatchlistStore();
  const [watchlist, setWatchlist] = useState([]);
  const { genreMap, fetchGenres } = useGenreStore();

  // Sync Zustand store to local state once it's fetched
  useEffect(() => {
    setWatchlist(globalWatchlist);
  }, [globalWatchlist]);

  useEffect(() => {
    fetchWatchlist(); // fetch on mount
  }, [fetchWatchlist]);

  // Fetch genres from your genre model
  useEffect(() => {
    fetchGenres();
  }, []);

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

  // Fetch watchlist movies
  useEffect(() => {
    fetchWatchlist();
  }, []);
  if (!Array.isArray(watchlist) || watchlist.length === 0) {
    return (
      <section className="watchlist-section" aria-label="profile-review">
        <p className="no-watchlist">No watchlist available</p>
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
