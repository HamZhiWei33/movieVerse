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
    fetchMovieLikes,
    likes,
    watchlistMap
  } = useMovieStore();
  const { setPreviousScrollPosition } = usePreviousScrollStore();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const likeData = likes[movie._id] || { count: movie.likeCount ?? 0 };
  const isLiked = likeData.liked ?? movie.liked ?? false;
  const likeCount = likeData.count ?? movie.likeCount ?? 0;
  const isInWatchlist = watchlistMap[movie._id] ?? movie.watchlisted ?? false;

  const handleCardClick = () => {
    setPreviousScrollPosition(window.scrollY);
    navigate(`/movie/${movie._id}`, { state: { movie } });
  };

  const handleLikeClick = async (e) => {
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    try {
      isLiked ? await unlikeMovie(movie._id) : await likeMovie(movie._id);
      await fetchMovieLikes(movie._id);
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
      isInWatchlist
        ? await removeFromWatchlist(movie._id)
        : await addToWatchlist(movie._id);
    } catch (error) {
      console.error("Error updating watchlist:", error);
    } finally {
      setWatchlistLoading(false);
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
            <LikeIcon liked={isLiked} onClick={handleLikeClick} disabled={loading} />
            <AddToWatchlistIcon
              addedToWatchlist={isInWatchlist}
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