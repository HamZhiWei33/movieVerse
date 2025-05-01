import React from "react";
import MovieCard from "../directory/MovieCard";
import "../../styles/home/recommendation-section.css";
import "../../styles/home/ranking-card.css";
import { TfiReload } from "react-icons/tfi";
import { useRef } from "react";
const RecommendationSection = ({ title, moviesType, items }) => {
  const recommendationRef = useRef();
  return (
    <div className="recommendation-section">
      <div className="recommendation-section-container">
        <div className="recommendation-section">
          <h2 className="recommendation-title">
            {title}
            {moviesType === "recommendation" && (
              <span className="recommendation-icon reload-icon">
                <TfiReload />
              </span>
            )}
          </h2>
        </div>

        <div
          id="recommendation"
          ref={recommendationRef}
          className="recommendation-card-section"
        >
          {moviesType === "recommendation" && (
            <div
              id="recommendation-wrapper"
              className="recommendation-card-container"
            >
              {items.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendationSection;
