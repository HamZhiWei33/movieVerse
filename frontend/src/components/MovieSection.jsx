//This MovieSection component is used to display a card that involve like and add to watchlist icons.
import { useNavigate } from "react-router-dom";
import LikeIcon from "/src/components/directory/LikeIcon";
import AddToWatchlistIcon from "/src/components/directory/AddToWatchlistIcon.jsx";
import "../styles/directory/MovieCard.css";

const MovieSection = ({
  movie,
  liked,
  addedToWatchlist,
  onLike,
  onAddToWatchlist,
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

  return (
    <article
      className="movie-card"
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      <div className="poster-container">
        <img
          src={movie.image}
          alt={`Poster of ${movie.title}`}
          className="poster-img"
        />
        <div className="hover-overlay">
          <div className="top-right">
            <span className="rating">{movie.rating}</span>
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
    </article>
  );
};

export default MovieSection; 