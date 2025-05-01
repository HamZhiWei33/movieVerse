// components/Top1Card.jsx
import React, { useState} from "react";
import ReviewStars from "../directory/ReviewStars";
import LikeIcon from "../directory/LikeIcon";
import AddToWatchlistIcon from "../directory/AddToWatchlistIcon";
import { useNavigate } from "react-router-dom";
import "../directory/MovieCard";

const Top1Card = ({movie, rank, image, title, rating, description, genre, region, year, duration}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/movie/${encodeURIComponent(title)}`, {
      state: {movieData: movie},
    });
  };

  const [liked, setLiked] = useState(false);
  const [addedToWatchlist, setAddedToWatchlist] = useState(false);

  return (
    <div className="top1-card" onClick={handleClick}>
      <div className="genre-card-header">
        <h3>Top {rank}</h3>
        <div className="genre-rating-value">{rating.toFixed(1)}</div>
      </div>

      <div className="genre-card-body">
        <img src={image} alt={title} className="top1-image"/>
      </div>
      <div className="genre-info">
          <h4 className="genre-title">{title}</h4>
          <div className="rating-bar">
             <ReviewStars rating={rating} readOnly={true} showNumber={true} />
            </div>
          <div className="tags">
            <span className="badge">{genre}</span>
            <span className="badge">{region}</span>
            <span className="badge">{year}</span>
          </div>
          <div className="duration-like">
            <span className="badge-duration">{duration}</span>
            <div className="iteractive-icon" onClick={() => setLiked(!liked)}>
                <LikeIcon liked={liked} />
              </div>
              <div className="iteractive-icon" onClick={() => setAddedToWatchlist(!addedToWatchlist)}>
                <AddToWatchlistIcon addedToWatchlist={addedToWatchlist} />
              </div>
          </div>
          <p className="top1-description">{description}</p>
        </div>     
    </div>
  );
};

export default Top1Card;
