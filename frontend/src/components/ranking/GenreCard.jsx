// components/GenreCard.jsx
import React, { useState } from "react";
import ReviewStars from "../directory/ReviewStars";
import LikeIcon from "../directory/LikeIcon";
import AddToWatchlistIcon from "../directory/AddToWatchlistIcon";
import { IoTime } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import usePreviousScrollStore from "../../store/usePreviousScrollStore";
import useMovieStore from '../../store/useMovieStore';
import "../directory/MovieCard";

const GenreCard = ({ movie, rank, image, title, rating, genre, region, year, duration }) => {
  const navigate = useNavigate();
  const { setPreviousScrollPosition } = usePreviousScrollStore();
  const {
    likeMovie,
    unlikeMovie,
    addToWatchlist,
    removeFromWatchlist,
  } = useMovieStore();

  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingWatchlist, setLoadingWatchlist] = useState(false);
  const [liked, setLiked] = useState(movie?.liked || false);
  const [isInWatchlist, setIsInWatchlist] = useState(movie?.watchlisted || false);

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
            {/* <div className="iteractive-icon" onClick={(e) => {
              e.stopPropagation();
              handleLikeClick(e);
            }}>
              <LikeIcon liked={liked} disabled={loadingLike} />
            </div>
            <div className="iteractive-icon" onClick={(e) => {
              e.stopPropagation();
              handleAddToWatchlistClick(e);
            }}>
              <AddToWatchlistIcon 
                addedToWatchlist={isInWatchlist} 
                disabled={loadingWatchlist}
              />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenreCard;
