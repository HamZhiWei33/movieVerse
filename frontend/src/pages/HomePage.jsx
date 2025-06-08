import HeroBanner from "../components/home/HeroBanner";
// import MovieSectionHomePage from "../components/home/MovieSectionHomePage";
import "../styles/home.css";
import "swiper/css";
import "swiper/css/navigation";
import HeroSection from "../components/home/HeroSection";
import { getMovieObject } from "../components/home/watchlist.js";
import { recentMovies } from "../components/home/newReleased.js";
import { genres, movies } from "../constant";
import HomeRanking from "../components/home/HomeRanking.jsx";
import { UserValidationContext } from "../context/UserValidationProvider .jsx";
import { useContext, useEffect } from "react";
import RecommendationSection from "../components/home/RecommendationSection.jsx";
import useScrollToHash from "../store/useScrollToHash.js";
import useGuestUser from "../store/useGuestUser.js";
import { useAuthStore } from "../store/useAuthStore.js";
import useWatchlistStore from "../store/useWatchlistStore.js";
const HomePage = () => {
  // const userId = "U1";
  // const { isValidateUser } = useContext(UserValidationContext);
  // const watchlist = getMovieObject(userId);
  const { authUser } = useAuthStore();
  const { watchlist, fetchWatchlist } = useWatchlistStore();

  // Fetch watchlist movies
  useEffect(() => {
    fetchWatchlist();
  }, []);

  useScrollToHash();

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
          items={movies}
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
