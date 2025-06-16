// components/TopMovieSection.jsx
import React, { useState, useEffect, useMemo } from "react";
import ReviewStars from "../directory/ReviewStars";
import LikeIcon from "../directory/LikeIcon";
import { IoTime } from "react-icons/io5";
import AddToWatchlistIcon from "../directory/AddToWatchlistIcon";
import RatingBarChart from '../directory/RatingBarChart';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import usePreviousScrollStore from "../../store/usePreviousScrollStore";

const TopMovieSection = ({ selectedMovie, setSelectedMovie, ratingDistribution, allReviews }) => {
  const navigate = useNavigate();
  const { setPreviousScrollPosition } = usePreviousScrollStore();
  const [liked, setLiked] = useState(false);
  const [addedToWatchlist, setAddedToWatchlist] = useState(false);
  const [genres, setGenres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLiked(false);
    setAddedToWatchlist(false);
  }, [selectedMovie]);

  // Fetch both movies and genres in one request
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5001/api/rankings');
        console.log('API Response:', response.data); // Debug log
        
        if (response.data) {
          setMovies(response.data.movies || []);
          setGenres(response.data.genres || []);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // compute top 3 for display with safety checks
  const [first, second, third] = useMemo(() => {
    if (!Array.isArray(movies) || movies.length === 0) return [null, null, null];

    return [...movies]
      .map((movie) => ({
        ...movie,
        rating: Number(movie.rating).toFixed(1),
        compositeScore: movie.rating * 0.9 + 
                       ((movie.year || 2000) - 2000) * 0.1,
      }))
      .sort((a, b) => {
        if (b.compositeScore === a.compositeScore) {
          return a._id?.localeCompare(b._id) || 0;
        }
        return b.compositeScore - a.compositeScore;
      })
      .slice(0, 3);
  }, [movies]);

  const top3 = useMemo(() => {
    return [second, first, third].filter(Boolean);
  }, [first, second, third]);

  const formatDuration = (minutes) => {
    if (!minutes || isNaN(minutes)) return "N/A";

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return hours > 0
      ? `${hours}h${mins > 0 ? ` ${mins}min` : ""}`.trim()
      : `${mins}min`;
  };

  // Updated genre name mapping
  const genreNames = useMemo(() => {
    if (!selectedMovie?.genre || !Array.isArray(genres)) {
      console.log('No genres or movie:', { movie: selectedMovie, genres });
      return "";
    }
    
    const names = selectedMovie.genre
      .map(genreId => {
        const genre = genres.find(g => g.id === genreId);
        if (!genre) console.log('Genre not found for ID:', genreId);
        return genre ? genre.name : '';
      })
      .filter(Boolean);

    console.log('Mapped genre names:', names);
    return names.join(", ");
  }, [selectedMovie, genres]);

  const handleCardClick = (movieId) => {
    setPreviousScrollPosition(window.scrollY);
    navigate(`/movie/${movieId}`);
  };

  if (loading) {
    return <div className="loading">Loading movies...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!selectedMovie || top3.length === 0) {
    return <div className="no-movies">No movies available</div>;
  }

  return (
    <div className="blurred-banner-wrapper">
      <div className="background-container">
        <div
          className="background-blur"
          style={{
            backgroundImage: `url(${selectedMovie ? selectedMovie.posterUrl : top3[0]?.posterUrl})`
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
                style={{ cursor: 'pointer' }}
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
              <ReviewStars rating={selectedMovie.rating} readOnly={true} showNumber={true} size="large" />
            </div>
            <div className="tags">
              <span className="badge">{genreNames}</span>
              <span className="badge">{selectedMovie.region}</span>
              <span className="badge">{selectedMovie.year}</span>
            </div>
            <div className="duration-like">
              <span className="badge-duration"><span className="badge-duration-icon">
                <IoTime />
              </span>{selectedMovie?.duration}</span>
            </div>
            <div className="action-buttons">
              <button 
                className="watch-trailer" 
                onClick={() => selectedMovie.trailerUrl ? window.open(selectedMovie.trailerUrl, "_blank") : null}
                disabled={!selectedMovie.trailerUrl}
              >
                ▶ Watch Trailer
              </button>
              <div className="iteractive-icon" onClick={() => setLiked(!liked)}>
                <LikeIcon liked={liked} />
              </div>
              <div className="iteractive-icon" onClick={() => setAddedToWatchlist(!addedToWatchlist)}>
                <AddToWatchlistIcon addedToWatchlist={addedToWatchlist} />
              </div>
            </div>
          </div>
          <div className="right-column">
            <p>{selectedMovie.description}</p>
          </div>
        </section>
        <section className="rating-visual-summary">
          <RatingBarChart movieId={selectedMovie?._id} />
        </section>

      </section>
    </div>
  );
};

export default TopMovieSection;
