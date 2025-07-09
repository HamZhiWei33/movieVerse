import "../../styles/home/hero-section.css";
import "../../styles/home/recommendation-section.css";
import "../../styles/home/ranking-card.css";

import React, { useMemo, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { FaAngleRight } from "react-icons/fa6";
import { TfiReload } from "react-icons/tfi";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import RankingCard from "./RankingCard";
import MovieCard from "../directory/MovieCard";
import ReviewStars from "../directory/ReviewStars";

import { getTopMoviesByGenre } from "./ranking";
import useGenreStore from "../../store/useGenreStore";
import useMovieStore from "../../store/useMovieStore";
import { useAuthStore }  from "../../store/useAuthStore";


const HeroSection = ({ title, moviesType, items }) => {
  const {
    movies: storeMovies,
    loading,
    fetchMovies,
    recommendedMovies,
    randomRecommendedMovies,
    updatingWatchlist
  } = useMovieStore();

  const { genreMap } = useGenreStore();
  const [cardPerRow, setCardPerRow] = useState(1);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const gridRef = useRef(null);
  const userId = useAuthStore.authUser?._id;

  // Fetch initial data
  useEffect(() => {
    // Fetch at least 500 movies
    if (!loading && storeMovies.length < 500) {
      fetchMovies(1, 1000, { sort: "-year" }); // Fetch newest movies
    }
  }, []);

  // Get appropriate movie list based on type
  const movieList = useMemo(() => {
    if (moviesType === "newReleased") {
      return storeMovies.slice(0, 20);
    }
    return items;
  }, [moviesType, storeMovies, items]);

  // Handle recommendation reload
  const handleReload = () => {
    const shuffled = [...recommendedMovies]
      .sort(() => 0.5 - Math.random())
      .slice(0, 20)
      .sort((a, b) => b.rating - a.rating);
    useMovieStore.setState({ randomRecommendedMovies: shuffled });
  };

  useEffect(() => {
    if (
      moviesType === "recommendation" &&
      randomRecommendedMovies.length < 20
    ) {
      handleReload();
    }
  }, [recommendedMovies]);

  // Calculate responsive layout
  useEffect(() => {
  if (moviesType === "ranking") return;
  if (!gridRef.current || !(gridRef.current instanceof Element)) return;

  const observer = new ResizeObserver(() => {
    if (!gridRef.current) return;
    const style = getComputedStyle(gridRef.current);
    const columns = style.gridTemplateColumns?.split(" ").length || 1;
    setWindowWidth(window.innerWidth);
    setCardPerRow(Math.ceil(columns / 2));
  });

    observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, [moviesType, movieList, updatingWatchlist]);

  // Navigation handlers
  const navigateFullPage = () => {
    if (moviesType === "watchlist") {
      navigate("/profile", { state: { targetTab: "WatchList" } });
    } else if (moviesType === "ranking") {
      navigate("/ranking");
    }
  };

  // Get top movies by genre for ranking section
  const topMoviesByGenre = useMemo(() =>
    moviesType === "ranking"
      ? getTopMoviesByGenre(storeMovies, items, 4)
      : {}
    , [storeMovies]);

  // Accessibility labels
  const ariaLabel = {
    watchlist: "Your watchlist movies",
    newReleased: "Newly released movies",
    ranking: "Top ranked movies by genre",
    recommendation: "List of recommended movies",
  }[moviesType];

  const sectionId = {
    watchlist: "watchlist-section",
    newReleased: "new-released-section",
    ranking: "ranking-section",
    recommendation: "recommendation-section",
  }[moviesType];

  return (
    <section
      className="hero-section"
      id={sectionId}
      role="region"
      aria-label={`Home section: ${title}`}
    >
      <div className="home-section-title-container">
        <h2 className="home-title">
          {title}
          <span
            className="home-icon"
            onClick={navigateFullPage}
            role="button"
            tabIndex={0}
            aria-label={`Go to full ${moviesType} view`}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                navigateFullPage();
              }
            }}
          >
            <FaAngleRight aria-hidden="true" />
          </span>
        </h2>
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
      </div>
      {(moviesType === "watchlist" ||
        moviesType === "newReleased" ||
        moviesType === "recommendation") &&
        ((movieList.length === 0 || (moviesType === "watchlist" && updatingWatchlist)) ? (
          <div className="no-movies-message">
            {(moviesType === "watchlist" && updatingWatchlist) ? (
              <DotLottieReact
                src="https://lottie.host/6185175f-ee83-45a4-9244-03871961a1e9/yLmGLfSgYI.lottie"
                loop
                autoplay
                className="loading-icon"
              />
            ) : (
              <span>{`No movie in ${moviesType.charAt(0).toUpperCase() + moviesType.slice(1)}`}</span>
            )}
          </div>

        ) : (
          <div
            id={moviesType}
            ref={gridRef}
            className="home-card-container grid"
            role="region"
            aria-label={ariaLabel}
          >
            {movieList.slice(0, Math.max(4, cardPerRow * 2)).map((movie, index) => (
              <React.Fragment key={movie._id}>
                {index % cardPerRow !== 0 && windowWidth >= 942 && (
                  <div className="spacer" />
                )}
                <MovieCard
                  movie={{
                    ...movie,
                    genre:
                      movie.genre?.map((id) => genreMap[id] || "Unknown") ||
                      [],
                    year: movie.year?.toString() || "",
                  }}
                >
                  {moviesType === "recommendation" && (
                    <div className="movie-rating">
                      <ReviewStars showNumber={true} rating={movie.rating || 0} />
                    </div>
                  )}
                </MovieCard>
              </React.Fragment>
            ))}
          </div>
        ))}

      {moviesType === "ranking" && (
        <React.Fragment>
          <div className="home-card-container scroll-box" ref={containerRef}>
            <div className="genre-selection-grid">
              <RankingCard
                isAllGenre
                topMovies={topMoviesByGenre.All}
                isLoading={loading}
              />

              {items.slice(0, 5).map((genre) => (
                <RankingCard
                  key={genre.id}
                  genre={genre}
                  topMovies={topMoviesByGenre[genre.name] || []}
                  isLoading={loading}
                />
              ))}
            </div>
          </div>
          <div style={{ position: "relative", height: "22rem", zIndex: "100" }}></div>
        </React.Fragment>
      )}
    </section>
  );
};

export default HeroSection;
