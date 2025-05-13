import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import '../../styles/directory/RatingBarChart.css';

const RatingBarChart = ({ movieReviews = [] }) => {
    // Defensive: always default to empty array

    const calculateRatingBreakdown = () => {
        const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        movieReviews.forEach(review => {
            const roundedRating = Math.round(review.rating);
            if (breakdown[roundedRating] !== undefined) {
                breakdown[roundedRating]++;
            }
        });
        return breakdown;
    };

    const calculateAverageRating = () => {
        if (!Array.isArray(movieReviews) || movieReviews.length === 0) return 0;
        const sum = movieReviews.reduce((acc, review) => acc + review.rating, 0);
        return sum / movieReviews.length;
    };

    const breakdown = calculateRatingBreakdown();
    const average = calculateAverageRating();
    const totalRatings = movieReviews.length;

    return (
        <div className="rating-breakdown-container">
            <div className="average-score">{average === 0 ? "0" : average.toFixed(1)}</div>
            <div className="bar-section">
                {[5, 4, 3, 2, 1].map((star) => {
                    const percentage = totalRatings > 0 ? (breakdown[star] / totalRatings) : 0;

                    return (
                        <div key={star} className="bar-row">
                            <div className="stars-align-right">
                                <Rating
                                    value={star}
                                    max={star}
                                    precision={1}
                                    readOnly
                                    size="medium"
                                    icon={<StarIcon style={{ color: '#cff600' }} fontSize="inherit" />}
                                />
                            </div>
                            <progress value={percentage} max="1"></progress>
                        </div>
                    );
                })}
                <div className="total-ratings">{totalRatings} Ratings</div>
            </div>
        </div>
    );
};

export default RatingBarChart;