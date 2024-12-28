import { Box } from "@shopify/polaris"; // Polaris Box component
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

const COLORS = [
  '#1F77B4', // Blue
  '#FF7F0E', // Orange
  '#2CA02C', // Green
  '#D62728', // Red
  '#9467BD', // Purple
  '#8C564B', // Brown
  '#E377C2', // Pink
  '#7F7F7F', // Gray
  '#BCBD22', // Yellow-Green
  '#17BECF', // Cyan
  '#FFB6C1', // Light Pink
  '#A9A9A9', // Dark Gray
];

function BarChart({ contestList }) {
  const barData = contestList.map(({ name, durationSeconds }) => ({
    name,
    value: durationSeconds / 3600,  // Convert seconds to hours
  }));

  return (
    <Box>
      <RechartsBarChart width={1200} height={250} data={barData} label>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" label={{ value: 'Contest Name', position: 'bottom' }} />
        <YAxis label={{ value: 'Duration (hours)', angle: -90, position: 'insideLeft' }} />
        <Bar dataKey="value">
          {barData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
        <Tooltip />
      </RechartsBarChart>
    </Box>
  );
}

export default BarChart;
