import { useMemo } from "react";
import "../../styles/ranking.css";
import TopMovieSection from "../ranking/TopMovieSection";
import useRankingStore from "../../store/useRankingStore";
import CatLoading from "../general/CatLoading";

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
      {selectedMovie ? (
        <TopMovieSection
          selectedMovie={selectedMovie}
          setSelectedMovie={setSelectedMovie}
          ratingDistribution={ratingDistribution}
          allReviews={rankingReviews}
          showLike={false}
        />
      ) : (
        <div className="loading" id="loading-spinner">
          <CatLoading />
        </div>
      )}
    </div>
  );
};

export default HomeRanking;
