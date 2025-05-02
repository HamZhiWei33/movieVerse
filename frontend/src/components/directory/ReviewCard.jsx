import ReviewStars from "./ReviewStars";
import "../../styles/directory/ReviewCard.css";

const ReviewCard = ({ name, date, rating, reviewText, profilePic }) => {
  return (
    <div className="review-card">
      <div className="review-header">
        <div className="review-user">
          <img
            src={profilePic || "/profile/default_profile_pic.png"}  // Ensure this path is correct
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
        <ReviewStars rating={rating} readOnly={true} showNumber={true} />
      </div>
      <div className="review-text">{reviewText}</div>
    </div>
  );
};

export default ReviewCard;
