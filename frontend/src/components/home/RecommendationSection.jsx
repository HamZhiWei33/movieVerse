import React, { useState, useEffect } from "react";
import MovieCard from "../directory/MovieCard";
import "../../styles/home/recommendation-section.css";
import { TfiReload } from "react-icons/tfi";

const RecommendationSection = ({ title, moviesType, items }) => {
  const [displayed, setDisplayed] = useState([]);

  const handleReload = () => {
    const shuffled = [...items].sort(() => 0.5 - Math.random());
    setDisplayed(shuffled.slice(0, 10));
  };

  useEffect(() => {
    if (moviesType === "recommendation") {
      handleReload();
    }
  }, [items]);

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
              <MovieCard key={index} movie={movie} role="listitem" />
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