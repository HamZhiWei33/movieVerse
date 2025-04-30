import HeroBanner from "../components/HeroBanner";
// import MovieSectionHomePage from "../components/MovieSectionHomePage";
import "../styles/home.css";
import "swiper/css";
import "swiper/css/navigation";


const watchlistMovies = [
  { id: 1, title: "Stranger Things Season 3", image: "./frontend/public/movie/stranger_things_season_3.png" },
  { id: 2, title: "Avatar", image: "./frontend/public/movie/Avatar.png" },
];


const rankingMovies = [
  { title: "Joker", image: "/images/joker.jpg", rating: 4.9 },
  { title: "Interstellar", image: "/images/interstellar.jpg", rating: 4.8 },
];

const newReleasedMovies = [
  { title: "Flow", image: "/frontend/public/movie/flow.jpg", rating: 4.0 },
  { title: "The Assistant", image: "/frontend/public/movie/assistant.jpg", rating: 3.8 },
];

const recommendationMovies = [
  { title: "Black Panther", image: "/frontend/public/movie/panther.jpg", rating: 4.6 },
  { title: "Endgame", image: "/frontend/public/movie/alive.jpg", rating: 4.9 },
];

const HomePage = () => {
  return (
    <div className="homePageWrapper">
      
      <HeroBanner/>
      {/* <MovieSectionHomePage title="Watchlist" movies={watchlistMovies} link="/watchlist"/> 
      
      //currently not working, still need to fix */}
      {/* <MovieSectionHomePage title="Ranking" movies={rankingMovies} link="/ranking" />
      <MovieSectionHomePage title="New Released" movies={newReleasedMovies} link="/directory/new" />
      <MovieSectionHomePage title="Recommendation" movies={recommendationMovies} link="/recommendation" /> */}
    </div>
  );
};

export default HomePage;
