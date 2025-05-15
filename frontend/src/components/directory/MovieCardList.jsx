import { useNavigate } from "react-router-dom";
import LikeIcon from "./LikeIcon";
import AddToWatchlistIcon from "./AddToWatchlistIcon";
import ReviewStars from "./ReviewStars";
import { IoTime } from "react-icons/io5";
import { FaPlay } from "react-icons/fa6";
import "../../styles/directory/MovieCardList.css";
import { genres } from '../../constant';

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
  allReviews,
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

  const calculateAverageRating = () => {
    if (!Array.isArray(allReviews) || allReviews.length === 0) return 0;

    const validRatings = allReviews
      .map(r => Number(r.rating))
      .filter(r => !isNaN(r));

    if (validRatings.length === 0) return 0;

    const sum = validRatings.reduce((acc, rating) => acc + rating, 0);
    const average = sum / validRatings.length;

    return average === 0 ? 0 : parseFloat(average.toFixed(1));
  };

  const averageRating = calculateAverageRating();

  const getGenreName = (id) => {
    const genreObj = genres.find(g => g.id === id);
    return genreObj ? genreObj.name : String(id);
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
          rating={averageRating}
          readOnly={true}
          showNumber={showRatingNumber}
        />
        <div className="genre-tags">
          {movie.genre.map((id, index) => (
            <span key={index} className="genre-tag">
              {getGenreName(id)}
            </span>
          ))}
        </div>
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
        {showCastInfo && (
          <div className="cast-info">
            {/* Only show Director section if there is a director */}
            {movie.director && (
              <div className="cast-row">
                <span className="cast-label">Director</span>
                <span className="director-item">{movie.director}</span>
              </div>
            )}

            {/* Only show Cast section if there are valid actors */}
            {movie.actors && movie.actors.filter(actor => actor.trim() !== "").length > 0 && (
              <div className="cast-row">
                <span className="cast-label">Cast</span>
                <div className="actors-list">
                  {movie.actors.map((actor, index) => (
                    actor.trim() !== "" && (
                      <span key={index} className="actor-item">
                        {actor}
                      </span>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        )}


        <p className="clamp-text">{movie.description}</p>
        {showBottomInteractiveIcon && (
          <div
            className="bottom-iteractive-icon-container"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="main-button" onClick={handlePlayTrailerClick}>
              <FaPlay className="play-icon" />
              Watch Trailer
            </button>
            <div className="iteractive-icon" onClick={handleLikeClick}>
              <LikeIcon liked={liked} />
              <span className="like-count">{likeCount}</span>
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
