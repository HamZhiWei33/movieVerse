// components/GenreRankingSection.jsx
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import GenreCard from "./GenreCard";
import Top1Card from "./Top1Card";
import { useSearchParams, useLocation } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
const GenreRankingSection = ({
  movies = [],
  allGenres = [],
  allReviews = [],
}) => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    movies: [],
    reviews: [],
    genres: [],
  });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Get genre from URL or default to "All"
  const urlGenre = searchParams.get("genre");

  // Modified genreOptions to use allGenres prop and sort alphabetically
  const genreOptions = useMemo(() => {
    const genres = Array.isArray(allGenres) ? allGenres : [];
    const sortedGenres = genres
      .map((genre) => genre.name)
      .sort((a, b) => a.localeCompare(b));

    return ["All", ...sortedGenres];
  }, [allGenres]);

  const [selectedGenre, setSelectedGenre] = useState("All");

  // Update selectedGenre when URL changes
  useEffect(() => {
    if (urlGenre && genreOptions.includes(urlGenre)) {
      setSelectedGenre(urlGenre);
    } else {
      setSelectedGenre("All");
    }
  }, [urlGenre, genreOptions]);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Fetching data for genre:", selectedGenre); // Debug log

        const response = await axios.get(
          "http://localhost:5001/api/rankings/genres",
          {
            params: { genre: selectedGenre },
          }
        );

        console.log("Received data:", response.data); // Debug log

        if (!response.data) {
          throw new Error("No data received from server");
        }

        setData({
          movies: response.data.movies || [],
          reviews: response.data.reviews || [],
          genres: response.data.genres || [],
        });
        setError(null);
      } catch (err) {
        console.error("Error fetching rankings:", err);
        setError(`Failed to load rankings: ${err.message}`);
        setData({
          movies: [],
          reviews: [],
          genres: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedGenre]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Scroll to section when component mounts or hash changes
  useEffect(() => {
    if (location.hash === "#genre-ranking-section") {
      setTimeout(() => {
        const element = document.getElementById("genre-ranking-section");
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 2000); // Small delay to ensure DOM is ready
    }
  }, [location.hash]);

  const sorted = useMemo(() => {
    if (!Array.isArray(movies)) return [];

    return movies
      .filter((movie) => {
        if (selectedGenre === "All") return true;

        // Find the genre ID for the selected genre name
        const selectedGenreId = allGenres.find(
          (g) => g.name === selectedGenre
        )?.id;

        // Check if the movie has this genre ID
        return selectedGenreId && movie.genre.includes(selectedGenreId);
      })
      .sort((a, b) => {
        // Sort by rating directly from database
        const ratingDiff = b.rating - a.rating;
        if (ratingDiff !== 0) return ratingDiff;
        // If ratings are equal, sort by year
        return b.year - a.year;
      })
      .slice(0, 10); // Limit to 10 movies
  }, [movies, selectedGenre, allGenres]);

  const [top1, ...otherMovies] = sorted;

  if (loading)
    return (
      <div className="loading" id="spinner">
        Loading rankings...
      </div>
    );
  if (error) return <div className="error">{error}</div>;

  // Update the genre mapping in the cards to use allGenres
  const getGenreName = (genreId) => {
    const genre = allGenres.find((g) => g.id === genreId);
    return genre?.name || "";
  };

  return (
    <section className="genre-ranking-section" id="genre-ranking-section">
      <h2 className="genre-ranking-section-header">Order by Genre</h2>

      <nav className="genre-nav">
        {genreOptions.map((genre) => (
          <button
            key={genre}
            className={`genre-tab ${selectedGenre === genre ? "active" : ""}`}
            onClick={() => setSelectedGenre(genre)}
          >
            {genre}
          </button>
        ))}
      </nav>

      <div className="genre-list">
        {!sorted.length ? (
          <div className="no-movies">No movies available for this genre</div>
        ) : (
          <div className="genre-ranking-layout">
            {top1 && windowWidth >= 1200 && (
              <Top1Card
                movie={top1}
                genre={top1.genre.map(getGenreName).filter(Boolean).join(", ")}
              />
            )}

            <div className="right-cards">
              {top1 && windowWidth < 1200 && (
                <GenreCard
                  key={top1._id}
                  movie={top1}
                  rank={1}
                  genre={top1.genre.map(getGenreName).filter(Boolean).join(", ")}
                />
              )}
              {otherMovies.map((movie, index) => (
                <GenreCard
                  key={movie._id}
                  movie={movie}
                  rank={index + 2}
                  genre={movie.genre.map(getGenreName).filter(Boolean).join(", ")}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// Add prop types for better type checking
GenreRankingSection.defaultProps = {
  movies: [],
  allGenres: [],
  allReviews: [],
};

export default GenreRankingSection;
