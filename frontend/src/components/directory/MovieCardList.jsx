import "../../styles/directory/MovieCardList.css";
import { useNavigate } from "react-router-dom";
import { IoTime } from "react-icons/io5";
import { FaPlay } from "react-icons/fa6";
import LikeIcon from "./LikeIcon";
import AddToWatchlistIcon from "./AddToWatchlistIcon";
import ReviewStars from "./ReviewStars";
import usePreviousScrollStore from "../../store/usePreviousScrollStore";

const MovieCardList = ({
  movie,
  genres = [],
  showRatingNumber = false,
  showBottomInteractiveIcon = false,
  showCastInfo = false,
}) => {
  const navigate = useNavigate();
  const { setPreviousScrollPosition } = usePreviousScrollStore();
  
  const averageRating = Math.max(movie?.rating ?? 0, 0);

  const handleCardClick = () => {
    setPreviousScrollPosition(window.scrollY);
    navigate(`/movie/${movie._id}`);
  };

  const handlePlayTrailerClick = (e) => {
    e.stopPropagation();
    if (movie.trailerUrl) {
      window.open(movie.trailerUrl, "_blank");
    }
  };

  return (
    <article className="movie-card-list" onClick={handleCardClick} style={{ cursor: "pointer" }}>
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
          rating={averageRating}
          readOnly={true}
          showNumber={showRatingNumber}
        />
        <div className="genre-tags">
          {genres.map((genre, index) => (
            <span key={index} className="genre-tag">{genre}</span>
          ))}
        </div>
        <div className="duration-and-icons-container">
          <div className="duration-tag">
            <span className="duration-icon"><IoTime /></span>
            {movie.duration === "0h 0min" ? "To Be Announced" : movie.duration}
          </div>
          {!showBottomInteractiveIcon && (
            <div className="iteractive-icon-container" onClick={(e) => e.stopPropagation()}>
              <LikeIcon movie={movie} />
              <AddToWatchlistIcon movie={movie} />
            </div>
          )}
        </div>

        {showCastInfo && (
          <div className="cast-info">
            {movie.director && (
              <div className="cast-row">
                <span className="cast-label">Director</span>
                <span className="director-item">{movie.director}</span>
              </div>
            )}
            {movie.actors?.filter((actor) => actor.trim() !== "").length > 0 && (
              <div className="cast-row">
                <span className="cast-label">Cast</span>
                <div className="actors-list">
                  {movie.actors.map(
                    (actor, index) =>
                      actor.trim() !== "" && (
                        <span key={index} className="actor-item">{actor}</span>
                      )
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <p className="clamp-text">{movie.description}</p>

        {showBottomInteractiveIcon && (
          <div className="bottom-iteractive-icon-container" onClick={(e) => e.stopPropagation()}>
            <button className="main-button" onClick={handlePlayTrailerClick}>
              <FaPlay className="play-icon" />
              Watch Trailer
            </button>
            <LikeIcon movie={movie} showCount={true} />
            <AddToWatchlistIcon movie={movie} />
          </div>
        )}
      </div>
    </article>
  );
};

export default MovieCardList;