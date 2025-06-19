import React, { useEffect, useMemo, useState } from "react";
import ReviewStars from "../directory/ReviewStars";
import LikeIcon from "../directory/LikeIcon";
import { IoTime } from "react-icons/io5";
import AddToWatchlistIcon from "../directory/AddToWatchlistIcon";
import RatingBarChart from "../directory/RatingBarChart"; // Correct path
import axios from "axios";
import { useNavigate } from "react-router-dom";
import usePreviousScrollStore from "../../store/usePreviousScrollStore";
import useRatingStore from "../../store/useRatingStore"; // Import useRatingStore
import useHomeStore from "../../store/useHomeStore";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const TopMovieSection = ({ selectedMovie, setSelectedMovie }) => {
  const navigate = useNavigate();
  const { setPreviousScrollPosition } = usePreviousScrollStore();
  const [liked, setLiked] = useState(false); // Consider managing like status via useMovieStore
  const [loadingLike, setLoadingLike] = useState(false); // Consider managing like status via useMovieStore
  const [loadingWatchlist, setLoadingWatchlist] = useState(false); // Consider managing watchlist status via a store
  const [addedToWatchlist, setAddedToWatchlist] = useState(false); // Consider managing watchlist status via a store
  const [genres, setGenres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get reviewsByMovie from useRatingStore
  const { reviewsByMovie, fetchReviewsByMovie } = useRatingStore();

  const { setTop1Movie } = useHomeStore();
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
    setLiked(false);
    setAddedToWatchlist(false);
  }, [selectedMovie]);

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

  useEffect(() => {
    if (first) {
      setTop1Movie(first);
      console.log("Top 1 movie set:", first);
    }
  }, [first, setTop1Movie]);

  const handleCardClick = (movieId) => {
    setPreviousScrollPosition(window.scrollY);
    navigate(`/movie/${movieId}`);
  };

  if (loading)
    return (
      <div className="loading">
        <DotLottieReact
          src="https://lottie.host/6185175f-ee83-45a4-9244-03871961a1e9/yLmGLfSgYI.lottie"
          loop
          autoplay
          className="loading-icon"
        />
      </div>
    );
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
                {selectedMovie.duration}
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
              <LikeIcon movie={selectedMovie} disabled={loadingLike} />
              <AddToWatchlistIcon
                movie={selectedMovie}
                disabled={loadingWatchlist}
              />
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
