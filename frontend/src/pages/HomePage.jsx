import HeroBanner from "../components/home/HeroBanner";
// import MovieSectionHomePage from "../components/home/MovieSectionHomePage";
import "../styles/home.css";
import "swiper/css";
import "swiper/css/navigation";
import HeroSection from "../components/home/HeroSection";
// import { getMovieObject } from "../components/home/watchlist.js";
// import { recentMovies } from "../components/home/newReleased.js";
import { genres, movies } from "../constant";
import HomeRanking from "../components/home/HomeRanking.jsx";
import { UserValidationContext } from "../context/UserValidationProvider .jsx";
import { useContext, useEffect, useState } from "react";
import RecommendationSection from "../components/home/RecommendationSection.jsx";
import useScrollToHash from "../store/useScrollToHash.js";
import useGuestUser from "../store/useGuestUser.js";
import { useAuthStore } from "../store/useAuthStore.js";
import useWatchlistStore from "../store/useWatchlistStore.js";
import axios from "axios";

const HomePage = () => {
  // const userId = "U1";
  // const { isValidateUser } = useContext(UserValidationContext);
  // const watchlist = getMovieObject(userId);
  const { authUser } = useAuthStore();
  const { watchlist, setWatchlist } = useWatchlistStore();
  const [newReleased, setNewReleased] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // // Fetch watchlist movies
  // useEffect(() => {
  //   fetchWatchlist();
  // }, []);

  // Fetch data for home sections
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use the correct API endpoint
        const response = await axios.get("/home");

        console.log("✅ HomePage data from backend:", response.data);

        if (response.data.success) {
          const data = response.data.data;
          
          // Set the fetched data
          setNewReleased(data.newReleases || []);
          setRecommendations(data.recommendations || []);
          
          // Only set watchlist if user is authenticated and data exists
          if (authUser && data.watchlist) {
            setWatchlist(data.watchlist);
          }
        } else {
          throw new Error(response.data.message || 'Failed to fetch data');
        }
      } catch (error) {
        console.error("Error fetching home data:", error);
        setError(error.response?.data?.message || error.message || 'Failed to fetch home data');
        
        // Set empty arrays as fallback
        setNewReleased([]);
        setRecommendations([]);

        if (error.response) {
    console.error("Status:", error.response.status);
    console.error("Data:", error.response.data);
  }

      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [authUser, setWatchlist]);


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
          items={newReleased}
        />
        
        <HeroSection
          title="Recommendation"
          moviesType={"recommendation"}
          items={recommendations}
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
