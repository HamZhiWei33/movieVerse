import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReviewStars from "../directory/ReviewStars";
import LikeIcon from "../directory/LikeIcon";
import AddToWatchlistIcon from "../directory/AddToWatchlistIcon";
import { IoTime } from "react-icons/io5";
import usePreviousScrollStore from "../../store/usePreviousScrollStore";
import useRankingStore from '../../store/useRankingStore';
import "../directory/MovieCard";

const Top1Card = ({ movie, rank, image, title, rating, description, genre, region, year, duration }) => {
  const navigate = useNavigate();
  const { setPreviousScrollPosition } = usePreviousScrollStore();
  const {
    likeMovie,
    unlikeMovie,
    addToWatchlist,
    removeFromWatchlist,
    hasUserLikedMovie,
    isInWatchlist,
  } = useRankingStore();

  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingWatchlist, setLoadingWatchlist] = useState(false);
  const [liked, setLiked] = useState(false);
  const [watchlisted, setWatchlisted] = useState(false);

  const handleCardClick = () => {
    setPreviousScrollPosition(window.scrollY);
    navigate(`/movie/${movie._id}`);
  };

  const fetchLikeState = async () => {
    const likedStatus = await hasUserLikedMovie(movie._id);
    setLiked(likedStatus);
  };

  React.useEffect(() => {
    fetchLikeState();
    setWatchlisted(isInWatchlist(movie._id));
  }, [movie._id]);

  const handleLikeClick = async (e) => {
    e.stopPropagation();
    if (loadingLike) return;
    setLoadingLike(true);
    try {
      if (liked) {
        await unlikeMovie(movie._id);
      } else {
        await likeMovie(movie._id);
      }
      fetchLikeState();
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
      if (watchlisted) {
        await removeFromWatchlist(movie._id);
        setWatchlisted(false);
      } else {
        await addToWatchlist(movie._id);
        setWatchlisted(true);
      }
    } catch (error) {
      console.error("Error updating watchlist:", error);
    } finally {
      setLoadingWatchlist(false);
    }
  };

  return (
    <div className="top1-card" onClick={handleCardClick} style={{ cursor: "pointer" }}>
      <div className="genre-card-header">
        <h3>Top {rank}</h3>
        <div className="genre-rating-value">
          {rating === 0 ? 0 : rating.toFixed(1)}
        </div>
      </div>

      <div className="genre-card-body">
        <img src={image} alt={title} className="top1-image" />
      </div>
      <div className="genre-info">
        <h4 className="genre-title">{title}</h4>
        <div className="rating-bar">
          <ReviewStars rating={rating} readOnly={true} size="medium" />
        </div>
        <div className="tags">
          <span className="badge">{genre}</span>
          <span className="badge">{region}</span>
          <span className="badge">{year}</span>
        </div>
        <div className="duration-like">
          <span className="badge-duration">
            <span className="badge-duration-icon">
              <IoTime />
            </span>
            {duration}
          </span>
          <LikeIcon movie={movie} disabled={loadingLike} />
            <AddToWatchlistIcon 
              movie={movie} 
              disabled={loadingWatchlist}
            />
        </div>
        <p className="top1-description">{description}</p>
      </div>
    </div>
  );
};

export default Top1Card;
