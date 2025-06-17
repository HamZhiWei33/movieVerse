import React, { useState, useEffect } from "react";
import ReviewStars from "../directory/ReviewStars";
import LikeIcon from "../directory/LikeIcon";
import AddToWatchlistIcon from "../directory/AddToWatchlistIcon";
import { IoTime } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import usePreviousScrollStore from "../../store/usePreviousScrollStore";
import useRankingStore from '../../store/useRankingStore';
import "../directory/MovieCard";

const GenreCard = ({ movie, rank, image, title, rating, genre, region, year, duration }) => {
  const navigate = useNavigate();
  const { setPreviousScrollPosition } = usePreviousScrollStore();
  const {
    likeMovie,
    unlikeMovie,
    addToWatchlist,
    removeFromWatchlist,
    hasUserLikedMovie,
    isInWatchlist
  } = useRankingStore();

  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingWatchlist, setLoadingWatchlist] = useState(false);
  const [liked, setLiked] = useState(false);
  const [watchlisted, setWatchlisted] = useState(false);

  useEffect(() => {
    if (!movie?._id) return;
    const checkStates = async () => {
      const likedStatus = await hasUserLikedMovie(movie._id);
      setLiked(likedStatus);
      setWatchlisted(isInWatchlist(movie._id));
    };
    checkStates();
  }, [movie._id]);

  const handleCardClick = () => {
    setPreviousScrollPosition(window.scrollY);
    navigate(`/movie/${movie._id}`);
  };

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
      const updated = await hasUserLikedMovie(movie._id);
      setLiked(updated);
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
    <div className="genre-card-ranking" onClick={handleCardClick}>
      <div className="genre-card-header">
        <h3>Top {rank}</h3>
        <div className="genre-rating-value">
          {rating === 0 ? 0 : rating.toFixed(1)}
        </div>
      </div>

      <div className="genre-card-body">
        <img src={image} alt={title} className="genre-poster" />
        <div className="genre-info">
          <h4 className="genre-title">{title}</h4>
          <div className="rating-bar">
            <ReviewStars rating={Number(rating.toFixed(1))} readOnly={true} showNumber={true} />
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
            <div className="iteractive-icon" onClick={handleLikeClick}>
              <LikeIcon liked={liked} disabled={loadingLike} />
            </div>
            <div className="iteractive-icon" onClick={handleAddToWatchlistClick}>
              <AddToWatchlistIcon 
                addedToWatchlist={watchlisted} 
                disabled={loadingWatchlist}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenreCard;
