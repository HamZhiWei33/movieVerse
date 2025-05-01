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

const HomePage = () => {
  const userId = "U1";
  const watchlist = getMovieObject(userId);

  return (
    <div className="homePageWrapper">
      <HeroBanner />
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
      <HeroSection
        title="Recommendation"
        moviesType={"recommendation"}
        items={movies}
      />
      {/* <MovieSectionHomePage
        title="Watchlist"
        movies={watchlistMovies}
        link="/watchlist"
      /> */}

      {/* <MovieSectionHomePage title="Ranking" movies={rankingMovies} link="/ranking" />
      <MovieSectionHomePage title="New Released" movies={newReleasedMovies} link="/directory/new" />
      <MovieSectionHomePage title="Recommendation" movies={recommendationMovies} link="/recommendation" /> */}
    </div>
  );
};

export default HomePage;