// components/TopMovieSection.jsx
import React, { useState, useEffect, useMemo } from "react";
import ReviewStars from "../directory/ReviewStars";
import LikeIcon from "../directory/LikeIcon";
import AddToWatchlistIcon from "../directory/AddToWatchlistIcon";
import { genres as allGenres, movies as allMovies } from "../../constant.js";

const TopMovieSection = ({ selectedMovie, setSelectedMovie, ratingDistribution }) => {
  
   const [liked, setLiked] = useState(false);
   const [addedToWatchlist, setAddedToWatchlist] = useState(false);
 
   useEffect(() => {
     setLiked(false);
     setAddedToWatchlist(false);
   }, [selectedMovie]);

  // compute top 3 for display
  const [first, second, third] = useMemo(() => {
    return [...allMovies]
    .map((movie) => ({
      ...movie,
      compositeScore: movie.rating * 0.8 + (movie.year - 2000) * 0.02, // 80% rating + 20% recency (year)
    }))
    .sort((a, b) => b.compositeScore - a.compositeScore)
    .slice(0, 3); // Get the top 3 movies
}, []);

  const top3 = [second, first, third];

  // format duration
  const durationText = useMemo(() => {
    if (!selectedMovie?.duration) return "";
    const hrs = Math.floor(selectedMovie.duration / 60);
    const mins = selectedMovie.duration % 60;
    return `⏱ ${hrs}h ${mins}min`;
  }, [selectedMovie]);

   // Total and percent distribution
   const { totalRatings, percentDistribution } = useMemo(() => {
    const total = Object.values(ratingDistribution).reduce((sum, v) => sum + v, 0);
    const percents = {};
    Object.entries(ratingDistribution).forEach(([star, count]) => {
      percents[star] = total > 0 ? Math.round((count / total) * 100) : 0;
    });
    return { totalRatings: total, percentDistribution: percents };
  }, [ratingDistribution]);

// Get the genre names from the genre IDs
  const genreNames = useMemo(() => {
    return selectedMovie.genre
      .map((gid) => {
        const g = allGenres.find((item) => item.id === gid);
        return g ? g.name : gid;
      })
      .join(", ");
  }, [selectedMovie]);

  return (
    <div className="blurred-banner-wrapper">
      <div
        className="background-blur"
        style={{ backgroundImage: `url(${selectedMovie?.posterUrl})` }}
      />

      <section className="top-section">
      <section className="ranking-three-columns">
      {top3.map((movie, idx) => {
        const label = idx === 0 ? "Top 2" : idx === 1 ? "Top 1" : "Top 3";
        const isActive = movie.id === selectedMovie.id;
       return (
         <div
          key={movie.id}
          // className={`card ${isCenter ? "main-card active" : "side-card"}`}
          className={`card ${isActive ? "main-card active" : "side-card"}`}
          onClick={() => setSelectedMovie(movie)}
        >

        <h2>{label}</h2>
        <img src={movie.posterUrl} alt={movie.title} />
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
              <span className="badge">{genreNames}</span>
              <span className="badge">{selectedMovie.region}</span>
              <span className="badge">{selectedMovie.year}</span>
            </div>
            <div className="duration-like">
              <span className="badge-duration">{durationText}</span>
            </div>
            <div className="action-buttons">
              <button className="watch-trailer" onClick={() => window.open(selectedMovie.trailerUrl, "_blank")}>▶ Watch Trailer</button>
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
                    style={{ width: `${percentDistribution[star] || 0}%`}}
                  ></div>
                </div>
              </div>
            ))}
            <div className="total-ratings">{totalRatings} Ratings</div>
          </div>
        </section>
      </section>
    </div>
  );
};

export default TopMovieSection;
