import { useState, useEffect } from "react";
import GenreRankingSection from "../components/GenreRankingSection";
import GenreDonutChart from "../components/GenreDonutChart";
import "../styles/ranking.css";
import TopMovieSection from "../components/TopMovieSection";


const RankingPage = () => {
  const [movies, setMovies] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL || "/";
    const data = [
      {
        id: 1,
        title: "Stranger Things Season 3",
        image: `${baseUrl}movie/StrangerThingsSeason3.png`,
        rating: 4.5,
        description: "A thrilling season of Stranger Things...",
        distribution: { 5: 60, 4: 20, 3: 10, 2: 5, 1: 5 },
        genre: "Sci-Fi",
      },
      {
        id: 2,
        title: "Parasite",
        image: `${baseUrl}movie/parasite.png`,
        rating: 4.8,
        description: "A dark comedy thriller from South Korea...",
        distribution: { 5: 70, 4: 15, 3: 10, 2: 3, 1: 2 },
        genre: "Drama",
      },
      {
        id: 3,
        title: "Avatar",
        image: `${baseUrl}movie/Avatar.png`,
        rating: 4.7,
        description: "A visually stunning sci-fi adventure...",
        distribution: { 5: 65, 4: 20, 3: 10, 2: 3, 1: 2 },
        genre: "Sci-Fi",
      },
    ];

    const genreCount = data.reduce((acc, movie) => {
      acc[movie.genre] = (acc[movie.genre] || 0) + 1;
      return acc;
    }, {});
  
    const generatedChartData = Object.entries(genreCount).map(([genre, count]) => ({
      genre,
      value: count,
    }));
    
    const sortedMovies = [...data].sort((a, b) => b.rating - a.rating);

    setMovies(sortedMovies);
    setSelectedMovie(sortedMovies[0]);
    setChartData(generatedChartData); 
  }, []);

  const sideMovies = movies.filter((m) => m.id !== selectedMovie?.id);
  
  const ratingDistribution = selectedMovie?.distribution || {};

  return (
    <div className="page-wrapper">
      {selectedMovie && (
        <TopMovieSection
          selectedMovie={selectedMovie}
          sideMovies={sideMovies}
          setSelectedMovie={setSelectedMovie}
          ratingDistribution={ratingDistribution}
        />
      )}
  
      <main className="ranking-page">
        <GenreRankingSection movies={movies} />
      </main>

      <div>
      <h2 className="chart-title">Genre Distribution</h2>
      <div>
      <GenreDonutChart data={chartData} />
      </div>
    </div>

      
    </div>
  );
  
};

export default RankingPage;
