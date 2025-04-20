import { useState, useEffect } from "react";
import ReviewStars from "./ReviewStars";
import "../../styles/directory/UserReviewForm.css";

const UserReviewForm = ({
  movie,
  existingReview = "",
  existingRating = 0,
  onSubmit,
}) => {
  const [reviewText, setReviewText] = useState(existingReview);
  const [rating, setRating] = useState(existingRating);
  const [isModified, setIsModified] = useState(false);
  const [textColor, setTextColor] = useState(
    existingReview ? "#999999" : "#ffffff"
  );

  useEffect(() => {
    setReviewText(existingReview);
    setRating(existingRating);
    setIsModified(false);
    setTextColor(existingReview ? "#999999" : "#ffffff");
  }, [existingReview, existingRating]);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setReviewText(newText);
    const modified = newText !== existingReview || rating !== existingRating;
    setIsModified(modified);
    setTextColor(modified ? "#ffffff" : "#999999");
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    const modified =
      newRating !== existingRating || reviewText !== existingReview;
    setIsModified(modified);
    setTextColor(modified ? "#ffffff" : "#999999");
  };

  const handlePost = () => {
    if (isModified && reviewText.trim()) {
      onSubmit({ movieId: movie.id, reviewText, rating });
      // Don't reset modified state here - let parent handle the state update
    }
  };

  return (
    <div className="user-review-form">
      <div className="user-review-header">
        <h3>{existingReview ? "Edit Your Review" : "Write Your Review"}</h3>
        <p>about {movie.title}</p>
      </div>
      <div className="user-review-body">
        <div className="user-review-rating">
          <img
            src="/profile/default_profile_pic.png"
            alt="User Avatar"
            className="user-review-avatar"
          />
          <ReviewStars
            rating={rating}
            readOnly={false}
            showNumber={true}
            onChange={(e, newValue) => handleRatingChange(newValue)}
          />
        </div>
        <textarea
          value={reviewText}
          onChange={handleTextChange}
          placeholder="Write your review here..."
          className="user-review-textarea"
          style={{ color: textColor }}
        />
        <button
          onClick={handlePost}
          className="post-review-button"
          disabled={!isModified || reviewText.trim() === ""}
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default UserReviewForm;
