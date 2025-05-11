import React, { useState, memo } from "react";
// import LikeIcon from "./LikeIcon";
// import AddToWatchlistIcon from "./AddToWatchlistIcon";
import "../../styles/general/genre-card.css";
import { movies } from "../../constant";

export const PostersGrid = memo(({ genre }) => {
  const genreMovies = movies.filter((movie) => movie.genre.includes(genre.id));
  const randomMovies = genreMovies
    .sort(() => 0.5 - Math.random()) // Shuffle
    .slice(0, Math.min(4, genreMovies.length)); // Choose

  var moviesCount = randomMovies.length;

  return (
    <div className="posters-container">
      {randomMovies.map((item, index) => (
        <div key={index} style={{ display: "flex" }}>
          {<img className="poster-img" src={item.posterUrl} /> || ""}
        </div>
      ))}
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

const GenreCard = ({ genre, onCardClicked }) => {
  const [selected, setSelected] = useState(false);

  const handleCardClick = () => {
    onCardClicked(!selected);
    setSelected(!selected);
  };

  return (
    <article
      className={`signup-genre-card ${selected ? "selected" : ""}`}
      onClick={handleCardClick}
    >
      <PostersGrid genre={genre} />
      <h3>{genre.name}</h3>
    </article>
  );
};

export default GenreCard;
