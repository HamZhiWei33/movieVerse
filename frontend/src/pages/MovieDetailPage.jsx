import { useState, useEffect, useRef } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { IoAdd } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import { GrFormPreviousLink, GrFormNextLink } from "react-icons/gr";
import MovieCardList from "../components/directory/MovieCardList";
import ReviewCard from "../components/directory/ReviewCard";
import UserReviewForm from "../components/directory/UserReviewForm";
import "../styles/movieDetail.css";
import RatingBarChart from '../components/directory/RatingBarChart';
import { movies, reviews, users, likes } from '../constant';

const MovieDetailPage = () => {
    const { state } = useLocation();
    const { movieTitle } = useParams();
    const navigate = useNavigate();

    const movie = state?.movieData || movies.find(m =>
        m.title === decodeURIComponent(movieTitle)
    );

    const [liked, setLiked] = useState(false);
    const [watchlisted, setWatchlisted] = useState(false);
    const [movieReviews, setMovieReviews] = useState([]);
    const [reviewUsers, setReviewUsers] = useState({});
    const [likeCount, setLikeCount] = useState(0);

    const [currentPage, setCurrentPage] = useState(0);
    const reviewsPerPage = 4;

    useEffect(() => {
        if (!movie) return;

        // Get reviews for this movie
        const movieReviews = reviews.filter(review => review.movieId === movie.id);
        setMovieReviews(movieReviews);

        // Get users who reviewed this movie
        const usersMap = {};
        movieReviews.forEach(review => {
            const user = users.find(u => u.id === review.userId);
            if (user) {
                usersMap[review.userId] = user;
            }
        });
        setReviewUsers(usersMap);

        // Get like count for this movie
        setLikeCount(movie.likes || 0);

        const currentUserId = "U1";
        const userLiked = likes.some(like => like.movieId === movie.id && like.userId === currentUserId);
        setLiked(userLiked);
    }, [movie]);

    if (!movie) return <div>Movie not found</div>;

    // Calculate rating breakdown for the chart
    const calculateRatingBreakdown = () => {
        const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        movieReviews.forEach(review => {
            const roundedRating = Math.round(review.rating);
            breakdown[roundedRating]++;
        });
        return breakdown;
    };

    // Calculate average rating
    const calculateAverageRating = () => {
        if (movieReviews.length === 0) return 0;
        const sum = movieReviews.reduce((acc, review) => acc + review.rating, 0);
        return (sum / movieReviews.length).toFixed(1);
    };

    const reviewFormRef = useRef(null);

    const totalPages = Math.ceil(movieReviews.length / reviewsPerPage);
    const start = currentPage * reviewsPerPage;
    const currentReviews = movieReviews.slice(start, start + reviewsPerPage);

    return (
        <main className="movie-detail-page">
            <div className="back-button-container">
                <button onClick={() => navigate(-1)} className="back-button">
                    <IoIosArrowBack className="back-icon" />Back
                </button>
            </div>

            <div className="detail-content-container">
                <MovieCardList
                    movie={{
                        ...movie,
                        rating: calculateAverageRating(),
                        reviewCount: movieReviews.length,
                        likes: likeCount
                    }}
                    liked={liked}
                    addedToWatchlist={watchlisted}
                    onLike={() => {
                        setLikeCount(prevCount => liked ? prevCount - 1 : prevCount + 1);
                        setLiked(prev => !prev);
                    }}                    
                    onAddToWatchlist={() => setWatchlisted(prev => !prev)}
                    showRatingNumber={true}
                    showBottomInteractiveIcon={true}
                    showCastInfo={true}
                />

                <div className="rating-container">
                    <div className="review-subheader">
                        <h3>Reviews</h3>
                        <button
                            className="review-button"
                            onClick={() => reviewFormRef.current?.scrollIntoView({ behavior: 'smooth' })}
                        ><IoAdd className="add-icon" />Add Your Review</button>
                    </div>
                    <RatingBarChart
                        average={parseFloat(calculateAverageRating())}
                        totalRatings={movieReviews.length}
                        breakdown={calculateRatingBreakdown()}
                    />
                    <div className="review-list">
                        {currentReviews.length > 0 ? (
                            currentReviews.map((review) => {
                                // Find the user who wrote this review
                                const user = users.find(u => u.id === review.userId);

                                return (
                                    <ReviewCard
                                        key={review.id}
                                        name={user?.username || 'Anonymous'}
                                        date={new Date(review.createdAt).toLocaleDateString()}
                                        rating={review.rating}
                                        reviewText={review.review}
                                        profilePic={user?.profilePic}
                                    />
                                );
                            })
                        ) : (
                            <div className="no-reviews-message">
                                No reviews yet. Be the first to review this movie!
                            </div>
                        )}
                    </div>
                    {(totalPages > 1) && (
                        <div className="review-pagination">
                            <button className="review-previous-next-icon"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                                disabled={currentPage === 0}
                            >
                                <GrFormPreviousLink />
                            </button>
                            <span>Page {currentPage + 1} of {totalPages}</span>
                            <button className="review-previous-next-icon"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
                                disabled={currentPage === totalPages - 1}
                            >
                                <GrFormNextLink />
                            </button>
                        </div>
                    )}
                </div>
                <div ref={reviewFormRef}>
                    <UserReviewForm
                        movie={movie}
                        existingReview={"I loved the visuals!"} // Load user's review if exists
                        existingRating={0} // Load user's rating if exists
                        onSubmit={(data) => {
                            console.log("Review submitted:", data);
                            // Save to backend here
                            // Refresh the reviews
                        }}
                    />
                </div>
            </div>
        </main>
    );
};

export default MovieDetailPage;