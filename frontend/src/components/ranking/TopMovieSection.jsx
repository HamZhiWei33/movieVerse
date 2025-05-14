// components/TopMovieSection.jsx
import React, { useState, useEffect, useMemo } from "react";
import ReviewStars from "../directory/ReviewStars";
import LikeIcon from "../directory/LikeIcon";
import { IoTime } from "react-icons/io5";
import AddToWatchlistIcon from "../directory/AddToWatchlistIcon";
import RatingBarChart from '../directory/RatingBarChart';
import { genres as allGenres, movies as allMovies } from "../../constant.js";

const TopMovieSection = ({ selectedMovie, setSelectedMovie, ratingDistribution, allReviews }) => {

  const [liked, setLiked] = useState(false);
  const [addedToWatchlist, setAddedToWatchlist] = useState(false);

  useEffect(() => {
    setLiked(false);
    setAddedToWatchlist(false);
  }, [selectedMovie]);
  
  //Calculate average rating
  const calculateAverageRating = (movieId) => {
    if (!Array.isArray(allReviews) || allReviews.length === 0) return 0;

    const selectedReviews = allReviews.filter(
      (r) => r.movieId === movieId
    );

    const validRatings = selectedReviews
      .map((r) => Number(r.rating))
      .filter((r) => !isNaN(r));

    if (validRatings.length === 0) return 0;

    const sum = validRatings.reduce((acc, rating) => acc + rating, 0);
    const average = sum / validRatings.length;

    return parseFloat(average.toFixed(1));
  };

  // compute top 3 for display
  const [first, second, third] = useMemo(() => {
    return [...allMovies]
      .map((movie) => ({
        ...movie,
        compositeScore: calculateAverageRating(movie.id) * 0.9 + (movie.year - 2000) * 0.1, // 90% rating + 10% recency (year)
      }))
      .sort((a, b) => {
      // First, compare by compositeScore
      if (b.compositeScore === a.compositeScore) {
        // If compositeScore is the same, compare by id (you can also use a different field)
        return a.id.localeCompare(b.id); // Sort by id in lexicographical order
      }
      return b.compositeScore - a.compositeScore; // If not, compare by compositeScore
    })
      .slice(0, 3); // Get the top 3 movies
  }, [allMovies, allReviews]);

  const top3 = [second, first, third];

  const formatDuration = (minutes) => {
    if (!minutes || isNaN(minutes)) return "N/A";

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return hours > 0
      ? `${hours}h${mins > 0 ? ` ${mins}min` : ""}`.trim()
      : `${mins}min`;
  };

  // format duration
  // const durationText = useMemo(() => {
  //   if (!selectedMovie?.duration) return "";
  //   const hrs = Math.floor(selectedMovie.duration / 60);
  //   const mins = selectedMovie.duration % 60;
  //   return `${hrs}h ${mins}min`;
  // }, [selectedMovie]);
  const durationText = useMemo(() => {
    return formatDuration(selectedMovie?.duration);
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

  const averageRating = useMemo(() => calculateAverageRating(selectedMovie.id), [selectedMovie, allReviews]);

  const movieReviews = useMemo(() => {
    if (!selectedMovie || !Array.isArray(allReviews)) return [];
    return allReviews.filter(r => r.movieId === selectedMovie.id);
  }, [selectedMovie, allReviews]);

  return (
    <div className="blurred-banner-wrapper">
      <div className="background-container">
        <div
          className="background-blur"
          style={{
            backgroundImage: `url(${selectedMovie ? selectedMovie.posterUrl : top3[0]?.posterUrl})`
          }}
        />
        <div className="dark-overlay" />
      </div>

      <section className="top-section">
  <section className="ranking-three-columns">
    {top3.map((movie, idx) => {
      const label = idx === 0 ? "Top 2" : idx === 1 ? "Top 1" : "Top 3";
      const isActive = movie.id === selectedMovie.id;
      return (
        <div
          key={movie.id}
          className={`card ${isActive ? "main-card active" : "side-card"}`}
          onClick={() => setSelectedMovie(movie)}
          onMouseEnter={() => setSelectedMovie(movie)}
        >
          <h2 className="rank-label">{label}</h2>
          <div className="image-container">
            <img src={movie.posterUrl} alt={movie.title} />
          </div>
        </div>
      );
    })}
  </section>

        <section className="movie-details-two-column">
          <div className="left-column">
            <h3>{selectedMovie.title}</h3>
            <div className="rating-bar">
              <ReviewStars rating={averageRating} readOnly={true} showNumber={true} size="large" />
            </div>
            <div className="tags">
              <span className="badge">{genreNames}</span>
              <span className="badge">{selectedMovie.region}</span>
              <span className="badge">{selectedMovie.year}</span>
            </div>
            <div className="duration-like">
              <span className="badge-duration"><span className="badge-duration-icon">
                <IoTime />
              </span>{durationText}</span>
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

        {/* <section className="rating-visual-summary">
          <div className="score-left">
            <div className="score-number">{averageRating}</div>
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
        </section> */}
        <section className="rating-visual-summary">
          <RatingBarChart movieReviews={movieReviews} />
        </section>

      </section>
    </div>
  );
};

export default TopMovieSection;
