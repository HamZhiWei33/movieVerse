import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LikeIcon from "./LikeIcon";
import AddToWatchlistIcon from "./AddToWatchlistIcon";
import "../../styles/directory/MovieCard.css";
import usePreviousScrollStore from "../../store/usePreviousScrollStore";
import useMovieStore from '../../store/useMovieStore';

const MovieCard = ({ movie, children, allReviews }) => {
  const {
    likeMovie,
    unlikeMovie,
    addToWatchlist,
    removeFromWatchlist,
    fetchMovieLikes
  } = useMovieStore();
  const { setPreviousScrollPosition } = usePreviousScrollStore();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(movie.liked ?? false);
  const [likeCount, setLikeCount] = useState(movie.likeCount ?? 0);
  const [watchlisted, setWatchlisted] = useState(movie.watchlisted ?? false);
  const [loading, setLoading] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  const handleCardClick = () => {
    setPreviousScrollPosition(window.scrollY); // save scroll position before navigating
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
            <span className="rating">{movie.rating && movie.rating > 0
              ? movie.rating.toFixed(1)
              : "0"}</span>
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