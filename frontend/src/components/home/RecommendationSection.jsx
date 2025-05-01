import React from "react";
import MovieCard from "../directory/MovieCard";
import "../../styles/home/recommendation-section.css";
import "../../styles/home/ranking-card.css";
import { TfiReload } from "react-icons/tfi";

const RecommendationSection = ({ title, moviesType, items }) => {
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

        <div className="recommendation-card-section">
          {moviesType === "recommendation" && (
            <div id="recommendation" className="recommendation-card-container">
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
