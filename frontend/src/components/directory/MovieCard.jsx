import "../../styles/directory/MovieCard.css";
import { useNavigate } from "react-router-dom";
import LikeIcon from "./LikeIcon";
import AddToWatchlistIcon from "./AddToWatchlistIcon";
import usePreviousScrollStore from "../../store/usePreviousScrollStore";

const MovieCard = ({ movie, children }) => {
  const { setPreviousScrollPosition } = usePreviousScrollStore();
  const navigate = useNavigate();

  const handleCardClick = () => {
    setPreviousScrollPosition(window.scrollY);
    navigate(`/movie/${movie._id}`);
  };

  return (
    <article className="movie-card" onClick={handleCardClick} style={{ cursor: "pointer" }}>
      <div className="poster-container">
        <img src={movie.posterUrl} alt={`Poster of ${movie.title}`} className="poster-img" />
        <div className="hover-overlay">
          <div className="top-right">
            <span className="rating">
              {movie.rating && movie.rating > 0 ? movie.rating.toFixed(1) : "0"}
            </span>
          </div>
          <div className="bottom-icons" onClick={(e) => e.stopPropagation()}>
            <LikeIcon movie={movie} />
            <AddToWatchlistIcon movie={movie}/>
          </div>
        </div>
      </div>
      <p>{movie.title}</p>
      {children}
    </article>
  );
};

export default MovieCard;