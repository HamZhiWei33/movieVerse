import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import '../../styles/directory/RatingBarChart.css';
import useRatingStore from '../../store/useRatingStore';
import { useMemo } from "react";

const RatingBarChart = ({ movieId }) => {
    const { 
        reviewsByMovie, 
        moviesById
    } = useRatingStore();
    
    const movieReviews = reviewsByMovie[movieId] || [];
    const movie = moviesById[movieId];
    const totalRatings = movieReviews.length;
    
    const average = movie?.rating || 0;
    
    const formattedAverage = totalRatings === 0 
        ? '0' 
        : isNaN(Number(average)) 
            ? '0' 
            : Number(average).toFixed(1);

    const breakdown = useMemo(() => {
        const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        movieReviews.forEach(review => {
            const roundedRating = Math.round(review.rating);
            if (breakdown[roundedRating] !== undefined) {
                breakdown[roundedRating]++;
            }
        });
        return breakdown;
    }, [movieReviews]);

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