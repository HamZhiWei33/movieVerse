import React, { useState, memo, useEffect } from "react";
// import LikeIcon from "./LikeIcon";
// import AddToWatchlistIcon from "./AddToWatchlistIcon";
import "../../styles/general/genre-card.css";
import { movies } from "../../constant";
import useMovieStore from "../../store/useMovieStore";

export const PostersGrid = memo(({ movies }) => {
  // const genreMovies = movies.filter((movie) => movie.genre.includes(genre.id));
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
                moviesCount === 0
                  ? "/profile/default-movie.png"
                  : randomMovies[Math.max(1 - index, 0)].posterUrl
              }
            />
          ) || ""}
        </div>
      ))}
    </div>
  );
});

const GenreCard = ({ genre, onCardClicked, favouriteGenres }) => {
  const {fetchMovies} = useMovieStore();

  const [movies, setMovies] = useState([]);
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    setSelected(favouriteGenres.includes(Number(genre.id)));
  }, [favouriteGenres]);

  // Fetch 10 movies of the genre on mounted
  useEffect(() => {
    const fetchGenreMovies = async () => {
      try {
        const filters = {
          genres: String(genre.id),
          regions: "",
          years: ""
        };

        const response = await fetchMovies(1, 10, filters);
        setMovies(response.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchGenreMovies();
  }, [fetchMovies]);

  const handleCardClick = () => {
    onCardClicked(!selected, genre);
    setSelected(!selected, genre);
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
