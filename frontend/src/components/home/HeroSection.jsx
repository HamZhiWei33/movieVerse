import React from "react";
import MovieCard from "../directory/MovieCard";
import "../../styles/home/hero-section.css";
import "../../styles/home/ranking-card.css";
import { FaAngleRight } from "react-icons/fa6";
import { TfiReload } from "react-icons/tfi";
import { getTopMoviesByGenre } from "./ranking";
import RankingCard from "./RankingCard";
import { movies, genres, reviews } from "../../constant";
import { useMemo, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useHorizontalScroll from "../../store/useHorizontalScroll";
const HeroSection = ({ title, moviesType, items }) => {
  const [likedMovies, setLikedMovies] = useState([]);
  const [addToWatchlistMovies, setAddToWatchlistMovies] = useState([]);

  var ariaLabel;
  if (moviesType === "watchlist") {
    ariaLabel = "Your watchlist movies";
  } else if (moviesType === "newReleased") {
    ariaLabel = "Newly released movies";
  } else if (moviesType === "ranking") {
    ariaLabel = "Top ranked movies by genre";
  }

  //items=allGenres
  const topMoviesByGenre = useMemo(
    () => getTopMoviesByGenre(movies, items, 6),
    [movies, items]
  );
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const navigateFullPage = () => {
    if (moviesType === "watchlist") {
      navigate("/profile", { state: { targetTab: "WatchList" } });
    } else if (moviesType === "ranking") {
      navigate("/ranking");
    }
  };

  // const handleWatchlistClick = () => {
  //   navigate("/profile", { state: { targetTab: "WatchList" } });
  // };

  // const handleRankingClick = () => {
  //   console.log("ranking click");
  //   navigate("/ranking");
  // };

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

  useHorizontalScroll(containerRef);

  const genreMap = genres.reduce((map, genre) => {
    map[genre.id] = genre.name;
    return map;
  }, {});

  const setupMovieCards = (colCount) => {
    const columns = Math.ceil(colCount / 2); // colCount is columns with spacer(gap), need to calculate without gap
    const maxMoviesCount = Math.max(4, columns * 2); // Show only 2 rows, with at least 4 movies
    const cards = [];
    items.forEach((movie, index) => {
      if (index < maxMoviesCount) {
        // Spacer before every item except the first
        if (index % columns !== 0 && window.innerWidth >= 922) cards.push(<div key={`spacer-${index}`} className="spacer" />);
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

  const gridRef = useRef(null);
  const [movieCards, setMovieCards] = useState([]);

  useEffect(() => {
    if (moviesType === "ranking") return;
    if (!gridRef.current) return;
    const observer = new ResizeObserver(() => {

      const style = getComputedStyle(gridRef.current);
      const columns = style.gridTemplateColumns.split(' ').length;

      setupMovieCards(columns);

    });

    observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, [items]);

  return (
    <section
      className="hero-section"
      role="region"
      aria-label={`Home section: ${title}`}
    >
      <div className="home-section-container">
        <div className="home-section-title">
          <h2 className="home-title">
            {title}
            {/* {(moviesType === "watchlist" || moviesType === "ranking") && ( */}
            <span
              className="home-icon"
              onClick={navigateFullPage}
              role="button"
              tabIndex={0}
              aria-label={`Go to full ${moviesType} view`}
              onKeyDown={(e) => { if (e.key === "Enter") { navigateFullPage() } }}
            >
              <FaAngleRight aria-hidden="true" />
            </span>
            {/* )} */}

            {/* {moviesType === "recommendation" && (
              <span
                className="home-icon reload-icon"
                role="button"
                tabIndex={0}
                aria-label="Refresh recommendations"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    console.log("refresh recommendations");
                  }
                }}
              >
                <TfiReload aria-hidden="true" />
              </span>
            )} */}
          </h2>
        </div>
        {(moviesType === "watchlist" || moviesType === "newReleased") && (
          <div style={{maxWidth:"100%", width:"100%", padding:"1rem 2rem"}}>
            <div
              id={moviesType}
              ref={gridRef}
              className="recommendation-card-container"
              role="region"
              aria-label={ariaLabel}>
              {movieCards}
            </div>
          </div>

        )}
        {/* <div
          className="home-card-section"
          role="region"
          aria-label={ariaLabel}
        >
          {moviesType === "newReleased" && (
            <div className="home-card-container">
              {items.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={{
                    ...movie,
                    genre: movie.genre.map((id) => genreMap[id]), // Convert genre IDs to names
                    year: movie.year.toString(), // Ensure year is string
                  }}
                  liked={likedMovies.includes(movie.id)}
                  addedToWatchlist={addToWatchlistMovies.includes(movie.id)}
                  onLike={() => toggleLike(movie.id)}
                  onAddToWatchlist={() => toggleAddToWatchlist(movie.id)}
                />
              ))}
            </div>
          )}
        </div> */}
        <div
          className="home-card-section"
          role="region"
          aria-label={ariaLabel}
        >
          {moviesType === "ranking" && (
            <div className="home-card-container" ref={containerRef}>
              <div className="genre-selection-grid">
                <RankingCard isAllGenre topMovies={topMoviesByGenre.All} />

                {items.slice(0, 5).map((genre) => (
                  // <RankingCard key={genre.id} genre={genre} />

                  <RankingCard
                    key={genre.id}
                    genre={genre}
                    topMovies={topMoviesByGenre[genre.name] || []}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        {/* <div className="home-card-section">
          {moviesType === "recommendation" && (
            <div id="recommendation" className="home-card-container">
              {items.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </div> */}
      </div>
    </section>
  );
};

export default HeroSection;
