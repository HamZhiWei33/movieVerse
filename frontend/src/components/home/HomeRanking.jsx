import { useState, useEffect, useMemo } from "react";
import "../../styles/ranking.css";
import {
  movies as importedMovies,
  reviews as importedReviews,
  genres as allGenres,
  reviews as allReviews,
} from "../../constant";
import TopMovieSection from "../ranking/TopMovieSection";

const HomeRanking = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const calculateAverageRating = (movieId) => {
    if (!Array.isArray(importedReviews) || importedReviews.length === 0)
      return 0;

    const selectedReviews = importedReviews.filter(
      (r) => r.movieId === movieId
    );

    const validRatings = selectedReviews
      .map((r) => Number(r.rating))
      .filter((r) => !isNaN(r));

    if (validRatings.length === 0) return 0;

    const sum = validRatings.reduce((acc, rating) => acc + rating, 0);
    const average = sum / validRatings.length;

    return parseFloat(average.toFixed(1));
  };

  useEffect(() => {
    // Compute a composite score: 80% rating + 20% recency (based on year)
    const sorted = [...importedMovies]
      .map((movie) => ({
        ...movie,
        compositeScore:
          calculateAverageRating(movie.id) * 0.9 + (movie.year - 2000) * 0.1,
      }))
      .sort((a, b) => {
        if (b.compositeScore === a.compositeScore) {
          return a.id.localeCompare(b.id);
        }
        return b.compositeScore - a.compositeScore;
      });

    setMovies(sorted);
    setSelectedMovie(sorted[0] || null);
  }, []);

  // compute rating distribution for selected movie using reviews
  const ratingDistribution = useMemo(() => {
    if (!selectedMovie) return {};
    // initialize counts for ratings 1-5
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    importedReviews.forEach(({ movieId, rating }) => {
      if (movieId === selectedMovie.id && dist[rating] !== undefined) {
        dist[rating]++;
      }
    });
    return dist;
  }, [selectedMovie]);

  // build genre chart data from movie genres
  const chartData = useMemo(() => {
    const genreCount = {};
    movies.forEach((movie) => {
      movie.genre.forEach((gid) => {
        const genreObj = allGenres.find((g) => g.id === gid);
        if (genreObj) {
          genreCount[genreObj.name] = (genreCount[genreObj.name] || 0) + 1;
        }
      });
    });
    return Object.entries(genreCount).map(([genre, value]) => ({
      genre,
      value,
    }));
  }, [movies]);

  return (
    <div
      className="page-wrapper"
      role="region"
      aria-label="Top rated movie ranking section"
    >
      {selectedMovie && (
        <TopMovieSection
          selectedMovie={selectedMovie}
          setSelectedMovie={setSelectedMovie}
          ratingDistribution={ratingDistribution}
          allReviews={importedReviews}
          aria-label={`Currently selected movie: ${selectedMovie.title}`}
        />
      )}
    </div>
  );
};

export default HomeRanking;
