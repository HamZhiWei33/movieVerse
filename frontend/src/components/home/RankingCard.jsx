import "../../styles/home/ranking-card.css";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
const RankingCard = ({ genre, isAllGenre = false, topMovies = [] }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (isAllGenre) {
      navigate("/ranking#genre-ranking");
    } else {
      navigate(
        `/ranking?genre=${encodeURIComponent(genre.name)}#genre-ranking`
      );
    }
  };

  const previewMovie = topMovies[0];
  const genreName = isAllGenre ? "All Genres" : genre.name;

  return (
    <article className="home-movie-card" onClick={handleCardClick}>
      <div className="home-poster-container">
        {previewMovie ? (
          <img
            src={previewMovie.posterUrl}
            alt={`Top ${genreName} movie: ${previewMovie.title}`}
            className="home-poster-img"
          />
        ) : (
          <div className="genre-placeholder">{genreName}</div>
        )}

        {/* Default movie title overlay (always visible) */}
        <div className="movie-title-overlay">
          {previewMovie && <p className="movie-title">{previewMovie.title}</p>}
        </div>

        {/* Genre name overlay (visible on hover) */}
        <div className="genre-name-overlay">
          <h3>{isAllGenre ? "All Genres" : genre}</h3>
        </div>

        <div className="hover-overlay">
          <div className="home-hover-bottom">
            <div className="hover-left">
              <div className="home-hover-left">Top 10 in</div>
              <h3>{isAllGenre ? "All Genres" : genre}</h3>
            </div>
            <span className="hover-right home-icon-arrow">
              <FaArrowRight />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default RankingCard;
