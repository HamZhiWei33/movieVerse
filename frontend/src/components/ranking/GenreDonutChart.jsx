// components/GenreDonutChart.jsx
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';

const COLORS = [
  "#E3F9E5", "#C6F7C1", "#A9F295", "#8BE76A", "#74E13B", 
  "#66D934", "#59CC2F", "#4DAD29", "#429B23", "#3B8A1F", 
  "#34781A", "#2F6615"
];

const GenreDonutChart = ({ data }) => {
  const [isMobile, setIsMobile] = useState(false);

   useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  if (!data || data.length === 0) {
    return <div className="chart-container">No data available</div>;
  }
  
  return (
    <div className="chart-container" style={{ width: '100%', height: '100%'}} >
      <h3 className="chart-title">Chart</h3>
      <div style={{
        height: isMobile ? '300px' : '400px',
        width: '100%',
        position: 'relative'
      }}>
        <ResponsiveContainer width="100%" height="100%">
        <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={isMobile ? '40%' : '60%'}
          outerRadius={isMobile ? '70%' : '80%'}
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
      </ResponsiveContainer>

      </div>
      
    </div>
  );
};

export default GenreDonutChart;
