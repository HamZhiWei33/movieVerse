import "../styles/ranking.css";
import { useEffect, useMemo } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import GenreRankingSection from "../components/ranking/GenreRankingSection";
import GenreDonutChart from "../components/ranking/GenreDonutChart";
import TopMovieSection from "../components/ranking/TopMovieSection";
import useRankingStore from "../store/useRankingStore";

const RankingPage = () => {
  const {
    rankingMovies,
    rankingReviews,
    rankingGenres,
    selectedMovie,
    fetchRankingData,
    setSelectedMovie,
    rankingLoading,
    rankingError,
  } = useRankingStore();

  useEffect(() => {
    fetchRankingData();
  }, []);

  const ratingDistribution = useMemo(() => {
    if (!selectedMovie || !Array.isArray(rankingReviews)) return {};
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    rankingReviews.forEach(({ movieId, rating }) => {
      if (movieId === selectedMovie._id && dist[rating] !== undefined) {
        dist[rating]++;
      }
    });
    return dist;
  }, [selectedMovie, rankingReviews]);

  const chartData = useMemo(() => {
    if (!Array.isArray(rankingMovies) || !Array.isArray(rankingGenres)) {
      return [];
    }

    const genreCount = {};
    rankingMovies.forEach((movie) => {
      if (Array.isArray(movie.genre)) {
        movie.genre.forEach((genreId) => {
          const genreObj = rankingGenres.find((g) => g.id === genreId);
          if (genreObj) {
            genreCount[genreObj.name] = (genreCount[genreObj.name] || 0) + 1;
          }
        });
      }
    });

    return Object.entries(genreCount).map(([genre, value]) => ({
      genre,
      value,
    }));
  }, [rankingMovies, rankingGenres]);

  if (rankingLoading)
    return (
      <div className="loading" id="loading-spinner">
        <DotLottieReact
          src="https://lottie.host/6185175f-ee83-45a4-9244-03871961a1e9/yLmGLfSgYI.lottie"
          loop
          autoplay
          className="loading-icon"
        />
      </div>
    );
  if (rankingError) return <div className="error">{rankingError}</div>;

  return (
    <div className="page-wrapper">
      {selectedMovie && (
        <TopMovieSection
          selectedMovie={selectedMovie}
          setSelectedMovie={setSelectedMovie}
          ratingDistribution={ratingDistribution}
          allReviews={rankingReviews}
        />
      )}

      <main className="ranking-page">
        <GenreRankingSection
          movies={rankingMovies}
          allGenres={rankingGenres}
          allReviews={rankingReviews}
        />
        <div className="chart-section-container">
          <h2 className="chart-title">Genre Distribution</h2>
          {chartData.length > 0 ? (
            <GenreDonutChart data={chartData} />
          ) : (
            <div className="no-movies">No genre data available</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RankingPage;
