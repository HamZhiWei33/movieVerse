import ReviewStars from "./ReviewStars";
import '../../styles/directory/ReviewCard.css';

const ReviewCard = ({ name, date, rating, reviewText, avatar }) => {
    return (
        <div className="review-card">
            <div className="review-header">
                <div className="review-user">
                    <img
                        src={avatar || "/movieVerse/profile/default_profile_pic.png"}
                        alt={`${name}'s avatar`}
                        className="user-avatar"
                    />
                    <div className="user-info">
                        <div className="user-name">{name}</div>
                        <div className="review-date">{date}</div>
                    </div>
                </div>
                <ReviewStars
                    rating={rating}
                    readOnly={true}
                    showNumber={true}
                />
            </div>
            <div className="review-text">
                {reviewText}
            </div>
        </div>
    );
};

export default ReviewCard;
