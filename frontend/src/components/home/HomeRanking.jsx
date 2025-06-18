import { useState, useEffect, useMemo } from "react";
import "../../styles/ranking.css";
// import {
//   movies as importedMovies,
//   reviews as importedReviews,
//   genres as allGenres,
//   reviews as allReviews,
// } from "../../constant";
import TopMovieSection from "../ranking/TopMovieSection";
import useRankingStore from "../../store/useRankingStore";

const HomeRanking = () => {
  const { rankingReviews, selectedMovie, setSelectedMovie } = useRankingStore();

  // compute rating distribution for selected movie using reviews
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
          // allReviews={importedReviews}
          allReviews={rankingReviews}
          aria-label={`Currently selected movie: ${selectedMovie.title}`}
          showLike={false}
        />
      )}
    </div>
  );
};

export default HomeRanking;
