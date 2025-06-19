import React from "react";
import "../../styles/skeleton/topMovie.css";
const TopMovieSectionSkeleton = () => {
  return (
    <div className="blurred-banner-wrapper skeleton-wrapper">
      <div className="background-container skeleton-bg-container">
        <div className="background-blur skeleton-bg-blur" />
        <div className="dark-overlay skeleton-dark-overlay" />
      </div>

      <section className="top-section skeleton-top-section">
        {/* Top 3 ranking cards skeleton */}
        <section className="ranking-three-columns skeleton-ranking-cols">
          {[1, 2, 3].map((item, idx) => (
            <div
              key={idx}
              className={`card skeleton-card ${
                idx === 1
                  ? "main-card active skeleton-main-card"
                  : "side-card skeleton-side-card"
              }`}
            >
              <h2 className="rank-label skeleton-rank-label"></h2>
              <div className="image-container skeleton-img-container">
                <div className="skeleton-img"></div>
              </div>
            </div>
          ))}
        </section>

        {/* Movie details section skeleton */}
        <section className="movie-details-two-column skeleton-details-cols">
          <div className="left-column skeleton-left-col">
            <h3 className="skeleton-title"></h3>
            <div className="rating-bar skeleton-rating-bar">
              <div className="skeleton-stars"></div>
            </div>
            <div className="tags skeleton-tags">
              <span className="badge skeleton-badge"></span>
              <span className="badge skeleton-badge"></span>
              <span className="badge skeleton-badge"></span>
            </div>
            <div className="duration-like skeleton-duration">
              <span className="badge-duration skeleton-duration-badge">
                <span className="badge-duration-icon skeleton-duration-icon"></span>
                <span className="skeleton-duration-text"></span>
              </span>
            </div>
            <div className="action-buttons skeleton-actions">
              <div className="watch-trailer skeleton-trailer-btn"></div>
              <div className="skeleton-icon-btn"></div>
              <div className="skeleton-icon-btn"></div>
            </div>
          </div>
          <div className="right-column skeleton-right-col">
            <p className="skeleton-text"></p>
            <p className="skeleton-text"></p>
            <p className="skeleton-text"></p>
          </div>
        </section>

        {/* Rating chart section skeleton */}
        <section className="rating-visual-summary skeleton-chart-section">
          <div className="skeleton-chart"></div>
        </section>
      </section>
    </div>
  );
};

export default TopMovieSectionSkeleton;
