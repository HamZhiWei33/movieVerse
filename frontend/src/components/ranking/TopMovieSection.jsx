import React, { useEffect, useMemo, useState } from "react";
import ReviewStars from "../directory/ReviewStars";
import { IoTime } from "react-icons/io5";
import RatingBarChart from '../directory/RatingBarChart';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import usePreviousScrollStore from "../../store/usePreviousScrollStore";
import useRatingStore from '../../store/useRatingStore';
import LikeIcon from "../directory/LikeIcon";
import AddToWatchlistIcon from "../directory/AddToWatchlistIcon";
import useRankingStore from "../../store/useRankingStore";

const TopMovieSection = ({ selectedMovie, setSelectedMovie, ratingDistribution, allReviews }) => {
  const {
    isInWatchlist,
    likeMovie,
    unlikeMovie,
    fetchWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    hasUserLikedMovie, // NEW
  } = useRankingStore();

  const navigate = useNavigate();
  const { setPreviousScrollPosition } = usePreviousScrollStore();
  const { fetchReviewsByMovie, setMovieData } = useRatingStore();

  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingWatchlist, setLoadingWatchlist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [liked, setLiked] = useState(false); // now local state

  useEffect(() => {
    if (selectedMovie?._id) {
      console.log("[🟡 useEffect] selectedMovie._id:", selectedMovie._id);

      hasUserLikedMovie(selectedMovie._id).then((result) => {
        console.log("[✅ hasUserLikedMovie]", result);
        setLiked(result);
      });

      fetchWatchlist();
      setMovieData(selectedMovie); 
      fetchReviewsByMovie(selectedMovie._id);
    }
  }, [selectedMovie]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5001/api/rankings');
        setMovies(response.data.movies || []);
        setGenres(response.data.genres || []);
      } catch (err) {
        setError("Failed to load data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const [first, second, third] = useMemo(() => {
    if (!Array.isArray(movies) || movies.length === 0) return [null, null, null];

    return [...movies]
      .map((movie) => ({
        ...movie,
        rating: Number(movie.rating).toFixed(1),
        compositeScore: movie.rating * 0.9 + ((movie.year || 2000) - 2000) * 0.1,
      }))
      .sort((a, b) => b.compositeScore - a.compositeScore)
      .slice(0, 3);
  }, [movies]);

  const top3 = useMemo(() => [second, first, third].filter(Boolean), [first, second, third]);

  const genreNames = useMemo(() => {
    if (!selectedMovie?.genre || !Array.isArray(genres)) return "";
    return selectedMovie.genre
      .map((id) => genres.find((g) => g.id === id)?.name)
      .filter(Boolean)
      .join(", ");
  }, [selectedMovie, genres]);

  const handleCardClick = (movieId) => {
    setPreviousScrollPosition(window.scrollY);
    navigate(`/movie/${movieId}`);
  };

  const handleLikeClick = async () => {
    if (!selectedMovie?._id) return;
    setLoadingLike(true);
    try {
      if (liked) {
        await unlikeMovie(selectedMovie._id);
      } else {
        await likeMovie(selectedMovie._id);
      }
      const updated = await hasUserLikedMovie(selectedMovie._id);
      setLiked(updated);
    } catch (error) {
      console.error("Like error:", error);
    } finally {
      setLoadingLike(false);
    }
  };

  const handleAddToWatchlistClick = async () => {
    if (!selectedMovie?._id) return;
    setLoadingWatchlist(true);
    try {
      isInWatchlist(selectedMovie._id)
        ? await removeFromWatchlist(selectedMovie._id)
        : await addToWatchlist(selectedMovie._id);
    } catch (error) {
      console.error("Watchlist error:", error);
    } finally {
      setLoadingWatchlist(false);
    }
  };

  if (loading) return <div className="loading">Loading movies...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!selectedMovie || top3.length === 0) return <div className="no-movies">No movies available</div>;

  return (
    <div className="blurred-banner-wrapper">
      <div className="background-container">
        <div
          className="background-blur"
          style={{
            backgroundImage: `url(${selectedMovie?.posterUrl || top3[0]?.posterUrl})`,
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
                className={`card ${isActive ? "main-card active" : "side-card"}`}
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
                rating={Number(selectedMovie.rating).toFixed(1)}
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
              <div className="iteractive-icon" onClick={handleLikeClick}>
                <LikeIcon
                  liked={liked}
                  disabled={loadingLike}
                />
              </div>
              <div className="iteractive-icon" onClick={handleAddToWatchlistClick}>
                <AddToWatchlistIcon
                  addedToWatchlist={isInWatchlist(selectedMovie._id)}
                  disabled={loadingWatchlist}
                />
              </div>
            </div>
          </div>
          <div className="right-column">
            <p>{selectedMovie.description}</p>
          </div>
        </section>
        <section className="rating-visual-summary">
          <RatingBarChart
            movieId={selectedMovie?._id}
            key={selectedMovie?._id}
          />
        </section>
      </section>
    </div>
  );
};

export default TopMovieSection;
