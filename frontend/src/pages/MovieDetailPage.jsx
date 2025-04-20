import { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { IoAdd } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import { GrFormPreviousLink, GrFormNextLink } from "react-icons/gr";
import MovieCardList from "../components/directory/MovieCardList";
import ReviewCard from "../components/directory/ReviewCard";
import UserReviewForm from "../components/directory/UserReviewForm";
import "../styles/movieDetail.css";
import RatingBarChart from '../components/directory/RatingBarChart';

const reviews = [
    {
        name: "MovieBuff42",
        date: "15-10-2023",
        rating: 5,
        reviewText: "This film exceeded all my expectations! The cinematography was breathtaking and the performances were Oscar-worthy."
    },
    {
        name: "CinemaLover",
        date: "28-09-2023",
        rating: 4,
        reviewText: "Great character development throughout the movie. The second act was particularly strong, though the ending felt slightly rushed."
    },
    {
        name: "FilmCritic101",
        date: "10-08-2023",
        rating: 3.5,
        reviewText: "Solid performances all around, but the plot had some predictable moments. Still worth watching for the lead actor's amazing portrayal."
    },
    {
        name: "ScreenQueen",
        date: "02-11-2023",
        rating: 4.5,
        reviewText: "The director's vision shines through in every frame. One of those rare films that stays with you long after the credits roll."
    },
    {
        name: "PopcornFanatic",
        date: "22-07-2023",
        rating: 2,
        reviewText: "The trailer promised much more than the movie delivered. Some good visual effects but the story lacked depth."
    }
];

const MovieDetailPage = () => {
    const { state } = useLocation();
    const { movieTitle } = useParams();
    const navigate = useNavigate();

    const movie = state?.movieData || movies.find(m =>
        m.title === decodeURIComponent(movieTitle)
    );

    const [liked, setLiked] = useState(false);
    const [watchlisted, setWatchlisted] = useState(false);

    const [currentPage, setCurrentPage] = useState(0);
    const reviewsPerPage = 4;
    const totalPages = Math.ceil(reviews.length / reviewsPerPage);
    const start = currentPage * reviewsPerPage;
    const currentReviews = reviews.slice(start, start + reviewsPerPage);

    if (!movie) return <div>Movie not found</div>;

    return (
        <main className="movie-detail-page">
            <div className="back-button-container">
                <button onClick={() => navigate(-1)} className="back-button">
                    <IoIosArrowBack className="back-icon"/>Back
                </button>
            </div>

            <div className="detail-content-container">
                <MovieCardList
                    movie={movie}
                    liked={liked}
                    addedToWatchlist={watchlisted}
                    onLike={() => setLiked(prev => !prev)}
                    onAddToWatchlist={() => setWatchlisted(prev => !prev)}
                    showRatingNumber={true}
                    showBottomInteractiveIcon={true}
                />

                <div className="rating-container">
                    <div className="review-subheader">
                        <h3>Reviews</h3>
                        <button className="review-button"><IoAdd className="add-icon" />Add Your Review</button>
                    </div>
                    <RatingBarChart
                        average={4.5}
                        totalRatings={999}
                        breakdown={{
                            5: 500,
                            4: 300,
                            3: 120,
                            2: 50,
                            1: 29
                        }}
                    />
                    <div className="review-list">
                        {currentReviews.map((review, index) => (
                            <ReviewCard
                                key={index}
                                name={review.name}
                                date={review.date}
                                rating={review.rating}
                                reviewText={review.reviewText}
                            />
                        ))}
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
                <UserReviewForm
                    movie={movie}
                    existingReview={"I loved the visuals!"} // Load user's review if exists
                    existingRating={4.5}                   // Load user's rating if exists
                    onSubmit={(data) => {
                        console.log("Review submitted:", data);
                        // Handle saving to backend or state here
                    }}
                />
            </div>
        </main>
    );
};

export default MovieDetailPage;
