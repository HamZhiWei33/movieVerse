// components/GenreRankingSection.jsx
import GenreCard from "./GenreCard";
import Top1Card from "./Top1Card";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

const GenreRankingSection = ({ movies, allGenres, allReviews }) => {
  const [searchParams] = useSearchParams();
  const urlGenre = searchParams.get("genre");
  const location = useLocation();
  // const [selectedGenre, setSelectedGenre] = useState("All");
  // Set initial state to URL genre if valid, otherwise "All"

  const genreOptions = useMemo(
    () => ["All", ...allGenres.map((g) => g.name)],
    [allGenres]
  );
  const [selectedGenre, setSelectedGenre] = useState(
    genreOptions.includes(urlGenre) ? urlGenre : "All"
  );
  // Effect to sync state when URL changes
  useEffect(() => {
    if (urlGenre && genreOptions.includes(urlGenre)) {
      setSelectedGenre(urlGenre);
    } else {
      setSelectedGenre("All");
    }
  }, [urlGenre, genreOptions]);

  // Scroll to section when component mounts or hash changes
  useEffect(() => {
    if (location.hash === "#genre-ranking") {
      setTimeout(() => {
        const element = document.getElementById("genre-ranking");
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100); // Small delay to ensure DOM is ready
    }
  }, [location.hash]);

  const filtered = useMemo(() => {
    if (selectedGenre === "All") return movies;
    const genreId = allGenres.find((g) => g.name === selectedGenre)?.id;
    return genreId ? movies.filter((m) => m.genre.includes(genreId)) : [];
  }, [selectedGenre, movies, allGenres]);

  const sorted = [...filtered]
    .map((movie) => ({
      ...movie,
      compositeScore: movie.rating * 0.8 + (movie.year - 2000) * 0.02,
    }))
    .sort((a, b) => b.compositeScore - a.compositeScore);
  console.log("Sorted movies:", sorted); // Debugging line
  const top1 = sorted[0];
  const otherMovies = sorted.slice(1);

  const formatDuration = (minutes) => {
    if (!minutes || isNaN(minutes)) return "N/A";

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return hours > 0
      ? `${hours}h${mins > 0 ? ` ${mins}min` : ""}`.trim()
      : `${mins}min`;
  };

  // Format duration for Top 1 movie
  // const durationText = useMemo(() => {
  //   if (!top1?.duration) return "";
  //   const hrs = Math.floor(top1.duration / 60);
  //   const mins = top1.duration % 60;
  //   return `${hrs}h ${mins}min`;
  // }, [top1]);
  const durationText = useMemo(() => {
    return formatDuration(top1?.duration);
  }, [top1]);

  // Get genre names for Top 1 movie
  const genreNames = useMemo(() => {
    return top1?.genre
      .map((gid) => {
        const g = allGenres.find((item) => item.id === gid);
        return g ? g.name : gid;
      })
      .join(", ");
  }, [top1, allGenres]);

  const calculateAverageRating = (movieId) => {
    if (!Array.isArray(allReviews) || allReviews.length === 0) return 0;

    const selectedReviews = allReviews.filter((r) => r.movieId === movieId);

    const validRatings = selectedReviews
      .map((r) => Number(r.rating))
      .filter((r) => !isNaN(r));

    if (validRatings.length === 0) return 0;

    const sum = validRatings.reduce((acc, rating) => acc + rating, 0);
    const average = sum / validRatings.length;

    return parseFloat(average.toFixed(1));
  };

  return (
    <section className="genre-ranking-section">
      <h2 className="genre-ranking-section-header">Order by Genre</h2>

      <nav className="genre-nav">
        {genreOptions.map((g) => (
          <button
            key={g}
            className={`genre-tab ${selectedGenre === g ? "active" : ""}`}
            onClick={() => setSelectedGenre(g)}
          >
            {g}
          </button>
        ))}
      </nav>

      <div className="genre-list">
        <div className="genre-ranking-layout">
          {/* Top 1 - Left Side */}
          {top1 && (
              <Top1Card
                key={top1.id}
                movie={top1}
                rank={1}
                image={top1.posterUrl}
                title={top1.title}
                rating={calculateAverageRating(top1.id)}
                description={top1.description}
                genre={genreNames}
                region={top1.region}
                year={top1.year}
                duration={durationText}
              />
          )}

          {/* Other movies (Top 2, Top 3, ...) - Right Side */}
          <div className="right-cards">
            {otherMovies.length === 0 ? (
              <p style={{ color: "#888", padding: "1rem" }}>
                No movies in this genre.
              </p>
            ) : (
              otherMovies.map((movie, index) => {
                const movieGenreNames = movie.genre
                  .map((gid) => {
                    const g = allGenres.find((item) => item.id === gid);
                    return g ? g.name : gid;
                  })
                  .join(", ");

                const movieDurationText = `${Math.floor(
                  movie.duration / 60
                )}h ${movie.duration % 60}min`; // Calculate duration text for each movie
                return (
                  <GenreCard
                    key={movie.id}
                    movie={movie}
                    rank={index + 2}
                    image={movie.posterUrl}
                    title={movie.title}
                    rating={calculateAverageRating(movie.id)}
                    genre={movieGenreNames}
                    region={movie.region}
                    year={movie.year}
                    duration={movieDurationText}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GenreRankingSection;
