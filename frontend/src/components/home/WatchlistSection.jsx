import { useState, useEffect } from "react";
import MovieCardHomePage from "./MovieCardHomePage";
import MovieSectionHomePage from "./MovieSectionHomePage";

const WatchlistSection = () => {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {

    const storedWatchlist = [
      {
        id: 1,
        title: "Alita: Battle Angel",
        image: "/movie/AlitaBattleAngel.png",
        genre: ["Action", "Sci-Fi"],
        rating: 8.0,
        duration: "2h 2m",
        description: "A story of a young cyborg..."
      },
      {
        id: 2,
        title: "Interstellar",
        image: "/movie/Interstellar.png",
        genre: ["Adventure", "Drama", "Sci-Fi"],
        rating: 8.6,
        duration: "2h 49m",
        description: "A team of explorers travel..."
      }
    ];
    setWatchlist(storedWatchlist);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-4">My Watchlist</h1>
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
        {watchlist.map((movie) => (
          <MovieCardHomePage key={movie.id} movie={movie} />
        ))}
      </div>
    </div>

  );
};

export default WatchlistSection;
