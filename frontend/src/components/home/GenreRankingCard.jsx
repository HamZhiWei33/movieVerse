import { useNavigate } from "react-router-dom";
import "../../styles/home/GenreRankingCard.css";

const GenreRankingCard = ({ genre, movies }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/directory/genre/${genre.toLowerCase()}`);
  };

  return (
    <div className="genre-card" onClick={handleClick} role="button" tabIndex={0} aria-label={`View top 10 ${genre} movies`}>
      <div className="poster-grid">
        {movies.slice(0, 4).map((movie) => (
          <img
            key={movie.id}
            src={movie.image || movie.posterUrl}
            alt={movie.title}
            className="poster-img"
          />
        ))}
      </div>
      <div className="genre-card-footer">
        <span className="badge">Top 10 In</span>
        <span className="genre-name">{genre}</span>
        <span className="arrow" aria-hidden="true">→</span>
      </div>
    </div>
  );
};

export default GenreRankingCard;
