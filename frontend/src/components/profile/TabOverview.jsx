import React from "react";
import ReviewChart from "./ReviewChart";
import ReviewGenreChart from "./ReviewGenreChart";
import LikesChart from "./LikesChart";
import RateChart from "./RateChart";
import WatchlistChart from "./WatchlistChart";
import { useAuthStore } from "../../store/useAuthStore";
// import "../../styles/profile/tab.css";

const TabOverview = () => {
  const { authUser } = useAuthStore();
  const userId = authUser?._id;
  return (
    <div className="overview-container">
      <div className="chart-grid">
        <div className="chart chart-1">
          <LikesChart userId={userId} />
        </div>
        <div className="chart chart-2">
          <RateChart userId={userId} />
        </div>
        <div className="chart chart-3">
          <WatchlistChart userId={userId} />
        </div>
      </div>
    </div>
  );
};

export default TabOverview;
