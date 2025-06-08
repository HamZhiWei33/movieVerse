import React, { useEffect, useState } from "react";
import WatchList from "./WatchList.jsx";
import { useLocation, useSearchParams } from "react-router-dom";
import useWatchlistStore from "../../store/useWatchlistStore.js";
import useGenreStore from "../../store/useGenreStore.js"; // Assuming you have a genre store
const TabWatchlist = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "default";
  const { watchlist, fetchWatchlist } = useWatchlistStore();
  // const [genreMap, setGenreMap] = useState({});
  const { genreMap, fetchGenres } = useGenreStore();

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
            allReviews={[]} // replace with actual reviews if needed
          />
        ))}
    </div>
  );
};

export default TabWatchlist;
