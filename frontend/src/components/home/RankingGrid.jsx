import React, { memo } from "react";
import "../../styles/general/genre-card.css";
import { movies, genres } from "../../constant";

const RankingGrid = memo(({ genre, isAllGenre }) => {
  let genreMovies = [];

  if (isAllGenre) {
    // Use all movies
    genreMovies = movies;
  } else {
    // Resolve genre name -> genre object
    const genreObject =
      typeof genre === "string" ? genres.find((g) => g.name === genre) : genre;

    if (!genreObject) {
      console.warn("Genre not found:", genre);
      return null;
    }

    // Filter movies by genre ID
    genreMovies = movies.filter((movie) =>
      movie.genre.includes(genreObject.id)
    );
  }

  // Get up to 4 random movies
  const randomMovies = genreMovies.sort(() => 0.5 - Math.random()).slice(0, 4);

  const moviesCount = randomMovies.length;

  return (
    <div className="posters-container">
      {randomMovies.map((item, index) => (
        <div key={index} style={{ display: "flex" }}>
          <img className="poster-img" src={item.posterUrl} alt={item.title} />
        </div>
      ))}

      {/* Fill with placeholders if < 4 movies */}
      {Array.from({ length: 4 - moviesCount }).map((_, index) => (
        <div key={index + moviesCount} style={{ display: "flex" }}>
          <img
            className="poster-img"
            src={
              moviesCount === 0
                ? "/profile/default-movie.png"
                : randomMovies[Math.max(1 - index, 0)].posterUrl
            }
            alt="Default movie"
          />
        </div>
      ))}
    </div>
  );
});

export default RankingGrid;
