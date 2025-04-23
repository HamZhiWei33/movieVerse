import React from "react";
import "../../styles/profile/tab-review.css";
import { getMovieNameById } from "./review.js";
import ReviewStars from "../directory/ReviewStars.jsx";
const TabReview = ({ reviews = [] }) => {
  if (!reviews || reviews.length === 0 || !Array.isArray(reviews)) {
    return (
      <section className="review-section" aria-label="profile-review">
        <p className="no-reviews">No reviews available</p>
      </section>
    );
  }
  return (
    <section
      className="review-section"
      role="region"
      aria-label="profile-review"
      aria-live="polite" // For screen readers to announce changes
    >
      <ul className="review-container" aria-label="review-lists">
        {reviews.map((review, index) => (
          <React.Fragment key={index}>
            <li className="review-item" aria-labelledby={review.title}>
              <h3 className="review-title" id={review.title}>
                {getMovieNameById(review.movieId)}
              </h3>
              <div
                className="review-rate"
                aria-label={`Rating: ${review.rating} out of 5`}
              >
                <span aria-hidden="true">
                  <ReviewStars rating={review.rating} showNumber="false" />
                </span>
              </div>
              <p className="review-content">{review.review}</p>
            </li>
            {/* Only render line if not the last item */}
            {index < reviews.length - 1 && (
              <div
                key={`divider-${index}`}
                className="review-divider"
                role="separator"
                aria-orientation="vertical"
              ></div>
            )}
          </React.Fragment>
        ))}
      </ul>
    </section>
  );
};

export default TabReview;
