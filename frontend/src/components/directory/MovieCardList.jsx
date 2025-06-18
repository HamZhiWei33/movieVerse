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
  liked: initialLiked = false,
  likeCount: initialLikeCount = 0,
  watchlisted: initialWatchlisted = false,
  genres = [],
  showRatingNumber = false,
  showBottomInteractiveIcon = false,
  showCastInfo = false,
}) => {
  const {
    likeMovie,
    unlikeMovie,
    addToWatchlist,
    removeFromWatchlist,
    fetchWatchlist,
    fetchMovieLikes,
  } = useMovieStore();

  const navigate = useNavigate();
  const { setPreviousScrollPosition } = usePreviousScrollStore();

  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingWatchlist, setLoadingWatchlist] = useState(false);

  const [liked, setLiked] = useState(movie.liked || false);
  const [likeCount, setLikeCount] = useState(movie.likeCount || 0);
  const [isInWatchlist, setIsInWatchlist] = useState(movie.watchlisted || false);

  const averageRating =
    movie.rating && movie.rating > 0 ? Number(movie.rating.toFixed(1)) : 0;

  const handleCardClick = () => {
    setPreviousScrollPosition(window.scrollY);
    navigate(`/movie/${movie._id}`, {
      state: { movie: { ...movie, liked, likeCount, watchlisted: isInWatchlist } },
    });
  };

  const handleLikeClick = async (e) => {
    e.stopPropagation();
    if (loadingLike) return;

    setLoadingLike(true);
    try {
      if (liked) {
        await unlikeMovie(movie._id);
        setLikeCount(prev => prev - 1);
      } else {
        await likeMovie(movie._id);
        setLikeCount(prev => prev + 1);
      }
      setLiked(!liked);
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
      if (isInWatchlist) {
        await removeFromWatchlist(movie._id);
      } else {
        await addToWatchlist(movie._id);
      }
      setIsInWatchlist(!isInWatchlist);
      await fetchWatchlist();
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
                <LikeIcon movie={movie} disabled={loadingLike} />
                <AddToWatchlistIcon movie={movie} disabled={loadingWatchlist} />
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
              <LikeIcon movie={movie} showCount={true} disabled={loadingLike} />
              <AddToWatchlistIcon movie={movie} disabled={loadingWatchlist} />
          </div>
        )}
      </div>
    </article>
  );
};

export default MovieCardList;