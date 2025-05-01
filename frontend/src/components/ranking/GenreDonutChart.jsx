// components/GenreDonutChart.jsx
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

const COLORS = [
  "#E3F9E5", "#C6F7C1", "#A9F295", "#8BE76A", "#74E13B", 
  "#66D934", "#59CC2F", "#4DAD29", "#429B23", "#3B8A1F", 
  "#34781A", "#2F6615"
];

const GenreDonutChart = ({ data }) => {
  return (
    <div className="chart-container">
      <h3 className="chart-title">Chart</h3>
      <PieChart width={500} height={400}>
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
          formatter={(value, name) => [`${value} movies`, name]} 
        />
        <Legend layout="vertical" align="right" verticalAlign="middle" />
      </PieChart>
    </div>
  );
};

export default GenreDonutChart;
