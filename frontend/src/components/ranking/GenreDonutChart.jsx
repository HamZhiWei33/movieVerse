// components/GenreDonutChart.jsx
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import useIsMobile from "../../store/useIsMobile";
import CustomLegend from "./CustomLegend";

const COLORS = [
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
];

const GenreDonutChart = ({ data }) => {
  const isMobile = useIsMobile();

  if (!data || data.length === 0) {
    return <div className="chart-container">No data available</div>;
  }

  return (
    <div
      className="chart-container"
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px", // Adjust this to control the spacing
      }}
    >
      <div
        style={{
          height: isMobile ? "300px" : "400px",
          width: isMobile ? "100%" : "60%",
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={isMobile ? "40%" : "60%"}
              outerRadius={isMobile ? "70%" : "80%"}
              fill="#8884d8"
              paddingAngle={2}
              dataKey="value"
              nameKey="genre"
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#222",
                border: "none",
                color: "#fff",
              }}
              formatter={(value, name) => [`${value} movies`, name]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <CustomLegend
        payload={data.map((d, i) => ({
          value: d.genre,
          color: COLORS[i % COLORS.length],
        }))}
        isMobile={isMobile}
      />
    </div>
  );
};
export default GenreDonutChart;
