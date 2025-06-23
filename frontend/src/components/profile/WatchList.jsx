import "../../styles/profile/watchlist.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoTime } from "react-icons/io5";
import ReviewStars from "../directory/ReviewStars";
import LikeIcon from "../directory/LikeIcon";
import useMovieStore from "../../store/useMovieStore";

const WatchList = ({ movie, onRemove }) => {
  const navigate = useNavigate();
  const { removeFromWatchlist } = useMovieStore();

  const [loadingRemove, setLoadingRemove] = useState(false);

  const handleCardClick = () => {
    navigate(`/movie/${movie._id}`);
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

  const rating = movie.rating && movie.rating > 0 ? Number(movie.rating.toFixed(1)) : 0;

  return (
    <article id="watchlist" style={{ cursor: "pointer" }} onClick={handleCardClick}>
      <div className="movie-card-list">
        <div className="poster-container-list">
          <img
            src={movie.posterUrl}
            alt={`Poster of ${movie.title}`}
            className="poster-img-list"
          />
        </div>
        <div className="movie-details-container-list">
          <h3>{movie.title}</h3>
          <ReviewStars
            rating={rating}
            readOnly={true}
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
            <LikeIcon movie={movie} />
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
