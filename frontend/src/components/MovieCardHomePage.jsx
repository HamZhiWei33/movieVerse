// components/home/MovieCardHomePage.jsx
import { useNavigate } from "react-router-dom";
import "./directory/MovieCard";"../components/styles/MovieCardHomePage.css";

function MovieCardHomePage({ movie }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/movie/${encodeURIComponent(movie.title)}`, {
      state: { movieData: movie }
    });
  };

  return (
    <div className="movie-card-home" onClick={handleClick}>
      <div className="image-container">
        <img src={movie.image} alt={movie.title} className="poster-img" />
      </div>
      <div className="movie-title">{movie.title}</div>
    </div>
  );
}

export default MovieCardHomePage;
