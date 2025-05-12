import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { Paper, Typography, Box, useTheme } from '@mui/material';
import { formatPrice, formatDate } from '../utils/formatters';

// Custom tooltip component for the chart
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Paper elevation={3} sx={{ p: 1.5, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          {formatDate(label)}
        </Typography>
        <Typography variant="body2" color="primary" fontWeight="bold">
          Price: {formatPrice(payload[0].value)}
        </Typography>
      </Paper>
    );
  }
  return null;
};

/**
 * Stock price chart component
 * @param {Object} props - Component props
 * @param {Array} props.data - Stock price data
 * @param {string} props.stockSymbol - Stock ticker symbol
 */
const StockChart = ({ data, stockSymbol }) => {
  const theme = useTheme();
  const [hoveredPrice, setHoveredPrice] = useState(null);

  // Exit early if no data is available
  if (!data || !data.priceHistory || data.priceHistory.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6">No data available for {stockSymbol}</Typography>
      </Paper>
    );
  }

  // Transform the data for the chart
  const chartData = data.priceHistory.map(item => ({
    timestamp: item.timestamp,
    price: item.price
  }));

  // Handle mouse events to show the hovered price
  const handleMouseMove = (e) => {
    if (e && e.activePayload && e.activePayload.length) {
      setHoveredPrice(e.activePayload[0].value);
    }
  };

  const handleMouseLeave = () => {
    setHoveredPrice(null);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          {stockSymbol} Price Chart
        </Typography>
        <Box>
          <Typography variant="body1" component="span" sx={{ mr: 2 }}>
            Average Price: {formatPrice(data.averagePrice)}
          </Typography>
          {hoveredPrice && (
            <Typography variant="body1" component="span" color="primary">
              Selected: {formatPrice(hoveredPrice)}
            </Typography>
          )}
        </Box>
      </Box>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatDate}
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={70}
          />
          <YAxis
            domain={['auto', 'auto']}
            tickFormatter={formatPrice}
            tick={{ fontSize: 12 }}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} />
          <ReferenceLine
            y={data.averagePrice}
            label="Average"
            stroke={theme.palette.secondary.main}
            strokeDasharray="3 3"
          />
          <Line
            type="monotone"
            dataKey="price"
            name={`${stockSymbol} Price`}
            stroke={theme.palette.primary.main}
            dot={{ r: 2 }}
            activeDot={{ r: 6 }}
            animationDuration={500}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default StockChart; 