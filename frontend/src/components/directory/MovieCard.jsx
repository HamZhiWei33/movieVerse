import { useNavigate } from "react-router-dom";
import LikeIcon from "./LikeIcon";
import AddToWatchlistIcon from "./AddToWatchlistIcon";
import "../../styles/directory/MovieCard.css";

const MovieCard = ({
  movie,
  liked,
  addedToWatchlist,
  onLike,
  onAddToWatchlist,
  children, // Add children prop
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/movie/${encodeURIComponent(movie.title)}`, {
      state: { movieData: movie },
    });
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    onLike();
  };

  const handleAddToWatchlistClick = (e) => {
    e.stopPropagation();
    onAddToWatchlist();
  };

  const formatRating = (rating) => {
    if (rating === 0) return "0";
    return rating.toFixed(1); 
  };

  return (
    <article
      className="movie-card"
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      <div className="poster-container">
        <img
          src={movie.posterUrl}
          alt={`Poster of ${movie.title}`}
          className="poster-img"
        />
        <div className="hover-overlay">
          <div className="top-right">
            <span className="rating">{formatRating(movie.rating)}</span>
          </div>
          <div className="bottom-icons" onClick={(e) => e.stopPropagation()}>
            <LikeIcon liked={liked} onClick={handleLikeClick} />
            <AddToWatchlistIcon
              addedToWatchlist={addedToWatchlist}
              onClick={handleAddToWatchlistClick}
            />
          </div>
        </div>
      </div>
      <p>{movie.title}</p>
      {children} {/* Render children here */}
    </article>
  );
};

export default MovieCard;
