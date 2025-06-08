import React, { useEffect } from "react";
import "../../styles/profile/tab-review.css";
import useRatingStore from "../../store/useRatingStore"; // make sure the path is correct
import ReviewStars from "../directory/ReviewStars.jsx";

const TabReview = () => {
  const { userReviews, fetchUserReviews, isLoading, error } = useRatingStore();

  useEffect(() => {
    fetchUserReviews();
  }, []);

  if (!Array.isArray(userReviews) || userReviews.length === 0) {
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
