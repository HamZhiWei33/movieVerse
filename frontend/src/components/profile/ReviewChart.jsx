import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const mockReviewData = [
  { title: "Amazing App", review: "Really smooth experience", rate: 5 },
  { title: "Good but slow", review: "Loading takes time", rate: 3 },
  { title: "Fantastic", review: "Clean UI and fast", rate: 4 },
  { title: "Could be better", review: "Lots of bugs", rate: 2 },
  { title: "Loved it!", review: "Perfect for my needs", rate: 5 },
  { title: "Disappointed", review: "Crashes on startup", rate: 1 },
  { title: "Pretty good", review: "Just needs dark mode", rate: 4 },
  { title: "Okay", review: "Average experience", rate: 3 },
  { title: "Waste of time", review: "Very buggy", rate: 1 },
  { title: "Nice app", review: "Simple and useful", rate: 4 },
];

const ReviewChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const ratingCounts = [0, 0, 0, 0, 0];
    mockReviewData.forEach((review) => {
      if (review.rate >= 1 && review.rate <= 5) {
        ratingCounts[review.rate - 1]++;
      }
    });

    const data = {
      labels: ["1 Star", "2 Star", "3 Star", "4 Star", "5 Star"],
      datasets: [
        {
          label: "Number of Reviews",
          data: ratingCounts,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };

    setChartData(data);
  }, []);

  if (!chartData) return <p>Loading chart...</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <h2>Review Ratings Summary</h2>
      <Bar data={chartData} options={{ responsive: true }} />
    </div>
  );
};

export default ReviewChart;
