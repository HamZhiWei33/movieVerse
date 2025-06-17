import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import '../../styles/directory/RatingBarChart.css';
import useRatingStore from '../../store/useRatingStore';

const RatingBarChart = ({ movieId}) => {
    const { reviewsByMovie, getAverageRatingByMovieId } = useRatingStore();
    const movieReviews = reviewsByMovie[movieId] || [];
    const average = getAverageRatingByMovieId(movieId);

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

    const breakdown = calculateRatingBreakdown();
    const totalRatings = movieReviews.length;

    const formattedAverage = isNaN(Number(average)) ? 0 : Number(average).toFixed(1);

    return (
        <div className="rating-breakdown-container">
            <div className="average-score">{formattedAverage}</div>
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