import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LikeIcon from "./LikeIcon";
import AddToWatchlistIcon from "./AddToWatchlistIcon";
import "../../styles/directory/MovieCard.css";
import {
  likeMovie,
  unlikeMovie,
  addToWatchlist,
  removeFromWatchlist,
  fetchMovieLikes
} from "../../services/movieService";

const MovieCard = ({ movie, children, allReviews }) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(movie.liked ?? false);
  const [likeCount, setLikeCount] = useState(movie.likeCount ?? 0);
  const [watchlisted, setWatchlisted] = useState(movie.watchlisted ?? false);
  const [loading, setLoading] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  const handleCardClick = () => {
    navigate(`/movie/${movie._id}`, {
      state: { movie },
    });
  };

  const handleLikeClick = async (e) => {
    e.stopPropagation();
    if (loading) return;

    setLoading(true);
    try {
      if (liked) {
        await unlikeMovie(movie._id);
      } else {
        await likeMovie(movie._id);
      }
      const likesData = await fetchMovieLikes(movie._id);
      setLikeCount(likesData.count ?? 0);
      setLiked(!liked);
    } catch (error) {
      console.error("Error updating like:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWatchlistClick = async (e) => {
    e.stopPropagation();
    if (watchlistLoading) return;

    setWatchlistLoading(true);
    try {
      if (watchlisted) {
        await removeFromWatchlist(movie._id);
      } else {
        await addToWatchlist(movie._id);
      }
      setWatchlisted(!watchlisted);
    } catch (error) {
      console.error("Error updating watchlist:", error);
    } finally {
      setWatchlistLoading(false);
    }
  };

  const calculateAverageRating = () => {
    const movieReviews = (allReviews ?? []).filter(
      (review) => review.movieId === movie.id || review.movieId === movie._id
    );
    if (movieReviews.length === 0) return 0;
    const sum = movieReviews.reduce((acc, review) => acc + Number(review.rating), 0);
    return (sum / movieReviews.length).toFixed(1);
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
            <span className="rating">{calculateAverageRating()}</span>
          </div>
          <div className="bottom-icons" onClick={(e) => e.stopPropagation()}>
            <LikeIcon liked={liked} onClick={handleLikeClick} disabled={loading} />
            <AddToWatchlistIcon
              addedToWatchlist={watchlisted}
              onClick={handleWatchlistClick}
              disabled={watchlistLoading}
            />
          </div>
        </div>
      </div>
      <p>{movie.title}</p>
      {children}
    </article>
  );
};

export default MovieCard;