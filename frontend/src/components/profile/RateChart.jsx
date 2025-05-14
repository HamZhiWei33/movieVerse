import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { getRatesObject } from "./overview.js";
import useIsMobile from "../../store/useIsMobile";

Chart.register(ArcElement, Tooltip, Legend);

const RateChart = ({ userId }) => {
  const isMobile = useIsMobile();

  const genreStats = getRatesObject(userId) || [];
  const totalCount = genreStats.reduce((sum, item) => sum + item.count, 0);

  const chartData = {
    labels: genreStats.map(
      (item) =>
        `${item.genre} (${Math.round((item.count / totalCount) * 100)}%)`
    ),
    datasets: [
      {
        label: "Liked Genres",
        data: genreStats.map((item) => item.count),
        backgroundColor: [
          "rgba(0, 114, 114, 0.88)",
          "rgba(0, 171, 171, 0.88)",
          "rgba(206, 255, 255, 0.88)",
          "rgba(109, 229, 201, 0.88)",
          "rgba(65, 197, 166, 0.88)",
          "rgba(65, 188, 197, 0.88)",
          "rgba(53, 127, 170, 0.88)",
          "rgba(5, 68, 146, 0.88)",
          "rgba(14, 52, 99, 0.88)",
          "rgba(5, 68, 146, 0.88)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: isMobile ? "bottom" : "right",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          boxHeight: isMobile ? 5 : 10,
          boxWidth: 10,
          padding: isMobile ? 8 : 20,
          color: "white",
          font: {
            size: isMobile ? 10 : 14,
            // weight: "bold",
            color: "white",
          },
          maxHeight: isMobile ? 60 : 300,
          maxWidth: isMobile ? undefined : 120,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            const percentage = Math.round((value / totalCount) * 100);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
      datalabels: {
        color: "#fff",
        formatter: (value) => {
          const percentage = ((value / totalCount) * 100).toFixed(1);
          return `${percentage}%`;
        },
        font: {
          weight: "bold",
          size: isMobile ? 8 : 14,
        },
      },
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 2000,
        easing: "easeOutBounce",
        delay: 500,
      },
      hover: {
        mode: "nearest",
        intersect: true,
      },
      transitions: {
        active: {
          duration: 2000,
        },
      },
    },
    cutout: isMobile ? "40%" : "60%",
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "800px",
        margin: "0 auto",
        padding: isMobile ? "0.5rem" : "3rem",
        boxSizing: "border-box",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "20px",
          color: "#fff",
          fontSize: isMobile ? "1rem" : "1.5rem",
          fontWeight: "bold",
        }}
      >
        Rating
      </h2>
      <div
        style={{
          height: isMobile ? "350px" : "400px",
          position: "relative",
        }}
      >
        <Doughnut
          data={chartData}
          options={chartOptions}
          style={{
            width: "100%",
            height: isMobile ? "300px" : "100%",
          }}
        />
      </div>
    </div>
  );
};

export default RateChart;
