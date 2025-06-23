import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoTime } from "react-icons/io5";
import LikeIcon from "../directory/LikeIcon";
import AddToWatchlistIcon from "../directory/AddToWatchlistIcon";
import ReviewStars from "../directory/ReviewStars";
import RatingBarChart from "../directory/RatingBarChart";
import TopMovieSectionSkeleton from "../skeletons/TopMovieSectionSkeleton";
import usePreviousScrollStore from "../../store/usePreviousScrollStore";
import useRatingStore from "../../store/useRatingStore";

const TopMovieSection = ({ selectedMovie, setSelectedMovie }) => {
  const navigate = useNavigate();

  // Get reviewsByMovie from useRatingStore
  const { reviewsByMovie, fetchReviewsByMovie } = useRatingStore();
  const { setPreviousScrollPosition } = usePreviousScrollStore();

  const [genres, setGenres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch reviews for the selected movie when it changes
  useEffect(() => {
    if (selectedMovie?._id) {
      fetchReviewsByMovie(selectedMovie._id);
    }
  }, [selectedMovie, fetchReviewsByMovie]);

  const averageRating =
    selectedMovie.rating && selectedMovie.rating > 0
      ? Number(selectedMovie.rating.toFixed(1))
      : 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5001/api/rankings");
        if (response.data) {
          setMovies(response.data.movies || []);
          setGenres(response.data.genres || []);
        }
      } catch (err) {
        setError("Failed to load data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // compute top 3 for display with safety checks
  const [first, second, third] = useMemo(() => {
    if (!Array.isArray(movies) || movies.length === 0)
      return [null, null, null];

    return [...movies]
      .sort((a, b) => {
        const ratingDiff = (b.rating || 0) - (a.rating || 0);
        if (ratingDiff !== 0) return ratingDiff;
        return (b.year || 0) - (a.year || 0);
      })
      .slice(0, 3);
  }, [movies]);

  const top3 = useMemo(
    () => [second, first, third].filter(Boolean),
    [first, second, third]
  );

  const genreNames = useMemo(() => {
    if (!selectedMovie?.genre || !Array.isArray(genres)) {
      return "";
    }

    const names = selectedMovie.genre
      .map((genreId) => {
        const genre = genres.find((g) => g.id === genreId);
        return genre ? genre.name : "";
      })
      .filter(Boolean);

    return names.join(", ");
  }, [selectedMovie, genres]);

  const handleCardClick = (movieId) => {
    setPreviousScrollPosition(window.scrollY);
    navigate(`/movie/${movieId}`);
  };

  if (loading) return <TopMovieSectionSkeleton />;

  if (error) return <div className="error">{error}</div>;

  if (!selectedMovie || top3.length === 0)
    return <div className="no-movies">No movies available</div>;

  return (
    <div className="blurred-banner-wrapper">
      <div className="background-container">
        <div
          className="background-blur"
          style={{
            backgroundImage: `url(${
              selectedMovie?.posterUrl || top3[0]?.posterUrl
            })`,
          }}
        />
        <div className="dark-overlay" />
      </div>

      <section className="top-section">
        <section className="ranking-three-columns">
          {top3.map((movie, idx) => {
            if (!movie) return null;
            const label = idx === 0 ? "Top 2" : idx === 1 ? "Top 1" : "Top 3";
            const isActive = movie._id === selectedMovie._id;

            return (
              <div
                key={movie._id}
                className={`card ${
                  isActive ? "main-card active" : "side-card"
                }`}
                onClick={() => handleCardClick(movie._id)}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setSelectedMovie(movie)}
              >
                <h2 className="rank-label">{label}</h2>
                <div className="image-container">
                  <img src={movie.posterUrl} alt={movie.title} />
                </div>
              </div>
            );
          })}
        </section>

        <section className="movie-details-two-column">
          <div className="left-column">
            <h3>{selectedMovie.title}</h3>
            <div className="rating-bar">
              <ReviewStars
                rating={averageRating}
                readOnly={true}
                showNumber={true}
                size="large"
              />
            </div>
            <div className="tags">
              <span className="badge">{genreNames}</span>
              <span className="badge">{selectedMovie.region}</span>
              <span className="badge">{selectedMovie.year}</span>
            </div>
            <div className="duration-like">
              <span className="badge-duration">
                <span className="badge-duration-icon">
                  <IoTime />
                </span>
                {selectedMovie.duration === "0h 0min"
                  ? "To Be Announced"
                  : selectedMovie.duration}
              </span>
            </div>
            <div className="action-buttons">
              <button
                className="watch-trailer"
                onClick={() =>
                  selectedMovie.trailerUrl
                    ? window.open(selectedMovie.trailerUrl, "_blank")
                    : null
                }
                disabled={!selectedMovie.trailerUrl}
              >
                ▶ Watch Trailer
              </button>
              <LikeIcon movie={selectedMovie} />
              <AddToWatchlistIcon movie={selectedMovie} />
            </div>
          </div>
          <div className="right-column">
            <p>{selectedMovie.description}</p>
          </div>
        </section>
        <section className="rating-visual-summary">
          <RatingBarChart
            movieId={selectedMovie?._id}
            initialMovieData={selectedMovie} // Pass the selectedMovie directly
            initialReviews={reviewsByMovie[selectedMovie?._id]} // Pass the reviews directly
          />
        </section>
      </section>
    </div>
  );
};
export default TopMovieSection;
