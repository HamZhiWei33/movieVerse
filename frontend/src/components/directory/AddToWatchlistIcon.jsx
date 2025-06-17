import { BsBookmarkPlus, BsBookmarkPlusFill } from 'react-icons/bs';
import "../../styles/directory/InteractiveIcon.css";
import useMovieStore from "../../store/useMovieStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useState, useEffect } from "react";

const AddToWatchlistIcon = ({ movie = {} }) => {
  if (!movie?._id) return null;

  const movieId = movie._id;
  const {
    watchlistStatuses,
    addToWatchlist,
    removeFromWatchlist
  } = useMovieStore();

  const { authUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  // Get status with proper null checks
  const isWatchlisted = watchlistStatuses[movieId]?.inWatchlist ?? false;

  // Initialize status on mount
  useEffect(() => {
    const { checkWatchlistStatus } = useMovieStore.getState();
    if (authUser) {
      checkWatchlistStatus(movieId);
    }
  }, [movieId, authUser]);

  const handleClick = async (e) => {
    e.stopPropagation();
    if (loading || !authUser) return;

    setLoading(true);
    try {
      if (isWatchlisted) {
        await removeFromWatchlist(movieId);
      } else {
        await addToWatchlist(movieId);
      }
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