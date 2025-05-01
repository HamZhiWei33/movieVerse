import HeroBanner from "../components/home/HeroBanner";
// import MovieSectionHomePage from "../components/home/MovieSectionHomePage";
import "../styles/home.css";
import "swiper/css";
import "swiper/css/navigation";
import HeroSection from "../components/home/HeroSection";
import { getMovieObject } from "../components/home/watchlist.js";
import { recentMovies } from "../components/home/newReleased.js";
import { genres } from "../constant";
import { useMemo } from "react";
const watchlistMovies = [
  {
    id: 1,
    title: "Stranger Things Season 3",
    image: "/movie/stranger_things_season_3.png",
  },
  { id: 2, title: "Avatar", image: "/movie/Avatar.png" },
];

const rankingMovies = [
  { title: "Joker", image: "/images/joker.jpg", rating: 4.9 },
  { title: "Interstellar", image: "/images/interstellar.jpg", rating: 4.8 },
];

const newReleasedMovies = [
  { title: "Flow", image: "/frontend/public/movie/flow.jpg", rating: 4.0 },
  {
    title: "The Assistant",
    image: "/frontend/public/movie/assistant.jpg",
    rating: 3.8,
  },
];

const recommendationMovies = [
  {
    title: "Black Panther",
    image: "/frontend/public/movie/panther.jpg",
    rating: 4.6,
  },
  { title: "Endgame", image: "/frontend/public/movie/alive.jpg", rating: 4.9 },
];

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
