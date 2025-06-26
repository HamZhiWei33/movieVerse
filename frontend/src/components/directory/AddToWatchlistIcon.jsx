import "../../styles/directory/InteractiveIcon.css";
import { useState, useEffect } from "react";
import { BsBookmarkPlus, BsBookmarkPlusFill } from 'react-icons/bs';
import { useAuthStore } from "../../store/useAuthStore";
import useMovieStore from "../../store/useMovieStore";

const AddToWatchlistIcon = ({ movie = {} }) => {
  if (!movie?._id) return null;

  const movieId = movie._id;
  const {
    watchlistStatuses,
    toggleWatchlist,
    checkWatchlistStatus
  } = useMovieStore();

  const { authUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  // Get status with proper null checks
  const isWatchlisted = watchlistStatuses[movieId]?.inWatchlist ?? false;

  // Initialize status on mount
  useEffect(() => {
    if (authUser) {
      checkWatchlistStatus(movieId);
    }
  }, [movieId, authUser]);

  const handleClick = async (e) => {
    e.stopPropagation();
    if (loading || !authUser) return;

    setLoading(true);
    try {
      await toggleWatchlist(movieId);
    } catch (error) {
      console.error("Watchlist operation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="iteractive-icon"
      onClick={handleClick}
      title={isWatchlisted ? "Remove from watchlist" : "Add to watchlist"}>
      <span className={`icon ${isWatchlisted ? 'addedToWatchlist' : ''}`}>
        {isWatchlisted ? <BsBookmarkPlusFill /> : <BsBookmarkPlus />}
      </span>
    </div>
  );
};

export default AddToWatchlistIcon;