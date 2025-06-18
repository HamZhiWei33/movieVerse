import "../../styles/home/ranking-card.css";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import RankingGrid from "./RankingGrid";
import { BsFire } from "react-icons/bs";

const RankingCard = ({ genre, isAllGenre = false, topMovies = [] }) => {
  const navigate = useNavigate();
  console.log("RankingCard", genre, isAllGenre, topMovies);

  const genreName = isAllGenre ? "All Genres" : genre.name;
  const handleCardClick = () => {
    if (isAllGenre) {
      navigate("/ranking#genre-ranking-section");
    } else {
      navigate(
        `/ranking?genre=${encodeURIComponent(genreName)}#genre-ranking-section`
      );
    }
  };

  const previewMovie = topMovies[0];

  return (
    <article
      className="home-movie-card"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      aria-label={`Explore top 10 ${genreName} movies`}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleCardClick();
      }}
    >
      <div className="home-poster-container">
        {previewMovie ? (
          <>
            <RankingGrid topMovies={topMovies} isAllGenre />
          </>
        ) : (
          // <img
          //   src={previewMovie.posterUrl}
          //   alt={`Top ${genreName} movie: ${previewMovie.title}`}
          //   className="home-poster-img"
          // />
          <img
            src="/profile/default-movie.png"
            alt="default movie poster"
            className="home-poster-img"
          />
        )}

        {/* Default movie title overlay (always visible) */}
        <div className="movie-title-overlay">
          {previewMovie && (
            <p className="movie-title">
              <BsFire /> {previewMovie.title}
            </p>
          )}
        </div>

        {/* Genre name overlay */}
        <div className="genre-name-overlay">
          <h3>{genreName}</h3>
        </div>

        <div className="hover-overlay">
          <div className="home-hover-bottom">
            <div className="hover-left">
              <div className="home-hover-left">Top 10 in</div>
              <h3>{genreName}</h3>
            </div>
            <span className="hover-right home-icon-arrow">
              <FaArrowRight aria-hidden="true" />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default RankingCard;