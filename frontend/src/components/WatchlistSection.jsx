import { useState, useEffect } from "react";
import MovieSectionHomePage from "../components/MovieSectionHomePage";

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    // 模拟获取数据，你也可以从 Firebase 或 LocalStorage 获取
    const storedWatchlist = [
      {
        id: 1,
        title: "Alita: Battle Angel",
        image: "/movie/AlitaBattleAngel.png"
      },
      {
        id: 2,
        title: "Interstellar",
        image: "/movie/Interstellar.png"
      }
    ];
    setWatchlist(storedWatchlist);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <h1 className="text-3xl font-bold p-6">My Watchlist</h1>
      <MovieSectionHomePage title="Saved Movies" movies={watchlist} />
    </div>
  );
};

export default WatchlistSection;
