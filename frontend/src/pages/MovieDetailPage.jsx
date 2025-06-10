import { useState, useEffect, useRef } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { IoAdd } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import { GrFormPreviousLink, GrFormNextLink } from "react-icons/gr";
import MovieCardList from "../components/directory/MovieCardList";
import ReviewCard from "../components/directory/ReviewCard";
import UserReviewForm from "../components/directory/UserReviewForm";
import RatingBarChart from '../components/directory/RatingBarChart';
import "../styles/movieDetail.css";
import {
    fetchMovieById,
    fetchReviews,
    getCurrentUser,
    submitReview,
} from "../services/movieService";

const MovieDetailPage = () => {
    const { state } = useLocation();
    const { movieId } = useParams();
    const navigate = useNavigate();

    const [movie, setMovie] = useState(state?.movie || null);
    const [movieReviews, setMovieReviews] = useState([]);
    const [reviewUsers, setReviewUsers] = useState({});
    const [currentUser, setCurrentUser] = useState(null);
    const [userReview, setUserReview] = useState(null);

    const [currentPage, setCurrentPage] = useState(0);
    const reviewsPerPage = 4;

    const reviewFormRef = useRef(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Always fetch user
                const user = await getCurrentUser();
                setCurrentUser(user);

                // Always fetch movie from backend, not from state
                const movieData = await fetchMovieById(movieId);
                setMovie(movieData);

                const reviews = await fetchReviews(movieId);
                setMovieReviews(reviews);

                // Map review user info
                const userMap = {};
                reviews.forEach(r => {
                    if (r.user) {
                        userMap[r.user.id] = r.user;
                    }
                });
                setReviewUsers(userMap);

                const existing = reviews.find(r => r.userId === user.id);
                setUserReview(existing || null);

                setCurrentPage(0);

            } catch (err) {
                console.error("Error loading movie detail page", err);
            }
        };

        loadData();

        // Clean up: reset state to avoid flickering old data
        return () => {
            setMovie(null);
            setMovieReviews([]);
            setReviewUsers({});
            setUserReview(null);
            setCurrentPage(0);
        };

    }, [movieId]);

    const handleReviewSubmit = async (data) => {
        try {
            const response = await submitReview(movieId, data, Boolean(userReview));
            console.log("Review saved:", response);

            // Refresh reviews
            const updatedReviews = await fetchReviews(movieId);
            setMovieReviews(updatedReviews);

            const updatedReview = updatedReviews.find(r => r.userId === currentUser.id);
            setUserReview(updatedReview);
        } catch (err) {
            console.error("Failed to submit review", err);
        }
    };

    if (!movie) return <div>Movie not found</div>;

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
                        reviewCount: movieReviews.length,
                        likeCount: movie.likeCount,     
                        liked: movie.liked,             
                        watchlisted: movie.watchlisted
                    }}
                    showRatingNumber={true}
                    showBottomInteractiveIcon={true}
                    showCastInfo={true}
                    allReviews={movieReviews}
                />

                <div className="rating-container">
                    <div className="review-subheader">
                        <h3>Reviews</h3>
                        <button
                            className="review-button"
                            onClick={() => reviewFormRef.current?.scrollIntoView({ behavior: 'smooth' })}
                        ><IoAdd className="add-icon" />Add Your Review</button>
                    </div>
                    <RatingBarChart movieReviews={movieReviews} />
                    <div className="review-list">
                        {currentReviews.length > 0 ? (
                            currentReviews.map((review) => {
                                const user = review.user || reviewUsers[review.userId] || {};
                                return (
                                    <ReviewCard
                                        key={review.id}
                                        name={user.username || 'Anonymous'}
                                        date={new Date(review.createdAt).toLocaleDateString()}
                                        rating={review.rating}
                                        reviewText={review.review}
                                        profilePic={user.profilePic}
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
                        existingReview={userReview?.review || ""}
                        existingRating={userReview?.rating || 0}
                        onSubmit={handleReviewSubmit}
                    />
                </div>
            </div>
        </main>
    );
};

export default MovieDetailPage;