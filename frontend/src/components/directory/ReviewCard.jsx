import "../../styles/directory/ReviewCard.css";
import ReviewStars from "./ReviewStars";

const ReviewCard = ({ review }) => {
  const name = review.userId?.name ?? "Anonymous";
  const date = new Date(review.updatedAt || review.createdAt).toLocaleDateString("en-GB");
  return (
    <div className="review-card">
      <div className="review-header">
        <div className="review-user">
          <img
            src={review.userId?.profilePic || "/profile/default_profile_pic.png"}  // Ensure this path is correct
            alt={`${name}'s profile picture`}
            className="user-profile-pic"
            onError={(e) => {
              e.target.src = "/profile/default_profile_pic.png"; // Double fallback
            }}
          />
          <div className="user-info">
            <div className="user-name">{name}</div>
            <div className="review-date">{date}</div>
          </div>
        </div>
        <ReviewStars rating={review.rating} readOnly={true} showNumber={true} />
      </div>
      <div className="review-text">{review.review}</div>
    </div>
  );
};

export default ReviewCard;
