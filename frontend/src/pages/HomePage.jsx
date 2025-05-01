import HeroBanner from "../components/home/HeroBanner";
// import MovieSectionHomePage from "../components/home/MovieSectionHomePage";
import "../styles/home.css";
import "swiper/css";
import "swiper/css/navigation";
import HeroSection from "../components/home/HeroSection";
import { getMovieObject } from "../components/home/watchlist.js";
import { recentMovies } from "../components/home/newReleased.js";
import { genres, movies } from "../constant";
import { useMemo } from "react";
import HomeRanking from "../components/home/HomeRanking.jsx";
import { UserValidationContext } from "../context/UserValidationProvider .jsx";
import { useContext, useEffect } from "react";
import RecommendationSection from "../components/home/RecommendationSection.jsx";
const HomePage = () => {
  const userId = "U1";
  const { isValidateUser } = useContext(UserValidationContext);
  const watchlist = getMovieObject(userId);

  useEffect(() => {
    if (!isValidateUser) {
      const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        alert("Please log in to have a better experience.");
      };

      const wrapper = document.querySelector(".homePageWrapper");
      if (wrapper) {
        wrapper.addEventListener("click", handleClick, true); // Capture phase
      }

      return () => {
        if (wrapper) {
          wrapper.removeEventListener("click", handleClick, true);
        }
      };
    }
  }, [isValidateUser]);
  return (
    <div className="homePageWrapper">
      {isValidateUser ? <HeroBanner /> : <HomeRanking />}
      <HeroSection
        title="Watchlist"
        moviesType={"watchlist"}
        items={watchlist}
      />

      <HeroSection title="Ranking" moviesType={"ranking"} items={genres} />
      <HeroSection
        title="New Released"
        moviesType={"newReleased"}
        items={recentMovies}
      />
      <RecommendationSection
        title="Recommendation"
        moviesType={"recommendation"}
        items={movies}
      />
    </div>
  );
};

export default HomePage;
