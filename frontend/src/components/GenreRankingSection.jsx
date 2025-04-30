// components/GenreRankingSection.jsx
import GenreCard from "./GenreCard";
import Top1Card from "./Top1Card";
import { useState, useMemo } from "react";

const GenreRankingSection = ({ movies, allGenres  }) => {
  const [selectedGenre, setSelectedGenre] = useState("All");

  const genreOptions = useMemo(() => ["All", ...allGenres.map((g) => g.name)], [allGenres]);

  const filtered = useMemo(() => {
    if (selectedGenre === "All") return movies;
    const genreId = allGenres.find((g) => g.name === selectedGenre)?.id;
    return genreId
      ? movies.filter((m) => m.genre.includes(genreId))
      : [];
  }, [selectedGenre, movies, allGenres]);

  const sorted = [...filtered].map((movie) => ({
    ...movie,
    compositeScore: movie.rating * 0.8 + (movie.year - 2000) * 0.02,
  }))
  .sort((a, b) => b.compositeScore - a.compositeScore);

  const top1 = sorted[0];  
  const otherMovies = sorted.slice(1);
  
  // Format duration for Top 1 movie
  const durationText = useMemo(() => {
    if (!top1?.duration) return "";
    const hrs = Math.floor(top1.duration / 60);
    const mins = top1.duration % 60;
    return `⏱ ${hrs}h ${mins}min`;
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

  return (
    <section className="genre-ranking-section">
      <h2 className="genre-title">Order by Genre</h2>

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
            <div className="top1-card">
              <Top1Card
                key={top1.id}
                rank={1}
                image={top1.posterUrl}
                title={top1.title}
                rating={top1.rating}
                description={top1.description}
                genre={genreNames}
                region={top1.region}  
                year={top1.year}       
                duration={durationText}
              />
            </div>
          )}

          {/* Other movies (Top 2, Top 3, ...) - Right Side */}
          <div className="right-cards">
            {otherMovies.length === 0 ? (
              <p style={{ color: "#888", padding: "1rem" }}>No movies in this genre.</p>
            ) : (
              otherMovies.map((movie, index) => {const movieGenreNames = movie.genre
              .map((gid) => {
                const g = allGenres.find((item) => item.id === gid);
                return g ? g.name : gid;
              })
              .join(", ");

            const movieDurationText = `⏱ ${Math.floor(movie.duration / 60)}h ${movie.duration % 60}min`; // Calculate duration text for each movie
            return (
                <GenreCard
                  key={movie.id}
                  rank={index + 2}
                  image={movie.posterUrl}
                  title={movie.title}
                  rating={movie.rating}
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

