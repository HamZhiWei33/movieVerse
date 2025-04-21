// components/GenreDonutChart.jsx
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

const COLORS = [
  "#F4FFCD", "#E3FF80", "#cc65fe", "#ffce56",
  "#00c49f", "#ff8042", "#8884d8", "#a4de6c",
  "#d0ed57", "#ffc658", "#ff6666", "#66b3ff"
];

const GenreDonutChart = ({ data }) => {
  return (
    <div className="chart-container">
      <h3 className="chart-title">Chart</h3>
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={100}
          outerRadius={150}
          fill="#8884d8"
          paddingAngle={2}
          dataKey="value"
          nameKey="genre"
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ backgroundColor: "#222", border: "none", color: "#fff" }}
          formatter={(value) => [`${value} movies`, 'Genre']}
        />
        <Legend layout="vertical" align="right" verticalAlign="middle" />
      </PieChart>
    </div>
  );
};

export default GenreDonutChart;
