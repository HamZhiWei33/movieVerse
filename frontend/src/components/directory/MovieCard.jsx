import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LikeIcon from "./LikeIcon";
import AddToWatchlistIcon from "./AddToWatchlistIcon";
import "../../styles/directory/MovieCard.css";
import usePreviousScrollStore from "../../store/usePreviousScrollStore";
import useMovieStore from '../../store/useMovieStore';

const MovieCard = ({ movie, children }) => {
  const {
    likeMovie,
    unlikeMovie,
    addToWatchlist,
    removeFromWatchlist,
  } = useMovieStore();

  const { setPreviousScrollPosition } = usePreviousScrollStore();
  const navigate = useNavigate();

  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingWatchlist, setLoadingWatchlist] = useState(false);
  const [liked, setLiked] = useState(movie.liked || false);
  const [likeCount, setLikeCount] = useState(movie.likeCount || 0);
  const [isInWatchlist, setIsInWatchlist] = useState(movie.watchlisted || false);

  const handleCardClick = () => {
    setPreviousScrollPosition(window.scrollY);
    navigate(`/movie/${movie._id}`); // No need to pass full state
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
    } catch (error) {
      console.error("Error updating watchlist:", error);
    } finally {
      setLoadingWatchlist(false);
    }
  };

  return (
    <article className="movie-card" onClick={handleCardClick} style={{ cursor: "pointer" }}>
      <div className="poster-container">
        <img src={movie.posterUrl} alt={`Poster of ${movie.title}`} className="poster-img" />
        <div className="hover-overlay">
          <div className="top-right">
            <span className="rating">
              {movie.rating && movie.rating > 0 ? movie.rating.toFixed(1) : "0"}
            </span>
          </div>
          <div className="bottom-icons" onClick={(e) => e.stopPropagation()}>
            <LikeIcon liked={liked} onClick={handleLikeClick} disabled={loadingLike} />
            <AddToWatchlistIcon
              addedToWatchlist={isInWatchlist}
              onClick={handleAddToWatchlistClick}
              disabled={loadingWatchlist}
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