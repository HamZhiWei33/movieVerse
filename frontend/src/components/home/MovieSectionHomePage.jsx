import MovieCardHomePage from "./MovieCardHomePage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function MovieSectionHomePage({ title, movies, link }) {
  const navigate = useNavigate();

  return (
    <section className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
        {link && (
          <button
            onClick={() => navigate(link)}
            className="text-white text-sm hover:underline flex items-center gap-1"
          >
            See All <FontAwesomeIcon icon={faChevronRight} />
          </button>
        )}
      </div>
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
        {movies.map((movie) => (
          <MovieCardHomePage key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}

export default MovieSectionHomePage;