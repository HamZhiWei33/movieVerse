// components/Top1Card.jsx
import React, { useState} from "react";
import ReviewStars from "../components/directory/ReviewStars";
import LikeIcon from "../components/directory/LikeIcon";
import AddToWatchlistIcon from "../components/directory/AddToWatchlistIcon";

const Top1Card = ({ rank, image, title, rating, description}) => {

  const [liked, setLiked] = useState(false);
     const [addedToWatchlist, setAddedToWatchlist] = useState(false);

  return (
    <div className="top1-card">
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
            <span className="badge">Genre</span>
            <span className="badge">Region</span>
            <span className="badge">Year</span>
          </div>
          <div className="duration-like">
            <span className="badge-duration">⏱ 8h 20min</span>
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
