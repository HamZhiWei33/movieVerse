import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ReviewStars from "../directory/ReviewStars";
import { IoTime } from "react-icons/io5";
import { GoHeartFill } from "react-icons/go";
import LikeIcon from "../directory/LikeIcon";
import "../../styles/profile/watchlist.css";
import useMovieStore from "../../store/useMovieStore";

const WatchList = ({ movie, showRatingNumber = false, onRemove }) => {
  const navigate = useNavigate();
  const {
    removeFromWatchlist,
    fetchWatchlist,
    likeMovie,
    unlikeMovie,
    fetchMovieLikes,
    hasUserLikedMovie,
  } = useMovieStore();

  const [loadingRemove, setLoadingRemove] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(movie.likeCount || 0);
  const [loadingLike, setLoadingLike] = useState(false);

  // Initialize like status
  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const isLiked = await hasUserLikedMovie(movie._id);
        setLiked(isLiked);

        const likesData = await fetchMovieLikes(movie._id);
        setLikeCount(likesData.count || 0);
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };

    checkLikeStatus();
  }, [movie._id, hasUserLikedMovie, fetchMovieLikes]);

  const handleCardClick = () => {
    navigate(`/movie/${movie._id}`, {
      state: { movie: { ...movie, liked, likeCount } },
    });
  };

  const handleRemoveClick = async (e) => {
    e.stopPropagation();
    if (loadingRemove) return;

    const confirm = window.confirm(
      `Are you sure you want to remove "${movie.title}" from your watchlist?`
    );
    if (!confirm) return;

    setLoadingRemove(true);
    try {
      await removeFromWatchlist(movie._id);
      onRemove(movie._id);
    } catch (err) {
      console.error(
        "Failed to remove movie:",
        err.response?.data || err.message
      );
    } finally {
      setLoadingRemove(false);
    }
  };

  const handleLikeClick = async (e) => {
    e.stopPropagation();
    if (loadingLike) return;

    setLoadingLike(true);
    try {
      if (liked) {
        await unlikeMovie(movie._id);
        setLikeCount((prev) => prev - 1);
      } else {
        await likeMovie(movie._id);
        setLikeCount((prev) => prev + 1);
      }
      setLiked(!liked);
    } catch (error) {
      console.error("Error updating like:", error);
    } finally {
      setLoadingLike(false);
    }
  };

  const rating =
    movie.rating && movie.rating > 0 ? Number(movie.rating.toFixed(1)) : 0;

  return (
    <article id="watchlist" style={{ cursor: "pointer" }}>
      <div className="movie-card-list">
        <div className="poster-container-list">
          <img
            src={movie.posterUrl}
            alt={`Poster of ${movie.title}`}
            className="poster-img-list"
          />
        </div>
        <div className="movie-details-container-list" onClick={handleCardClick}>
          <h3>{movie.title}</h3>
          <ReviewStars
            rating={rating}
            readOnly={true}
            showNumber={showRatingNumber}
          />
          <div className="genre-tags">
            {movie.genre?.map((genre, index) => (
              <span key={index} className="genre-tag">
                {genre}
              </span>
            ))}
          </div>
          <div id="watchlist-duration-and-icons-container">
            <div className="duration-tag">
              <span className="duration-icon">
                <IoTime />
              </span>
              {movie.duration === "0h 0min" ? "To Be Announced" : movie.duration}
            </div>
                <LikeIcon movie={movie} disabled={loadingLike} />
          </div>
        </div>
        <div className="remove-watchlist-container">
          <button
            className="remove-watchlist-btn"
            onClick={handleRemoveClick}
            disabled={loadingRemove}
            aria-label={`Remove ${movie.title} from watchlist`}
          >
            {loadingRemove ? "Removing..." : "Remove"}
          </button>
        </div>
      </div>
    </article>
  );
};

export default WatchList;
