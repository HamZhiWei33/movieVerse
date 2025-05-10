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
  showCastInfo = false,
  likeCount = 0,
}) => {
  const navigate = useNavigate();

  // Helper function to check if value exists and is not empty
  const hasValue = (value) => {
    if (value === undefined || value === null) return false;
    if (typeof value === 'string') return value.trim() !== '';
    if (Array.isArray(value)) return value.length > 0 && value[0] !== '';
    return true;
  };

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

  const handlePlayTrailerClick = (e) => {
    e.stopPropagation();
    if (movie.trailerUrl) {
      window.open(movie.trailerUrl, "_blank"); // Opens in new tab
    }
  };

  const formatDuration = (minutes) => {
    if (!minutes || isNaN(minutes)) return 'N/A';

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return hours > 0
      ? `${hours}h ${mins > 0 ? `${mins}min` : ''}`.trim()
      : `${mins}min`;
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
        <h3 style={{paddingInlineStart:7}}>{movie.title}</h3>
        <ReviewStars
          rating={movie.rating}
          readOnly={true}
          showNumber={showRatingNumber}
        />
        {hasValue(movie.genre) && (
          <div className="genre-tags">
            {movie.genre.map((genre, index) => (
              <span key={index} className="genre-tag">
                {genre}
              </span>
            ))}
          </div>
        )}
        <div className="duration-and-icons-container">
          <div className="duration-tag">
            <span className="duration-icon">
              <IoTime />
            </span>
            {formatDuration(movie.duration)}
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
        {showCastInfo && (hasValue(movie.director) || hasValue(movie.actors)) && (
          <div className="cast-info">
            {hasValue(movie.director) && (
              <div className="cast-row">
                <span className="cast-label">Director</span>
                <span className="director-item">{movie.director}</span>
              </div>
            )}

            {hasValue(movie.actors) && (
              <div className="cast-row">
                <span className="cast-label">Cast</span>
                <div className="actors-list">
                  {movie.actors.map((actor, index) => (
                    <span key={index} className="actor-item">
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {hasValue(movie.description) && (
          <p className="clamp-text">{movie.description}</p>
        )}
        {showBottomInteractiveIcon && (
          <div
            className="bottom-iteractive-icon-container"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="main-button" onClick={handlePlayTrailerClick}>
              <FaPlay className="play-icon" />
              Play Trailer
            </button>
            <div className="iteractive-icon" onClick={handleLikeClick}>
              <LikeIcon liked={liked} />
              <span className="like-count">{movie.likes}</span>
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
