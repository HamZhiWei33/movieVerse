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
  "#E3F9E5",
  "#C6F7C1",
  "#A9F295",
  "#8BE76A",
  "#74E13B",
  "#66D934",
  "#59CC2F",
  "#4DAD29",
  "#429B23",
  "#3B8A1F",
  "#34781A",
  "#2F6615",
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
