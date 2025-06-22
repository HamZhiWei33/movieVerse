import '../../styles/directory/RatingBarChart.css';
import { useMemo, useEffect, useState } from "react";
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import useRatingStore from '../../store/useRatingStore';
import useMovieStore from '../../store/useMovieStore';

// For MovieDetailPage, we mainly rely on data from stores.
// For TopMovieSection, we pass initialMovieData/initialReviews to avoid extra fetches.
const RatingBarChart = ({ movieId, initialMovieData, initialReviews }) => {
    const { reviewsByMovie, fetchReviewsByMovie } = useRatingStore();
    const { fetchMovieById } = useMovieStore();

    // Use a single state for movie data, and another for reviews data,
    // which will be updated by fetches OR by prop changes if provided.
    const [localMovieData, setLocalMovieData] = useState(initialMovieData);
    const [localReviews, setLocalReviews] = useState(initialReviews);

    // This useEffect handles fetching and updating local state when movieId changes
    // or when the component is first mounted without initial props.
    useEffect(() => {
        const loadData = async () => {
            if (!movieId) return;

            let fetchedMovie = initialMovieData;
            let fetchedReviews = initialReviews;

            // If initial props are not provided, or are stale, fetch them.
            // Check if movieInternalData or initialMovieData match the current movieId
            if (!fetchedMovie || fetchedMovie._id !== movieId) {
                fetchedMovie = await fetchMovieById(movieId);
            }

            if (!fetchedReviews || reviewsByMovie[movieId]?.length !== fetchedReviews.length) {
                await fetchReviewsByMovie(movieId);
                fetchedReviews = reviewsByMovie[movieId];
            }

            setLocalMovieData(fetchedMovie);
            setLocalReviews(fetchedReviews);
        };

        loadData();
    }, [movieId, initialMovieData, initialReviews, fetchMovieById, fetchReviewsByMovie, reviewsByMovie]);

    const currentMovie = initialMovieData || localMovieData;
    const currentReviews = initialReviews || reviewsByMovie[movieId] || localReviews; // Prefer store's latest reviews

    const average = currentMovie?.rating || 0;
    const totalRatings = currentReviews?.length || 0;

    const formattedAverage = totalRatings === 0
        ? '0'
        : Number(average).toFixed(1);

    const breakdown = useMemo(() => {
        const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        currentReviews.forEach(review => {
            const roundedRating = Math.round(review.rating);
            if (breakdown[roundedRating] !== undefined) {
                breakdown[roundedRating]++;
            }
        });
        return breakdown;
    }, [currentReviews]);

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