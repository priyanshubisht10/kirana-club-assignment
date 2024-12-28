import { useEffect, useState, useCallback } from 'react';
import { Box, Select } from '@shopify/polaris'; // Polaris components
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { getTypeStats, getYearStats } from '../../services/contestService.js'; // Import the stats functions

function PieChart() {
  const [chartData, setChartData] = useState([]);
  const [selectedParameter, setSelectedParameter] = useState('type');

  const handleSelectChange = useCallback((value) => {
    setSelectedParameter(value);
  }, []);

  const options = [
    { label: 'Type', value: 'type' },
    { label: 'Year', value: 'year' },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      let stats = [];
      switch (selectedParameter) {
        case 'type':
          stats = await getTypeStats();
          break;
        case 'year':
          stats = await getYearStats();
          break;
        default:
          break;
      }

      // Convert the stats object into an array of { name, value } for PieChart
      const data = Object.entries(stats).map(([key, value]) => ({
        name: key,
        value: value,
      }));
      setChartData(data);
    };

    fetchStats();
  }, [selectedParameter]);

  console.log("c", chartData);

  // Define chart colors
  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF4444', '#FF99FF',
    '#FF6347', '#7B68EE', '#32CD32', '#FFD700', '#DC143C', '#8A2BE2',
    '#FF69B4', '#98FB98', '#4B0082', '#B22222', '#5F9EA0', '#D2691E',
    '#CD5C5C', '#FF4500', '#2E8B57', '#F4A300', '#FF1493', '#C71585',
    '#F08080', '#20B2AA', '#E9967A', '#8B4513', '#A52A2A', '#6A5ACD',
    '#9ACD32', '#228B22', '#FF8C00', '#B0E0E6', '#FFDAB9', '#7FFF00',
    '#FF00FF', '#4682B4', '#D8BFD8', '#BC8F8F', '#B0C4DE', '#FAEBD7',
    '#F0E68C', '#BDB76B', '#ADFF2F', '#FF6347', '#F0F8FF', '#E0FFFF',
    '#F5FFFA', '#FFFFE0', '#C0C0C0'
  ];

  return (
    <Box>
      <Select
        label="Select Parameter"
        options={options}
        onChange={handleSelectChange}
        value={selectedParameter}
      />

      <RechartsPieChart width={200} height={200}> {/* Set specific width and height */}
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius="45%"
          fill="#8884d8"
          label
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        {(selectedParameter === 'type') ? <Legend /> : <></>}
      </RechartsPieChart>
    </Box>
  );
}

export default PieChart;
