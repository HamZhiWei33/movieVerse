import { useState, useEffect, useMemo } from "react";
import GenreRankingSection from "../components/ranking/GenreRankingSection";
import GenreDonutChart from "../components/ranking/GenreDonutChart";
import "../styles/ranking.css";
import { movies as importedMovies, reviews as importedReviews, genres as allGenres  } from "../constant";
import TopMovieSection from "../components/ranking/TopMovieSection";

  const RankingPage = () => {
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
  
    useEffect(() => {
      // Compute a composite score: 80% rating + 20% recency (based on year)
      const sorted = [...importedMovies]
        .map((movie) => ({
          ...movie,
          compositeScore: movie.rating * 0.8 + (movie.year - 2000) * 0.02,
        }))
        .sort((a, b) => b.compositeScore - a.compositeScore);
  
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
      return Object.entries(genreCount).map(([genre, value]) => ({ genre, value }));
    }, [movies]); 

  return (
    <div className="page-wrapper">
      {selectedMovie && (
        <TopMovieSection
          selectedMovie={selectedMovie}
          setSelectedMovie={setSelectedMovie}
          ratingDistribution={ratingDistribution}
        />
      )}
  
      <main className="ranking-page">
        <GenreRankingSection movies={movies} allGenres={allGenres}/>
      </main>

      <div>
      <h2 className="chart-title">Genre Distribution</h2>
      <div>
      <GenreDonutChart data={chartData} />
      </div>
    </div>

      
    </div>
  );
  
};

export default RankingPage;
