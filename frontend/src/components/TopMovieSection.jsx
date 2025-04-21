// components/TopMovieSection.jsx
import React, { useState, useEffect } from "react";
import ReviewStars from "../components/directory/ReviewStars";
import LikeIcon from "../components/directory/LikeIcon";
import AddToWatchlistIcon from "../components/directory/AddToWatchlistIcon";


const TopMovieSection = ({ selectedMovie, sideMovies, setSelectedMovie, ratingDistribution }) => {
  
   const [liked, setLiked] = useState(false);
   const [addedToWatchlist, setAddedToWatchlist] = useState(false);
 
   useEffect(() => {
     setLiked(false);
     setAddedToWatchlist(false);
   }, [selectedMovie]);

  const allTopMovies = [selectedMovie, ...sideMovies]
  .filter(Boolean)
  .sort((a, b) => b.rating - a.rating)
  .slice(0, 3);

  const top1 = allTopMovies[0]; // center
  const top2 = allTopMovies[1]; // left
  const top3 = allTopMovies[2]; // right

  return (
    <div className="blurred-banner-wrapper">
      <div
        className="background-blur"
        style={{ backgroundImage: `url(${selectedMovie?.image})` }}
      />

      <section className="top-section">
      <section className="ranking-three-columns">
      {[top2, top1, top3].map((movie, index) => {
        const isSelected = movie.id === selectedMovie?.id;
        const isCenter = isSelected; // center = selected
        const topLabel = index === 0 ? "Top 2" : index === 1 ? "Top 1" : "Top 3";

       return (
         <div
          key={movie.id}
          className={`card ${isCenter ? "main-card active" : "side-card"}`}
          onClick={() => setSelectedMovie(movie)}
        >
        <h2>{topLabel}</h2>
        <img src={movie.image} alt={movie.title} />
        </div>
    );
  })}
</section>

        <section className="movie-details-two-column">
          <div className="left-column">
            <h1>{selectedMovie.title}</h1>
            <div className="rating-bar">
             <ReviewStars rating={selectedMovie.rating} readOnly={true} showNumber={true} size="medium"/>
            </div>
            <div className="tags">
              <span className="badge">Genre</span>
              <span className="badge">Region</span>
              <span className="badge">Year</span>
            </div>
            <div className="duration-like">
              <span className="badge-duration">⏱ 8h 20min</span>
            </div>
            <div className="action-buttons">
              <button className="watch-trailer">▶ Watch Trailer</button>
              <div className="iteractive-icon" onClick={() => setLiked(!liked)}>
                <LikeIcon liked={liked} />
              </div>
              <div className="iteractive-icon" onClick={() => setAddedToWatchlist(!addedToWatchlist)}>
                <AddToWatchlistIcon addedToWatchlist={addedToWatchlist} />
              </div>
            </div>
          </div>
          <div className="right-column">
            <p>{selectedMovie.description}</p>
          </div>
        </section>

        <section className="rating-visual-summary">
          <div className="score-left">
            <div className="score-number">{selectedMovie.rating}</div>
          </div>
          <div className="distribution-right">
            {[5, 4, 3, 2, 1].map((star) => (
              <div className="rating-row" key={star}>
                <span className="star-label">{"★".repeat(star)}</span>
                <div className="bar-background">
                  <div
                    className="bar-fill"
                    style={{ width: `${ratingDistribution[star] || 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
            <div className="total-ratings">999 Ratings</div>
          </div>
        </section>
      </section>
    </div>
  );
};

export default TopMovieSection;
