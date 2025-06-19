import React, { useState, memo, useEffect, useMemo } from "react";
import "../../styles/general/genre-card.css";
import useMovieStore from "../../store/useMovieStore";

export const PostersGrid = memo(({ movies }) => {
  const randomMovies = movies
    .sort(() => 0.5 - Math.random()) // Shuffle
    .slice(0, Math.min(4, movies.length)); // Choose

  var moviesCount = randomMovies.length;

  return (
    <div className="posters-container">
      {randomMovies.map((item, index) => (
        <div key={index} style={{ display: "flex" }}>
          {<img className="poster-img" src={item.posterUrl} /> || ""}
        </div>
      ))}

      {/* Display remaining movies' posters if movies count < 4 */}
      {Array.from({ length: 4 - moviesCount }).map((_, index) => (
        <div key={index + moviesCount} style={{ display: "flex" }}>
          {(
            <img
              className="poster-img"
              src={
                randomMovies[Math.max(1 - index, 0)]?.posterUrl ?? "/profile/default-movie.png"
              }
            />
          ) || ""}
        </div>
      ))}
    </div>
  );
});

const GenreCard = ({ genre, onCardClicked, favouriteGenres }) => {
  const { movies: storeMovies } = useMovieStore();

  const [selected, setSelected] = useState(false);

  useEffect(() => {
    setSelected(favouriteGenres.includes(Number(genre.id)));
  }, [favouriteGenres]);

  const movies = useMemo(() => storeMovies.filter((movie) => movie.genre.includes(Number(genre.id))), [storeMovies]);

  const handleCardClick = () => {
    onCardClicked(!selected, genre);
    setSelected(!selected);
  };

  return (
    <article
      className={`signup-genre-card ${selected ? "selected" : ""}`}
      onClick={handleCardClick}
    >
      <PostersGrid movies={movies} />
      <h3>{genre.name}</h3>
    </article>
  );
};

export default GenreCard;
