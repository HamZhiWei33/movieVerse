import React from "react";
import "../../styles/profile/tab-review.css";

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
          <React.Fragment key={review.title}>
            <li className="review-item" aria-labelledby={review.title}>
              <h3 className="review-title" id={review.title}>
                {review.title}
              </h3>
              <p
                className="review-rate"
                aria-label={`Rating: ${review.rate} out of 5`}
              >
                <span aria-hidden="true">Rating: {review.rate}</span>
              </p>
              <p className="review-content">{review.review}</p>
            </li>
            {/* Only render line if not the last item */}
            {index < reviews.length - 1 && (
              <div
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
