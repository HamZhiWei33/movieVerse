import React, { useState, useEffect } from "react";
import MovieCard from "../directory/MovieCard";
import "../../styles/home/recommendation-section.css";
import { TfiReload } from "react-icons/tfi";
import { genres, reviews } from "../../constant";
import ReviewStars from "../directory/ReviewStars";

const RecommendationSection = ({ title, moviesType, items }) => {
  const [displayed, setDisplayed] = useState([]);
  const [likedMovies, setLikedMovies] = useState([]);
  const [addToWatchlistMovies, setAddToWatchlistMovies] = useState([]);

  const handleReload = () => {
    const shuffled = [...items].sort(() => 0.5 - Math.random());
    setDisplayed(shuffled.slice(0, 10));
  };

  useEffect(() => {
    if (moviesType === "recommendation") {
      handleReload();
    }
  }, [items]);

  const toggleLike = (title) => {
    setLikedMovies((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const toggleAddToWatchlist = (title) => {
    setAddToWatchlistMovies((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const genreMap = genres.reduce((map, genre) => {
    map[genre.id] = genre.name;
    return map;
  }, {});
  return (
    <section
      className="recommendation-section"
      role="region"
      aria-label="Recommended movies section"
    >
      <div className="recommendation-wrapper">
        {/* Title and Reload Icon Row */}
        <h2 className="recommendation-title">{title}</h2>
        {moviesType === "recommendation" && (
          <span
            className="recommendation-refresh"
            role="button"
            tabIndex={0}
            aria-label="Reload recommended movies"
            onClick={handleReload}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleReload();
            }}
          >
            <TfiReload aria-hidden="true" />
          </span>
        )}

        {/* Movie Card Grid */}
        <div
          id="recommendation"
          className="recommendation-card-container"
          role="list"
          aria-label="List of recommended movies"
        >
          {displayed.map((movie, index) =>
            movie ? (
              <MovieCard
                key={index}
                role="listitem"
                movie={{
                  ...movie,
                  genre: movie.genre.map((id) => genreMap[id]), // Convert genre IDs to names
                  year: movie.year.toString(), // Ensure year is string
                }}
                liked={likedMovies.includes(movie.id)}
                addedToWatchlist={addToWatchlistMovies.includes(movie.id)}
                onLike={() => toggleLike(movie.id)}
                onAddToWatchlist={() => toggleAddToWatchlist(movie.id)}
                
              >
                <div className="movie-rating">
                  <ReviewStars rating={movie.rating} />
                </div>
              </MovieCard>             
            ) : (
              <div key={index} className="movie-card-placeholder" />
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default RecommendationSection;