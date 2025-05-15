import React, { useRef, useState, useEffect, useMemo } from "react";
import MovieCard from "../directory/MovieCard";
import "../../styles/home/recommendation-section.css";
import { TfiReload } from "react-icons/tfi";
import { reviews, genres } from "../../constant";
import ReviewStars from "../directory/ReviewStars";

const RecommendationSection = ({ title, moviesType, items }) => {
  const [displayed, setDisplayed] = useState([]);
  const [likedMovies, setLikedMovies] = useState([]);
  const [addToWatchlistMovies, setAddToWatchlistMovies] = useState([]);
  const [movieCards, setMovieCards] = useState([]);
  const gridRef = useRef(null);

  // Genre map creation using useMemo
  const genreMap = useMemo(() => {
    return genres.reduce((map, genre) => {
      map[genre.id] = genre.name;
      return map;
    }, {});
  }, []);

  const handleReload = () => {
    const shuffled = [...items].sort(() => 0.5 - Math.random());
    setDisplayed(shuffled);
    sessionStorage.setItem("displayedMovies", JSON.stringify(shuffled));
  };

  useEffect(() => {
    const saved = sessionStorage.getItem("displayedMovies");
    if (saved) {
      setDisplayed(JSON.parse(saved));
    } else if (moviesType === "recommendation") {
      handleReload(); // fallback if no saved data
    }
  }, [items, moviesType]);

  const toggleLike = (id) => {
    setLikedMovies((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const toggleAddToWatchlist = (id) => {
    setAddToWatchlistMovies((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const calculateAverageRating = (movieId) => {
    const movieReviews = reviews.filter((review) => review.movieId === movieId);
    if (movieReviews.length === 0) return 0;
    const sum = movieReviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / movieReviews.length;
  };

  const setupMovieCards = (colCount) => {
    const columns = Math.ceil(colCount / 2);
    const maxMoviesCount = Math.max(4, columns * 2);
    const cards = [];

    displayed.forEach((movie, index) => {
      if (index < maxMoviesCount) {
        if (index % columns !== 0) {
          cards.push(<div key={`spacer-${index}`} className="spacer" />);
        }

        if (movie) {
          cards.push(
            <MovieCard
              key={index}
              role="listitem"
              movie={{
                ...movie,
                genre: (movie.genre || []).map((id) => genreMap[id]),
                year: movie.year.toString(),
              }}
              liked={likedMovies.includes(movie.id)}
              addedToWatchlist={addToWatchlistMovies.includes(movie.id)}
              onLike={() => toggleLike(movie.id)}
              onAddToWatchlist={() => toggleAddToWatchlist(movie.id)}
              allReviews={reviews}
            >
              <div className="movie-rating">
                <ReviewStars rating={calculateAverageRating(movie.id)} />
              </div>
            </MovieCard>
          );
        } else {
          cards.push(<div key={index} className="movie-card-placeholder" />);
        }
      }
    });

    setMovieCards(cards);
  };

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (!gridRef.current) return;
      const style = getComputedStyle(gridRef.current);
      const columns = style.gridTemplateColumns.split(" ").length;
      setupMovieCards(columns);
    });

    if (gridRef.current) {
      observer.observe(gridRef.current);
    }

    return () => observer.disconnect();
  }, [displayed]);

  return (
    <section
      className="recommendation-section"
      role="region"
      aria-label="Recommended movies section"
    >
      <div className="recommendation-wrapper">
        <h2 className="recommendation-title">{title}</h2>
        {moviesType === "recommendation" && (
          <span
            className="recommendation-refresh"
            role="button"
            tabIndex={0}
            aria-label="Reload recommended movies"
            onClick={handleReload}
            onKeyDown={(e) => e.key === "Enter" && handleReload()}
          >
            <TfiReload aria-hidden="true" />
          </span>
        )}

        <div
          id="recommendation"
          className="recommendation-card-container"
          ref={gridRef}
          role="list"
          aria-label="List of recommended movies"
        >
          {movieCards}
        </div>
      </div>
    </section>
  );
};

export default RecommendationSection;
