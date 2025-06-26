import "../directory/MovieCard";
import { useNavigate } from "react-router-dom";
import { IoTime } from "react-icons/io5";
import ReviewStars from "../directory/ReviewStars";
import LikeIcon from "../directory/LikeIcon";
import AddToWatchlistIcon from "../directory/AddToWatchlistIcon";
import usePreviousScrollStore from "../../store/usePreviousScrollStore";

const GenreCard = ({ movie, rank = 1, genre }) => {
  const navigate = useNavigate();
  const { setPreviousScrollPosition } = usePreviousScrollStore();

  const title = movie.title;
  const rating = Number(movie.rating === 0 ? 0 : movie.rating.toFixed(1));
  const duration = movie.duration === "0h 0min" ? "To Be Announced" : movie.duration;

  const handleCardClick = () => {
    setPreviousScrollPosition(window.scrollY);
    navigate(`/movie/${movie._id}`);
  };

  return (
    <div className="genre-card-ranking" onClick={handleCardClick}>
      <div className="genre-card-header">
        <h3>Top {rank}</h3>
        <div className="genre-rating-value">
          {rating === 0 ? 0 : rating.toFixed(1)}
        </div>
      </div>

      <div className="genre-card-body">
        <img src={movie.posterUrl} alt={title} className="genre-poster" />
        <div className="genre-info">
          <h4 className="genre-title">{title}</h4>
          <div className="rating-bar">
            <ReviewStars rating={rating} readOnly={true} />
          </div>
          <div className="tags">
            <span className="badge">{genre}</span>
            <span className="badge">{movie.region}</span>
            <span className="badge">{movie.year}</span>
          </div>
          <div className="duration-like">
            <span className="badge-duration">
              <span className="badge-duration-icon">
                <IoTime />
              </span>
              {duration}
            </span>
            <LikeIcon movie={movie} />
            <AddToWatchlistIcon movie={movie} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenreCard;
