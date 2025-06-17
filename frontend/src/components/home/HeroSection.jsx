import React from "react";
import MovieCard from "../directory/MovieCard";
import "../../styles/home/hero-section.css";
import "../../styles/home/recommendation-section.css";
import "../../styles/home/ranking-card.css";
import { FaAngleRight } from "react-icons/fa6";
import { TfiReload } from "react-icons/tfi";
import { getTopMoviesByGenre } from "./ranking";
import RankingCard from "./RankingCard";
// import { movies, genres, reviews } from "../../constant";
import { useMemo, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useHorizontalScroll from "../../store/useHorizontalScroll";
import ReviewStars from "../directory/ReviewStars";
import useGenreStore from "../../store/useGenreStore";
import useMovieStore from "../../store/useMovieStore";
import axios from "axios";
import { useAuthStore } from "../../store/useAuthStore";
const HeroSection = ({ title, moviesType, items }) => {
  const {
    movies: storeMovies,
    isLiked,
    isInWatchlist,
    toggleLike,
    toggleWatchlist,
    fetchMovies,
    fetchWatchlist,
    fetchLikedMovies,
  } = useMovieStore();
const {authUser}= useAuthStore();
  const { genreMap, fetchGenres } = useGenreStore();
  const [cardPerRow, setCardPerRow] = useState(1);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [displayed, setDisplayed] = useState([]);
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const gridRef = useRef(null);
  const userId = useAuthStore.authUser?._id;

  // Fetch initial data
  useEffect(() => {
  fetchGenres();

  if (moviesType === "watchlist") {
    fetchWatchlist();
  } else if (moviesType === "newReleased") {
    fetchNewReleasedMovies();
  } else if (moviesType === "recommendation") {
    fetchRecommendedMovies();
  }
}, [moviesType]);

  // Get appropriate movie list based on type
  const movieList = useMemo(() => {
  if (["recommendation", "newReleased"].includes(moviesType)) {
    return Array.isArray(displayed) ? displayed : [];
  }

  if (moviesType === "watchlist") {
    return storeMovies.filter(m => isInWatchlist(m._id));
  }

  return Array.isArray(items) ? items : [];
}, [moviesType, displayed, storeMovies, items, isInWatchlist]);


  // Handle recommendation reload
 const handleReload = async () => {
  try {
    await fetchRecommendedMovies();
    console.log("Recommended movies reloaded successfully.");
  } catch {
    const shuffled = [...storeMovies].sort(() => 0.5 - Math.random());
    setDisplayed(shuffled.slice(0, 10));
    sessionStorage.setItem("displayedMovies", JSON.stringify(shuffled.slice(0, 10)));
  }
  };

  // Initialize recommendations
  useEffect(() => {
    if (moviesType !== "recommendation") return;
    const saved = sessionStorage.getItem("displayedMovies");
    if (saved) {
      setDisplayed(JSON.parse(saved));
    } else {
      handleReload();
    }
  }, [storeMovies]);

  
const fetchRecommendedMovies = async () => {
    try {
      console.log("Fetching recommended movies...");
      console.log("Fetching recommended movies for user:", authUser._id);
      if (!authUser._id) {
        console.warn("No user ID found.");
        return;
      }

      const res = await axios.get('/recommendation');
      if (!res.data || !res.data.movies) {
        console.warn("No recommended movies found in response.");
        return;
      }
      setDisplayed(res.data.movies);
    } catch (err) {
      console.error("Failed to fetch recommended movies:", err.message);
      setDisplayed([]);
    }
  };


  const fetchNewReleasedMovies = async () => {
    try {
      const res = await axios.get('/recommendation/new-releases');
      setDisplayed(res.data.data); // assuming backend returns { success, count, data }
    } catch (err) {
      console.error("Failed to fetch new releases:", err.message);
      setDisplayed([]);
    }
  };

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
}, [moviesType]);


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
    moviesType === "ranking" ? getTopMoviesByGenre(storeMovies, items, 6) : {},
    [storeMovies, items, moviesType]
  );

  // Accessibility labels
  const ariaLabel = {
    watchlist: "Your watchlist movies",
    newReleased: "Newly released movies",
    ranking: "Top ranked movies by genre",
    recommendation: "List of recommended movies"
  }[moviesType];

  // In your HeroSection component
  useEffect(() => {
    console.log('Current watchlist:', {
      storeMovies: storeMovies.length,
      watchlist: storeMovies.filter(m => isInWatchlist(m._id)),
      watchlistMap: useMovieStore.getState().watchlistMap
    });
  }, [storeMovies, isInWatchlist]);

  return (
    <section
      className="hero-section"
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
      {["watchlist", "newReleased", "recommendation"].includes(moviesType) && (
        <div
          id={moviesType}
          ref={gridRef}
          className="home-card-container grid"
          role="region"
          aria-label={ariaLabel}
        >
          {Array.isArray(movieList) &&
            movieList
              .slice(0, Math.max(4, cardPerRow * 2))
              .map((movie, index) => (
              <React.Fragment key={movie._id}>
                {index % cardPerRow !== 0 && windowWidth >= 942 && <div className="spacer" />}
                <MovieCard
                  movie={{
                    ...movie,
                    genre: movie.genre?.map(id => genreMap[id] || "Unknown") || [],
                    year: movie.year?.toString() || "",
                  }}
                  liked={isLiked(movie._id)}
                  addedToWatchlist={isInWatchlist(movie._id)}
                  onLike={() => toggleLike(movie._id)}
                  onAddToWatchlist={() => toggleWatchlist(movie._id)}
                >
                  {moviesType === "recommendation" && (
                    <div className="movie-rating">
                      <ReviewStars showNumber={true} rating={movie.averageRating || 0} />
                    </div>
                  )}
                </MovieCard>
              </React.Fragment>
            ))}
        </div>
      )}

      {/* <div className="home-card-section" role="region" aria-label={ariaLabel}> */}
      {moviesType === "ranking" && (
        <div className="home-card-container scroll-box" ref={containerRef}>
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
      {moviesType === "ranking" && (
        <div
          style={{ position: "relative", height: "22rem", zIndex: "100" }}
        ></div>
      )}
      {/* </div> */}
      {/* </div> */}
    </section>
  );
};

export default HeroSection;