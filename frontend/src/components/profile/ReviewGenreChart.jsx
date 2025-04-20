import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Register plugins
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

// Mock data with genres
const mockReviewData = [
  {
    title: "Amazing App",
    review: "Really smooth experience",
    rate: 5,
    genre: "Productivity",
  },
  {
    title: "Good but slow",
    review: "Loading takes time",
    rate: 3,
    genre: "Education",
  },
  {
    title: "Fantastic",
    review: "Clean UI and fast",
    rate: 4,
    genre: "Productivity",
  },
  {
    title: "Could be better",
    review: "Lots of bugs",
    rate: 2,
    genre: "Entertainment",
  },
  {
    title: "Loved it!",
    review: "Perfect for my needs",
    rate: 5,
    genre: "Education",
  },
  {
    title: "Disappointed",
    review: "Crashes on startup",
    rate: 1,
    genre: "Gaming",
  },
  {
    title: "Pretty good",
    review: "Just needs dark mode",
    rate: 4,
    genre: "Productivity",
  },
  {
    title: "Okay",
    review: "Average experience",
    rate: 3,
    genre: "Entertainment",
  },
  { title: "Waste of time", review: "Very buggy", rate: 1, genre: "Gaming" },
  {
    title: "Nice app",
    review: "Simple and useful",
    rate: 4,
    genre: "Education",
  },
];

const ReviewGenreChart = () => {
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const genreCounts = {};
    mockReviewData.forEach((review) => {
      const genre = review.genre;
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    });

    const labels = Object.keys(genreCounts);
    const values = Object.values(genreCounts);
    const total = values.reduce((acc, val) => acc + val, 0);

    const data = {
      labels,
      datasets: [
        {
          label: "Genre Distribution",
          data: values,
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#8BC34A",
            "#FF9800",
            "#9C27B0",
          ],
          borderWidth: 1,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const value = context.parsed;
              const percentage = ((value / total) * 100).toFixed(1);
              return `${context.label}: ${value} reviews (${percentage}%)`;
            },
          },
        },
        datalabels: {
          color: "#fff",
          formatter: (value) => {
            const percentage = ((value / total) * 100).toFixed(1);
            return `${percentage}%`;
          },
          font: {
            weight: "bold",
            size: 14,
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, []);

  if (!chartData) return <p>Loading chart...</p>;

  return (
    <div style={{ maxWidth: "500px", margin: "auto" }}>
      <h2>Genre Distribution in Reviews</h2>
      <Pie data={chartData} options={chartOptions} />
    </div>
  );
};

export default ReviewGenreChart;
