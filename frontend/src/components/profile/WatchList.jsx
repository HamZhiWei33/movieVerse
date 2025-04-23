import { useNavigate } from "react-router-dom";
import ReviewStars from "../directory/ReviewStars";
import { IoTime } from "react-icons/io5";
import { GoHeartFill } from "react-icons/go";
import "../../styles/profile/watchlist.css";
import { getGenreNamebyId, convertDuration } from "./watchlist.js";

const WatchList = ({
  movie,
  showRatingNumber = false,
  showBottomInteractiveIcon = false,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/movie/${encodeURIComponent(movie.title)}`, {
      state: { movieData: movie }, // Pass entire movie object
    });
  };

  return (
    <article
      id="watchlist"
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      <div className="movie-card-list">
        <div className="poster-container-list">
          <img
            src={movie.posterUrl}
            alt={`Poster of ${movie.title}`}
            className="poster-img-list"
          />
        </div>
        <div className="movie-details-container-list">
          <h3>{movie.title}</h3>
          <ReviewStars
            rating={movie.rating}
            readOnly={true}
            showNumber={true}
          />
          <div className="genre-tags">
            {movie.genre.map((genre, index) => (
              <span key={index} className="genre-tag">
                {getGenreNamebyId(genre)}
              </span>
            ))}
          </div>
          <div id="watchlist-duration-and-icons-container">
            <div className="duration-tag">
              <span className="duration-icon">
                <IoTime />
              </span>
              {convertDuration(movie.duration)}
            </div>
            <div className="like-tag">
              <span className="like-icon">
                <GoHeartFill />
              </span>
              {movie.likes}
            </div>
          </div>
        </div>
        <div className="remove-watchlist-container">
          <button className="remove-watchlist-btn">Remove</button>
        </div>
      </div>
    </article>
  );
};

export default WatchList;
