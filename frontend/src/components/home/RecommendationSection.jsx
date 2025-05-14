import React, { useRef, useState, useEffect } from "react";
import MovieCard from "../directory/MovieCard";
import "../../styles/home/recommendation-section.css";
import { TfiReload } from "react-icons/tfi";
import { genres, reviews } from "../../constant";
const RecommendationSection = ({ title, moviesType, items }) => {
  const [displayed, setDisplayed] = useState([]);
  const [likedMovies, setLikedMovies] = useState([]);
  const [addToWatchlistMovies, setAddToWatchlistMovies] = useState([]);

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
  }, [items]);

  const toggleLike = (title) => {
    setLikedMovies((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const toggleAddToWatchlist = (title) => {
    setAddToWatchlistMovies((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const setupMovieCards = (colCount) => {
    const columns = Math.ceil(colCount / 2); // colCount is columns with spacer(gap), need to calculate without gap
    const maxMoviesCount = Math.max(4, columns * 2); // Show only 2 rows, with at least 4 movies
    const cards = [];
    displayed.forEach((movie, index) => {
      if (index < maxMoviesCount) {
        // Spacer before every item except the first
        if (index % columns !== 0) cards.push(<div key={`spacer-${index}`} className="spacer" />);
        cards.push(
          movie ? (
              <MovieCard
              key={index}
                role="listitem"
                movie={{
                  ...movie,
                  genre: movie.genre.map((id) => genreMap[id]), // Convert genre IDs to names
                  year: movie.year.toString(), // Ensure year is string
                }}
                liked={likedMovies.includes(movie.id)}
                addedToWatchlist={addToWatchlistMovies.includes(movie.id)}
                onLike={() => toggleLike(movie.id)}
                onAddToWatchlist={() => toggleAddToWatchlist(movie.id)}
                allReviews={reviews}
              />
          ) : (
            <div key={index} className="movie-card-placeholder" />
          )
        );
      }
    });
    setMovieCards(cards);
  };

  const genreMap = genres.reduce((map, genre) => {
    map[genre.id] = genre.name;
    return map;
  }, {});

  const gridRef = useRef(null);
  // const [gridColCount, setGridColCount] = useState(0);
  const [movieCards, setMovieCards] = useState([]);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (!gridRef.current) return;
      const style = getComputedStyle(gridRef.current);
      const columns = style.gridTemplateColumns.split(' ').length;

      // setGridColCount(columns);

      // Limit visible items to 2 rows
      const maxVisible = columns * 2;
      // setVisibleCount(maxVisible);

      setupMovieCards(columns);

    });

    observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, [displayed]);

  return (
    <section
      className="recommendation-section"
      role="region"
      aria-label="Recommended movies section"
    >
      <div className="recommendation-wrapper">
        {/* Title and Reload Icon Row */}
        <h2 className="recommendation-title">{title}</h2>
        {moviesType === "recommendation" && (
          <span
            className="recommendation-refresh"
            role="button"
            tabIndex={0}
            aria-label="Reload recommended movies"
            onClick={handleReload}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleReload();
            }}
          >
            <TfiReload aria-hidden="true" />
          </span>
        )}

        {/* Movie Card Grid */}
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
    </section >
  );
};

export default RecommendationSection;