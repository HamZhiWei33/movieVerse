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
import useRatingStore from "../store/useRatingStore";
import {
    fetchMovieById,
    getCurrentUser,
} from "../services/movieService";

const MovieDetailPage = () => {
    const { state } = useLocation();
    const { movieId } = useParams();
    const navigate = useNavigate();

    const [movie, setMovie] = useState(state?.movie || null);
    const [currentUser, setCurrentUser] = useState(null);

    const [currentPage, setCurrentPage] = useState(0);
    const reviewsPerPage = 4;

    const reviewFormRef = useRef(null);

    const {
        reviewsByMovie,
        userReview,
        user,
        fetchUserReview,
        fetchReviewsByMovie,
        addReview,
        updateReview,
        setUser,
        setMovieData,
    } = useRatingStore();

    const movieReviews = reviewsByMovie[movieId] || [];
    const existingReview = userReview[movieId] || null;

    useEffect(() => {
        const loadData = async () => {
            try {
                const userData = await getCurrentUser();
                setCurrentUser(userData);
                setUser(userData);

                const movieData = await fetchMovieById(movieId);
                setMovie(movieData);
                setMovieData(movieData);

                await fetchReviewsByMovie(movieId);
                await fetchUserReview(movieId);

                setCurrentPage(0);
            } catch (err) {
                console.error("Error loading movie detail page", err);
            }
        };

        loadData();

        return () => {
            setMovie(null);
            setCurrentPage(0);
        };
    }, [movieId]);

    const handleReviewSubmit = async (data) => {
        try {
            if (existingReview) {
                await updateReview(movieId, data);
            } else {
                await addReview(movieId, data);
            }

            const updatedMovie = await fetchMovieById(movieId);
            setMovie(updatedMovie);
            setMovieData(updatedMovie);

            await fetchReviewsByMovie(movieId);
            await fetchUserReview(movieId);
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
                    <RatingBarChart movieId={movieId} />
                    <div className="review-list">
                        {currentReviews.length > 0 ? (
                            currentReviews.map((review) => {
                                const user = review.user || {};
                                return (
                                    <ReviewCard
                                        key={review._id}
                                        name={review.userId?.name ?? "Anonymous"}
                                        date={new Date(review.createdAt).toLocaleDateString("en-GB")}
                                        rating={review.rating}
                                        reviewText={review.review}
                                        profilePic={review.userId?.profilePic}
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
                        key={`${movieId}-${existingReview?.updatedAt || existingReview?.createdAt || "new"}`}
                        movie={movie}
                        existingReview={existingReview?.review || ""}
                        existingRating={existingReview?.rating || 0}
                        onSubmit={handleReviewSubmit}
                    />
                </div>
            </div>
        </main>
    );
};

export default MovieDetailPage;