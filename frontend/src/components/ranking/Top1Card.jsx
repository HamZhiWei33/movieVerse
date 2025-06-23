import "../directory/MovieCard";
import { useNavigate } from "react-router-dom";
import { IoTime } from "react-icons/io5";
import ReviewStars from "../directory/ReviewStars";
import LikeIcon from "../directory/LikeIcon";
import AddToWatchlistIcon from "../directory/AddToWatchlistIcon";
import usePreviousScrollStore from "../../store/usePreviousScrollStore";

const Top1Card = ({ movie, genre }) => {
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
    <div className="top1-card" onClick={handleCardClick} style={{ cursor: "pointer" }}>
      <div className="genre-card-header">
        <h3>Top 1</h3>
        <div className="genre-rating-value">
          {rating}
        </div>
      </div>

      <div className="genre-card-body">
        <img src={movie.posterUrl} alt={`Poster of ${title}`} className="top1-image" />
      </div>
      <div className="genre-info">
        <h4 className="genre-title">{title}</h4>
        <div className="rating-bar">
          <ReviewStars rating={rating} readOnly={true} size="medium" />
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
            {duration === "0h 0min"
              ? "To Be Announced"
              : duration}
          </span>
          <LikeIcon movie={movie} />
          <AddToWatchlistIcon movie={movie} />
        </div>
        <p className="top1-description">{movie.description}</p>
      </div>
    </div>
  );
};

export default Top1Card;
