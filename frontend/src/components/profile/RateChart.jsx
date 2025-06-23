import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import useIsMobile from "../../store/useIsMobile";
import { useAuthStore } from "../../store/useAuthStore.js";

// Register the plugin
Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const RateChart = ({ userId }) => {
  const isMobile = useIsMobile();
  const fetchReviewGenres = useAuthStore((state) => state.fetchReviewGenres);
  const [genreStats, setGenreStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);
      const genres = await fetchReviewGenres();
      setGenreStats(genres);
      setLoading(false);
    };

    fetchData();
  }, [userId, fetchReviewGenres]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", color: "white", padding: "2rem" }}>
        Loading chart...
      </div>
    );
  }

  const totalCount = genreStats.reduce((sum, item) => sum + item.count, 0);
  const isEmpty = genreStats.length === 0 || totalCount === 0;

  const chartData = isEmpty
    ? {
      labels: ["No Data"],
      datasets: [
        {
          label: "No Reviews Yet",
          data: [1],
          backgroundColor: ["#888"],
          borderWidth: 1,
        },
      ],
    }
    : {
      labels: genreStats.map((item) => {
        const percentage = totalCount
          ? Math.round((item.count / totalCount) * 100)
          : 0;
        return `${item.genre} (${percentage}%)`;
      }),
      datasets: [
        {
          label: "Reviewed Genres",
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
          font: { size: isMobile ? 10 : 14 },
          maxHeight: isMobile ? 60 : 300,
          maxWidth: isMobile ? undefined : 120,
        },
      },
      tooltip: {
        enabled: !isEmpty,
        callbacks: {
          label: function (context) {
            const value = context.raw || 0;
            const label = context.label || "";
            const percentage = totalCount
              ? Math.round((value / totalCount) * 100)
              : 0;
            return isEmpty
              ? "No Reviews Yet"
              : `${label}: ${value} (${percentage}%)`;
          },
        },
      },
      // Add datalabels plugin config
      datalabels: isEmpty
        ? false
        : {
          color: "#fff",
          formatter: (value) => {
            const percentage = totalCount
              ? ((value / totalCount) * 100).toFixed(1)
              : 0;
            return `${percentage}%`;
          },
          font: {
            weight: "bold",
            size: isMobile ? 8 : 14,
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
        Reviews
      </h2>
      <div
        style={{ height: isMobile ? "350px" : "400px", position: "relative" }}
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
