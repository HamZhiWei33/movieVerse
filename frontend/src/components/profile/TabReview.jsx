import "../../styles/profile/tab-review.css";
import React, { useEffect } from "react";
import ReviewStars from "../directory/ReviewStars.jsx";
import useRatingStore from "../../store/useRatingStore";

const TabReview = () => {
  const { userReviews, fetchUserReviews } = useRatingStore();

  useEffect(() => {
    fetchUserReviews();
  }, []);

  if (!Array.isArray(userReviews) || userReviews.length === 0) {
    return (
      <section className="review-section" aria-label="profile-review">
        <div style={{ "marginTop": "2rem" }} className="no-movies-message">
          <span>No reviews available</span>
        </div>
      </section>
    );
  }

  return (
    <section
      className="review-section"
      role="region"
      aria-label="profile-review"
      aria-live="polite"
    >
      <ul className="review-container" aria-label="review-lists">
        {userReviews.map((review, index) => (
          <React.Fragment key={review._id || index}>
            <li className="review-item" aria-labelledby={`title-${index}`}>
              <h3 className="review-title" id={`title-${index}`}>
                {review.movieId?.title || "Unknown Movie"}
              </h3>
              <div
                className="review-rate"
                aria-label={`Rating: ${review.rating} out of 5`}
              >
                <span aria-hidden="true">
                  <ReviewStars rating={review.rating} showNumber={true} />
                </span>
              </div>
              <p className="review-content">{review.review}</p>
            </li>

            {index < userReviews.length - 1 && (
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
