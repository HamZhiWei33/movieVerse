import React from "react";
import MovieCard from "../directory/MovieCard";
import "../../styles/home/hero-section.css";
import "../../styles/home/recommendation-section.css";
import "../../styles/home/ranking-card.css";
import { FaAngleRight } from "react-icons/fa6";
import { TfiReload } from "react-icons/tfi";
import { getTopMoviesByGenre } from "./ranking";
import RankingCard from "./RankingCard";
import { movies, genres, reviews } from "../../constant";
import { useMemo, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useHorizontalScroll from "../../store/useHorizontalScroll";
import ReviewStars from "../directory/ReviewStars";

const HeroSection = ({ title, moviesType, items }) => {
  const [cardPerRow, setCardPerRow] = useState(1);
  const [displayed, setDisplayed] = useState([]);
  const [likedMovies, setLikedMovies] = useState([]);
  const [addToWatchlistMovies, setAddToWatchlistMovies] = useState([]);
  const movieList = moviesType === "recommendation" ? displayed : items;

  var ariaLabel;
  if (moviesType === "watchlist") {
    ariaLabel = "Your watchlist movies";
  } else if (moviesType === "newReleased") {
    ariaLabel = "Newly released movies";
  } else if (moviesType === "ranking") {
    ariaLabel = "Top ranked movies by genre";
  } else if (moviesType === "recommendation") {
    ariaLabel = "List of recommended movies";
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

  const toggleLike = (title) => {
    setLikedMovies((prev) => {
      const updated = prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title];
      console.log("Previous liked:", prev);
      console.log("Updating to:", updated);
      return updated;
    });
  };

  useEffect(() => {
    console.log(likedMovies);
  }, [likedMovies]);


  const toggleAddToWatchlist = (title) => {
    setAddToWatchlistMovies((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const handleReload = () => {
    const shuffled = [...items].sort(() => 0.5 - Math.random());
    setDisplayed(shuffled);
    sessionStorage.setItem("displayedMovies", JSON.stringify(shuffled));
  };

  useEffect(() => {
    if (moviesType !== "recommendation") return;
    const saved = sessionStorage.getItem("displayedMovies");
    if (saved) {
      setDisplayed(JSON.parse(saved));
    } else if (moviesType === "recommendation") {
      handleReload(); // fallback if no saved data
    }
  }, [items]);

  useHorizontalScroll(containerRef);

  const genreMap = genres.reduce((map, genre) => {
    map[genre.id] = genre.name;
    return map;
  }, {});

  const calculateAverageRating = (movieId) => {
    const movieReviews = reviews.filter((review) => review.movieId === movieId);
    if (movieReviews.length === 0) return 0;
    const sum = movieReviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / movieReviews.length;
  };

  const setupMovieCards = (colCount) => {
    const columns = Math.ceil(colCount / 2); // colCount is columns with spacer(gap), need to calculate without gap
    const maxMoviesCount = Math.max(4, columns * 2); // Show only 2 rows, with at least 4 movies
    const cards = [];
    const movieList = moviesType === "recommendation" ? displayed : items;
    movieList.forEach((movie, index) => {
      if (index < maxMoviesCount) {
        // Spacer before every item except the first
        if (index % columns !== 0 && window.innerWidth >= 922) {
          cards.push(<div key={`spacer-${index}`} className="spacer" />);
        }

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
            {moviesType === "recommendation" && (
              <div className="movie-rating">
                <ReviewStars
                  showNumber="true"
                  rating={calculateAverageRating(movie.id)}
                />
              </div>
            )}
          </MovieCard>
        );
      } else {
        cards.push(<div key={index} className="movie-card-placeholder" />);
      }
    });
    setMovieCards(cards);
  };

  const gridRef = useRef(null);

  useEffect(() => {
    if (moviesType === "ranking") return;
    if (!gridRef.current) return;
    const observer = new ResizeObserver(() => {
      const style = getComputedStyle(gridRef.current);
      const columns = style.gridTemplateColumns.split(" ").length;
      setCardPerRow(Math.ceil(columns / 2));
    });

    observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, [items, displayed]);

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
      {(moviesType === "watchlist" ||
        moviesType === "newReleased" ||
        moviesType === "recommendation") && (
        <div
          id={moviesType}
          ref={gridRef}
          className="home-card-container grid"
          role="region"
          aria-label={ariaLabel}
        >
          {movieList.slice(0, Math.max(4, cardPerRow * 2)).map((movie, index) => (
            <React.Fragment key={movie.id}>
              {index % cardPerRow !== 0 && window.innerWidth >= 922 && (
                <div className="spacer" />
              )}
              <MovieCard
                movie={{
                  ...movie,
                  year: movie.year.toString(),
                }}
                liked={likedMovies.includes(movie.id)}
                addedToWatchlist={addToWatchlistMovies.includes(movie.id)}
                onLike={() => toggleLike(movie.id)}
                onAddToWatchlist={() => toggleAddToWatchlist(movie.id)}
                allReviews={reviews}
              />
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
