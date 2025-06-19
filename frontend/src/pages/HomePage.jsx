import HeroBanner from "../components/home/HeroBanner";
// import MovieSectionHomePage from "../components/home/MovieSectionHomePage";
import "../styles/home.css";
import "swiper/css";
import "swiper/css/navigation";
import HeroSection from "../components/home/HeroSection";
import { getMovieObject } from "../components/home/watchlist.js";
import { recentMovies } from "../components/home/newReleased.js";
import HomeRanking from "../components/home/HomeRanking.jsx";
import { UserValidationContext } from "../context/UserValidationProvider .jsx";
import { useContext, useEffect, useMemo } from "react";
import RecommendationSection from "../components/home/RecommendationSection.jsx";
import useScrollToHash from "../store/useScrollToHash.js";
import useGuestUser from "../store/useGuestUser.js";
import { useAuthStore } from "../store/useAuthStore.js";
import useWatchlistStore from "../store/useWatchlistStore.js";
import useGenreStore from "../store/useGenreStore";
import useMovieStore from "../store/useMovieStore";
import useRankingStore from "../store/useRankingStore";
import { useLocation } from "react-router-dom";
const HomePage = () => {
  // const userId = "U1";
  // const { isValidateUser } = useContext(UserValidationContext);
  // const watchlist = getMovieObject(userId);
  const location = useLocation();
  const { authUser } = useAuthStore();
  const { rankingMovies, fetchRankingData } = useRankingStore();
  const {
    movies: storeMovies,
    recommendedMovies,
    getRecommendedMovies,
    watchlist,
    fetchWatchlist,
    randomRecommendedMovies,
  } = useMovieStore();
  // const { watchlist, fetchWatchlist } = useWatchlistStore();
  const { genreMap, fetchGenres } = useGenreStore();

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
    // fetchGenres();
    // if(authUser && recommendedMovies.length < 50) {
    //   getRecommendedMovies();
    // }
  }, [authUser]);

  useEffect(() => {
    // if(authUser) {
    //   fetchWatchlist();
    // }
    fetchGenres();
  }, []);

  const genres = useMemo(() => {
    if (Object.keys(genreMap).length > 0) {
      return Object.entries(genreMap).map(([id, name]) => ({ id, name }));
    }
    return [];
  }, [genreMap]);

  // useEffect(() => {
  //   console.log(genres);
  // }, [genres]);

  useScrollToHash();
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1); // Remove '#' from hash
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 500); // Delay ensures DOM is mounted
      }
    }
  }, [location]);
  useGuestUser(authUser);

  return (
    <div
      className="homePageWrapper"
      role="main"
      aria-label="MovieVerse home page"
    >
      {authUser ? <HeroBanner /> : <HomeRanking />}

      <div className="hero-section-container">
        {authUser && (
          <HeroSection
            title="Watchlist"
            moviesType={"watchlist"}
            items={watchlist}
          />
        )}

        <HeroSection title="Ranking" moviesType={"ranking"} items={genres} />

        <HeroSection
          title="New Released"
          moviesType={"newReleased"}
          items={recentMovies}
        />

        <HeroSection
          title="Recommendation"
          moviesType={"recommendation"}
          items={
            authUser && authUser.favouriteGenres?.length >= 3
              ? randomRecommendedMovies
              : rankingMovies
          }
        />

        {/* <RecommendationSection
              title="Recommendation"
              moviesType={"recommendation"}
              items={movies}
            /> */}
      </div>
    </div>
  );
};

export default HomePage;
