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
  allReviews,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/movie/${encodeURIComponent(movie.title)}`, {
      state: { movieData: movie }, // Pass entire movie object
    });
  };

  const handleRemoveClick = (e) => {
    e.stopPropagation();
    alert("Remove from watchlist");
  };

  const calculateAverageRating = () => {
    if (!Array.isArray(allReviews) || allReviews.length === 0) return 0;

    // Filter reviews for this specific movie ID
    const movieReviews = allReviews.filter((review) => review.movieId === movie.id);

    if (movieReviews.length === 0) return 0;

    const validRatings = movieReviews
      .map((r) => Number(r.rating))
      .filter((r) => !isNaN(r));

    if (validRatings.length === 0) return 0;

    const sum = validRatings.reduce((acc, rating) => acc + rating, 0);
    const average = sum / validRatings.length;

    return parseFloat(average.toFixed(1));
  };


  const averageRating = calculateAverageRating();

  return (
    <article id="watchlist" style={{ cursor: "pointer" }}>
      <div className="movie-card-list">
        <div className="poster-container-list">
          <img
            src={movie.posterUrl}
            alt={`Poster of ${movie.title}`}
            className="poster-img-list"
          />
        </div>
        <div className="movie-details-container-list" onClick={handleCardClick}>
          <h3>{movie.title}</h3>
          <ReviewStars
            rating={averageRating}
            readOnly={true}
            showNumber={true}
          />
          <div className="genre-tags">
            {movie.genre.map((genre, index) => (
              <span key={index} className="genre-tag">
                {genre}
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
          <button className="remove-watchlist-btn" onClick={handleRemoveClick}>
            Remove
          </button>
        </div>
      </div>
    </article>
  );
};

export default WatchList;
