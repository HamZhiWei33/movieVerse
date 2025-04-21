// components/GenreRankingSection.jsx
import GenreCard from "./GenreCard";
import Top1Card from "./Top1Card";
import { useState } from "react";

const genres = ["All", "Action", "Adventure", "Comedy", "Drama", "Horror", "Thriller", "Sci-Fi", "Fantasy", "Romance", "Mystery", "Crime", "Animation"];

const GenreRankingSection = ({ movies }) => {
  const [selectedGenre, setSelectedGenre] = useState("All");

  const filtered = selectedGenre === "All"
    ? movies
    : movies.filter((m) => m.genre === selectedGenre);

  const sorted = [...filtered].sort((a, b) => b.rating - a.rating);

  const top1 = sorted[0];  
  const otherMovies = sorted.slice(1);

  return (
    <section className="genre-ranking-section">
      <h2 className="genre-title">Order by Genre</h2>

      <nav className="genre-nav">
        {genres.map((g) => (
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
                image={top1.image}
                title={top1.title}
                rating={top1.rating}
                description={top1.description}
              />
            </div>
          )}

          {/* Other movies (Top 2, Top 3, ...) - Right Side */}
          <div className="right-cards">
            {otherMovies.length === 0 ? (
              <p style={{ color: "#888", padding: "1rem" }}>No movies in this genre.</p>
            ) : (
              otherMovies.map((movie, index) => (
                <GenreCard
                  key={movie.id}
                  rank={index + 2}
                  image={movie.image}
                  title={movie.title}
                  rating={movie.rating}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GenreRankingSection;

