import "../styles/movieDetail.css";
import { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { IoAdd } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import { GrFormPreviousLink, GrFormNextLink } from "react-icons/gr";
import MovieCardList from "../components/directory/MovieCardList";
import RatingBarChart from '../components/directory/RatingBarChart';
import ReviewCard from "../components/directory/ReviewCard";
import UserReviewForm from "../components/directory/UserReviewForm";
import useRatingStore from "../store/useRatingStore";
import useMovieStore from "../store/useMovieStore";

const MovieDetailPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { fetchMovieById } = useMovieStore();
    const { movieId } = useParams();

    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(0);
    const reviewsPerPage = 4;

    const reviewFormRef = useRef(null);

    const {
        reviewsByMovie,
        userReview,
        fetchUserReview,
        fetchReviewsByMovie,
        addReview,
        updateReview
    } = useRatingStore();

    const movieReviews = reviewsByMovie[movieId] || [];
    const existingReview = userReview[movieId] || null;

    // Get genre names for the current movie
    const movieGenreNames = useMemo(() => {
        if (!movie?.genre) return [];
        return Array.isArray(movie.genre) ? movie.genre : [];
    }, [movie]);

    useEffect(() => {
        console.log("test");
        const loadData = async () => {
            try {
                setLoading(true);

                // Always fetch the movie details for the initial load
                const movieData = await fetchMovieById(movieId);
                setMovie(movieData);

                await fetchReviewsByMovie(movieId);
                await fetchUserReview(movieId);
                setCurrentPage(0);
            } catch (err) {
                console.error("Error loading movie detail page", err);
                setError("Failed to load movie details.");
            } finally {
                setLoading(false);
            }
        };

        loadData();

        return () => {
            setCurrentPage(0);
        };
    }, [location]);


    const handleBack = () => {
        navigate(-1, { state: { scrollPosition: window.scrollY } });
    };

    const handleReviewSubmit = async (data) => {
        try {
            if (existingReview) {
                await updateReview(movieId, data);
            } else {
                await addReview(movieId, data);
            }

            // After review submission, only refresh reviews and user review state.
            // RatingBarChart will handle its own movie data refresh.
            await Promise.all([
                fetchReviewsByMovie(movieId),
                fetchUserReview(movieId),
            ]);

            const updatedMovie = await fetchMovieById(movieId);
            setMovie(updatedMovie);
            // setMovieData(updatedMovie);

            // Reset to first page to ensure newest review is visible
            setCurrentPage(0);

            // Scroll to rating bar chart section
            setTimeout(() => {
                const ratingSection = document.querySelector('.rating-container');
                if (ratingSection) {
                    ratingSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }, 100);
        } catch (err) {
            console.error("Failed to submit review", err);
        }
    };

    if (loading) {
        return <div className="loading">Loading movie details...</div>;
    }

    if (error || !movie) {
        return <div className="error">{error || "Movie not found."}</div>;
    }

    const totalPages = Math.ceil(movieReviews.length / reviewsPerPage);
    const start = currentPage * reviewsPerPage;
    const currentReviews = movieReviews.slice(start, start + reviewsPerPage);

    return (
        <main className="movie-detail-page">
            <div className="back-button-container">
                <button onClick={handleBack} className="back-button">
                    <IoIosArrowBack className="back-icon" />Back
                </button>
            </div>

            <div className="detail-content-container">
                <MovieCardList
                    key={`movie-card-${movie?._id}-${movie?.rating}`}
                    movie={movie}
                    genres={movieGenreNames}
                    showRatingNumber={true}
                    showBottomInteractiveIcon={true}
                    showCastInfo={true}
                />

                <div className="rating-container">
                    <div className="review-subheader">
                        <h3>Reviews</h3>
                        <button
                            className="review-button"
                            onClick={() =>
                                reviewFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                            }
                        ><IoAdd className="add-icon" />Add Your Review</button>
                    </div>
                    {/* RatingBarChart now handles its own movie data fetching for ratings */}
                    <RatingBarChart movieId={movieId} />
                    <div className="review-list">
                        {currentReviews.length > 0 ? (
                            currentReviews.map((review) => {
                                return (
                                    <ReviewCard
                                        key={review._id}
                                        id={`review-${review._id}`}
                                        review={review}
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