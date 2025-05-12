import React from "react";
import MovieCard from "../directory/MovieCard";
import "../../styles/home/hero-section.css";
import "../../styles/home/ranking-card.css";
import { FaAngleRight } from "react-icons/fa6";
import { TfiReload } from "react-icons/tfi";
import { getTopMoviesByGenre } from "./ranking";
import RankingCard from "./RankingCard";
import { movies, genres } from "../../constant";
import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useHorizontalScroll from "../../store/useHorizontalScroll";
import { reviews } from "../../constant";
const HeroSection = ({ title, moviesType, items }) => {
  const [likedMovies, setLikedMovies] = useState([]);
  const [addToWatchlistMovies, setAddToWatchlistMovies] = useState([]);

  //items=allGenres
  const topMoviesByGenre = useMemo(
    () => getTopMoviesByGenre(movies, items, 6),
    [movies, items]
  );
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const handleWatchlistClick = () => {
    navigate("/profile", { state: { targetTab: "WatchList" } });
  };

  const handleRankingClick = () => {
    console.log("ranking click");
    navigate("/ranking");
  };

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
  return (
    <section
      className="hero-section"
      role="region"
      aria-label={`Home section: ${title}`}
    >
      <div className="home-section-container">
        <div className="home-section">
          <h2 className="home-title">
            {title}
            {(moviesType === "watchlist" || moviesType === "ranking") && (
              <span
                className="home-icon"
                onClick={
                  moviesType === "watchlist"
                    ? handleWatchlistClick
                    : handleRankingClick
                }
                role="button"
                tabIndex={0}
                aria-label={`Go to full ${moviesType} view`}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    moviesType === "watchlist"
                      ? handleWatchlistClick()
                      : handleRankingClick();
                  }
                }}
              >
                <FaAngleRight aria-hidden="true" />
              </span>
            )}

            {moviesType === "recommendation" && (
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
            )}
          </h2>
        </div>
        <div
          id="watchlist"
          className="home-card-section"
          role="region"
          aria-label="Your watchlist movies"
        >
          {moviesType === "watchlist" && (
            <div className="home-card-container">
              {items.map((movie) => (
                <MovieCard
                  className="home-movie-card"
                  key={movie.id}
                  movie={{
                    ...movie,
                    year: movie.year.toString(), // Ensure year is string
                  }}
                  liked={likedMovies.includes(movie.id)}
                  addedToWatchlist={addToWatchlistMovies.includes(movie.id)}
                  onLike={() => toggleLike(movie.id)}
                  onAddToWatchlist={() => toggleAddToWatchlist(movie.id)}
                  allReviews={reviews}
                />
              ))}
            </div>
          )}
        </div>
        <div
          className="home-card-section"
          role="region"
          aria-label="Newly released movies"
        >
          {moviesType === "newReleased" && (
            <div className="home-card-container">
              {items.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={{
                    ...movie,
                    year: movie.year.toString(), // Ensure year is string
                  }}
                  liked={likedMovies.includes(movie.id)}
                  addedToWatchlist={addToWatchlistMovies.includes(movie.id)}
                  onLike={() => toggleLike(movie.id)}
                  onAddToWatchlist={() => toggleAddToWatchlist(movie.id)}
                  allReviews={reviews}
                />
              ))}
            </div>
          )}
        </div>
        <div
          className="home-card-section"
          role="region"
          aria-label="Top ranked movies by genre"
        >
          {moviesType === "ranking" && (
            <div className="home-card-container" ref={containerRef}>
              <div className="genre-selection-grid">
                {/* "All" genre card */}
                {/* <RankingCard isAllGenre /> */}
                <RankingCard isAllGenre topMovies={topMoviesByGenre.All} />

                {/* Individual genre cards */}
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
      </div>
    </section>
  );
};

export default HeroSection;
