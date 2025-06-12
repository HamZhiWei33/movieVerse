import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LikeIcon from "./LikeIcon";
import AddToWatchlistIcon from "./AddToWatchlistIcon";
import ReviewStars from "./ReviewStars";
import { IoTime } from "react-icons/io5";
import { FaPlay } from "react-icons/fa6";
import "../../styles/directory/MovieCardList.css";
import usePreviousScrollStore from "../../store/usePreviousScrollStore";
import useMovieStore from "../../store/useMovieStore";

const MovieCardList = ({
  movie,
  showRatingNumber = false,
  showBottomInteractiveIcon = false,
  showCastInfo = false,
}) => {
  const {
    likeMovie,
    unlikeMovie,
    addToWatchlist,
    removeFromWatchlist,
    fetchMovieLikes,
    likes,
    watchlistMap,
  } = useMovieStore();

  const navigate = useNavigate();
  const { setPreviousScrollPosition } = usePreviousScrollStore();

  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingWatchlist, setLoadingWatchlist] = useState(false);

  // Derive current like state from global store fallback to props
  const likeData = likes[movie._id] || { count: movie.likeCount ?? 0 };
  const isLiked = likeData.liked ?? movie.liked ?? false;
  const likeCount = likeData.count ?? movie.likeCount ?? 0;
  const isInWatchlist = watchlistMap[movie._id] ?? movie.watchlisted ?? false;

  const averageRating =
    movie.rating && movie.rating > 0 ? Number(movie.rating.toFixed(1)) : 0;

  const handleCardClick = () => {
    setPreviousScrollPosition(window.scrollY);
    navigate(`/movie/${movie._id}`, {
      state: { movie },
    });
  };

  const handleLikeClick = async (e) => {
    e.stopPropagation();
    if (loadingLike) return;

    setLoadingLike(true);
    try {
      isLiked ? await unlikeMovie(movie._id) : await likeMovie(movie._id);
      await fetchMovieLikes(movie._id);
    } catch (error) {
      console.error("Error updating like:", error);
    } finally {
      setLoadingLike(false);
    }
  };

  const handleAddToWatchlistClick = async (e) => {
    e.stopPropagation();
    if (loadingWatchlist) return;

    setLoadingWatchlist(true);
    try {
      isInWatchlist
        ? await removeFromWatchlist(movie._id)
        : await addToWatchlist(movie._id);
    } catch (error) {
      console.error("Error updating watchlist:", error);
    } finally {
      setLoadingWatchlist(false);
    }
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
          {movie.genre?.map((name, index) => (
            <span key={index} className="genre-tag">
              {name}
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
                <LikeIcon liked={isLiked} disabled={loadingLike} />
              </div>
              <div
                className="iteractive-icon"
                onClick={handleAddToWatchlistClick}
              >
                <AddToWatchlistIcon
                  addedToWatchlist={isInWatchlist}
                  disabled={loadingWatchlist}
                />
              </div>
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
                        <span key={index} className="actor-item">
                          {actor}
                        </span>
                      )
                  )}
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
              <LikeIcon liked={isLiked} disabled={loadingLike} />
              <span className="like-count">{likeCount}</span>
            </div>
            <div
              className="iteractive-icon"
              onClick={handleAddToWatchlistClick}
            >
              <AddToWatchlistIcon
                addedToWatchlist={isInWatchlist}
                disabled={loadingWatchlist}
              />
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default MovieCardList;