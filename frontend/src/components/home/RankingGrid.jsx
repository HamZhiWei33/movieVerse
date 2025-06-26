import "../../styles/general/genre-card.css";
import React, { memo } from "react";

const RankingGrid = memo(({ topMovies }) => {
  return (
    <div className="posters-container">
      {topMovies.map((item, index) => (
        <div key={index} style={{ display: "flex" }}>
          <img className="poster-img" src={item.posterUrl} alt={item.title} />
        </div>
      ))}
    </div>
  );
});

RankingGrid.displayName = 'RankingGrid';

export default RankingGrid;