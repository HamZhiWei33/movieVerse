import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import '../../styles/directory/RatingBarChart.css';
import useMovieStore from "../../store/useMovieStore";
import useRatingStore from '../../store/useRatingStore';
import { useEffect, useState, useMemo } from "react";


const RatingBarChart = ({ movieId }) => {
    const {
        fetchMovieById,
        getCurrentUser,
        isLiked,
        toggleLike,
        fetchFilterOptions // Add this to your useMovieStore imports
    } = useMovieStore();
    const { setMovieData, reviewsByMovie, fetchReviewsByMovie, getAverageRatingByMovieId } = useRatingStore();
    const movieReviews = reviewsByMovie[movieId] || [];
    const [average, setAverage] = useState(getAverageRatingByMovieId(movieId)||0);
    // const [movie, setMovie]

    // console.log(movieId);

    useEffect(() => {
        const loadData = async () => {
            try {
                const movieData = await fetchMovieById(movieId);
                // console.log("Fetched movie:", movieData); // Add this
                // console.log("Movie genres:", movieData.genre); // Add this
                setMovieData(movieData);
                setAverage(getAverageRatingByMovieId(movieId));
                await fetchReviewsByMovie(movieId);
            } catch (err) {
                console.error("Error fetching movie review", err);
            }
        };

        loadData();
    }, [movieId]);

    const breakdown = useMemo(() => {
        const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        movieReviews.forEach(review => {
            const roundedRating = Math.round(review.rating);
            if (breakdown[roundedRating] !== undefined) {
                breakdown[roundedRating]++;
            }
        });
        return breakdown;
    }, [reviewsByMovie]);

    const totalRatings = useMemo(() => {
        return movieReviews.length;
    }, [reviewsByMovie]);

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

    // const breakdown = calculateRatingBreakdown();
    // const totalRatings = movieReviews.length;

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