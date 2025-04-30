import { useNavigate } from "react-router-dom";
import LikeIcon from "./LikeIcon";
import AddToWatchlistIcon from "./AddToWatchlistIcon";
import ReviewStars from "./ReviewStars";
import { IoTime } from "react-icons/io5";
import { FaPlay } from "react-icons/fa6";
import "../../styles/directory/MovieCardList.css";

const MovieCardList = ({
  movie,
  liked,
  addedToWatchlist,
  onLike,
  onAddToWatchlist,
  showRatingNumber = false,
  showBottomInteractiveIcon = false,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/movie/${encodeURIComponent(movie.title)}`, {
      state: { movieData: movie }, // Pass entire movie object
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
      className="movie-card-list"
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
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
          rating={movie.rating}
          readOnly={true}
          showNumber={showRatingNumber}
        />
        <div className="genre-tags">
          {movie.genre.map((genre, index) => (
            <span key={index} className="genre-tag">
              {genre}
            </span>
          ))}
        </div>
        <div className="duration-and-icons-container">
          <div className="duration-tag">
            <span className="duration-icon">
              <IoTime />
            </span>
            {movie.duration}
          </div>
          {!showBottomInteractiveIcon && (
            <div
              className="iteractive-icon-container"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="iteractive-icon" onClick={handleLikeClick}>
                <LikeIcon liked={liked} />
              </div>
              <div
                className="iteractive-icon"
                onClick={handleAddToWatchlistClick}
              >
                <AddToWatchlistIcon addedToWatchlist={addedToWatchlist} />
              </div>
            </div>
          )}
        </div>
        <p className="clamp-text">{movie.description}</p>
        {showBottomInteractiveIcon && (
          <div
            className="bottom-iteractive-icon-container"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="main-button">
              <FaPlay className="play-icon" />
              Play Trailer
            </button>
            <div className="iteractive-icon" onClick={handleLikeClick}>
              <LikeIcon liked={liked} />
            </div>
            <div
              className="iteractive-icon"
              onClick={handleAddToWatchlistClick}
            >
              <AddToWatchlistIcon addedToWatchlist={addedToWatchlist} />
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default MovieCardList;
