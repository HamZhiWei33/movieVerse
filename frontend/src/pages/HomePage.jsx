import "../styles/home.css";
import "swiper/css";
import "swiper/css/navigation";

import { useEffect, useMemo } from "react";

import HeroBanner from "../components/home/HeroBanner";
import HeroSection from "../components/home/HeroSection";
import HomeRanking from "../components/home/HomeRanking";

import useGuestUser from "../store/useGuestUser";
import useScrollToHash from "../store/useScrollToHash";
import { useAuthStore } from "../store/useAuthStore";
import useGenreStore from "../store/useGenreStore";
import useMovieStore from "../store/useMovieStore";
import useRankingStore from "../store/useRankingStore";

const HomePage = () => {
  const { authUser } = useAuthStore();
  const { genreMap, fetchGenres } = useGenreStore();
  const { rankingMovies, fetchRankingData } = useRankingStore();
  const {
    movies,
    recommendedMovies,
    getRecommendedMovies,
    watchlist,
    fetchWatchlist,
    randomRecommendedMovies,
  } = useMovieStore();

  // Scroll to specific section tab when link at footer is clicked
  useScrollToHash(-20);

  // Prevent clicking when user is not logged in
  useGuestUser(authUser);

  useEffect(() => {
    if (Object.keys(genreMap).length <= 0) {
      fetchGenres();
    }
  }, []);

  // Fetch watchlist movies
  useEffect(() => {
    if (authUser) {
      fetchWatchlist();
      if (recommendedMovies.length < 50) {
        getRecommendedMovies();
      }
    } else if (rankingMovies.length === 0) {
      fetchRankingData();
    }
  }, [authUser]);

  const genres = useMemo(() => {
    if (Object.keys(genreMap).length > 0) {
      return Object.entries(genreMap).map(([id, name]) => ({ id, name }));
    }
    return [];
  }, [genreMap]);

  const recentMovies = useMemo(() => {
    const currentDate = new Date();
    const sixMonthsAgo = new Date(currentDate);
    sixMonthsAgo.setMonth(currentDate.getMonth() - 6);
    return movies
      .filter((movie) => {
        const movieDate = new Date(movie.releaseDate);
        return movieDate >= sixMonthsAgo && movieDate <= currentDate;
      })
      .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
  }, [movies]);

  return (
    <div
      className="homePageWrapper"
      role="main"
      aria-label="MovieVerse home page"
    >
      {authUser ? <HeroBanner /> : <HomeRanking />}

      <div className="hero-section-container">
        {authUser && (
          <HeroSection title="Watchlist" moviesType={"watchlist"} items={watchlist} />
        )}

        <HeroSection title="Ranking" moviesType={"ranking"} items={genres} id="ranking"/>

        <HeroSection title="New Released" moviesType={"newReleased"} items={recentMovies} />

        <HeroSection
          title="Recommendation"
          moviesType={"recommendation"}
          items={
            authUser && authUser.favouriteGenres?.length >= 3
              ? randomRecommendedMovies
              : rankingMovies
          }
        />
      </div>
    </div>
  );
};

export default HomePage;