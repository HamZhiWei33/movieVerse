import React from "react";
import ReviewChart from "./ReviewChart";
import ReviewGenreChart from "./ReviewGenreChart";
import LikesChart from "./LikesChart";
import RateChart from "./RateChart";
import WatchlistChart from "./WatchlistChart";
// import "../../styles/profile/tab.css";

const TabOverview = () => {
  return (
    <div className="overview-container">
      <div className="chart-grid">
        <div className="chart chart-1">
          <LikesChart userId="U2" />
        </div>
        <div className="chart chart-2">
          <RateChart userId="U2" />
        </div>
        <div className="chart chart-3">
          <WatchlistChart userId="U2" />
        </div>
      </div>
    </div>
  );
};

export default TabOverview;
