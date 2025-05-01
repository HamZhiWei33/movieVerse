import React from "react";
import MovieCard from "../directory/MovieCard";
import "../../styles/home/home-newReleased.css";
import "../../styles/home/ranking-card.css";
import { FaAngleRight } from "react-icons/fa6";
import { getTopMoviesByGenre } from "./ranking";
import RankingCard from "./RankingCard";
import { movies } from "../../constant";
import { useMemo } from "react";
const HeroSection = ({ title, moviesType, items }) => {
  //items=allGenres
  const topMoviesByGenre = useMemo(
    () => getTopMoviesByGenre(movies, items, 6),
    [movies, items]
  );
  return (
    <div className="hero-section">
      <div className="home-section-container">
        <div className="home-newReleased">
          <h2 className="home-title">
            {title}
            <span className="home-icon">
              <FaAngleRight />
            </span>
          </h2>
        </div>
        <div className="home-card-section">
          {(moviesType === "watchlist" || moviesType === "newReleased") && (
            <div className="home-card-container">
              {items.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </div>
        <div className="home-card-section">
          {moviesType === "ranking" && (
            <div className="home-card-container">
              <div className="genre-selection-grid">
                {/* "All" genre card */}
                {/* <RankingCard isAllGenre /> */}
                <RankingCard isAllGenre topMovies={topMoviesByGenre.All} />

                {/* Individual genre cards */}
                {items.slice(0, 5).map((genre) => (
                  // <RankingCard key={genre.id} genre={genre} />

                  <RankingCard
                    key={genre.id}
                    genre={genre.name}
                    topMovies={topMoviesByGenre[genre.name] || []}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
