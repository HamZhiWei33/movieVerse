import { useState, useEffect, useRef, useMemo } from 'react';
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
import useMovieStore from "../store/useMovieStore";

const MovieDetailPage = () => {
    const {
        fetchMovieById,
        getCurrentUser,
        isLiked,
        toggleLike,
        fetchFilterOptions // Add this to your useMovieStore imports
    } = useMovieStore();
    const { state } = useLocation();
    const { movieId } = useParams();
    const navigate = useNavigate();

    const [movie, setMovie] = useState(state?.movie || null);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(!state?.movie);
    const [error, setError] = useState(null);
    const [genres, setGenres] = useState([]); // This will store all available genres

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

    // Create genre map from all available genres
    const genreMap = useMemo(() => {
        return genres.reduce((map, genre) => {
            map[genre.id] = genre.name;
            return map;
        }, {});
    }, [genres]);

    // Get genre names for the current movie
    const movieGenreNames = useMemo(() => {
        if (!movie?.genre) return [];

        return Array.isArray(movie.genre) ? movie.genre : [];
    }, [movie]);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                // Fetch all available genres first
                const filterOptions = await fetchFilterOptions();
                console.log("Fetched genres:", filterOptions.genres);
                setGenres(filterOptions.genres || []);

                const userData = await getCurrentUser();
                setCurrentUser(userData);
                setUser(userData);

                if (!movie) {
                    const movieData = await fetchMovieById(movieId);
                    console.log("Fetched movie:", movieData); // Add this
                    console.log("Movie genres:", movieData.genre); // Add this
                    setMovie(movieData);
                    setMovieData(movieData);
                } else {
                    setMovieData(movie);
                }

                await fetchReviewsByMovie(movieId);
                await fetchUserReview(movieId);
                setCurrentPage(0);
                setLoading(false);
            } catch (err) {
                console.error("Error loading movie detail page", err);
                setError("Failed to load movie details.");
                setLoading(false);
            }
        };

        loadData();

        return () => {
            setCurrentPage(0);
        };
    }, [movieId]);

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

            const updatedMovie = await fetchMovieById(movieId);
            setMovie(updatedMovie);
            setMovieData(updatedMovie);

            await fetchReviewsByMovie(movieId);
            await fetchUserReview(movieId);
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
                    // movie={{
                    //     ...movie,
                    //     reviewCount: movieReviews.length,
                    //     likeCount: movie.likeCount,
                    //     liked: movie.liked,
                    //     watchlisted: movie.watchlisted
                    // }}
                    key={movie._id}
                    movie={movie}
                    genres={movieGenreNames}
                    liked={isLiked(movie._id)}
                    likeCount={movie.likeCount}
                    onLike={() => toggleLike(movie._id)}
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
                            onClick={() =>
                                reviewFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                            }
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