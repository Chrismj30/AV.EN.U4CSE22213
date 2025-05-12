import React, { useState, useEffect } from 'react';
import { 
  Typography, Box, Grid, Paper, 
  FormControl, InputLabel, Select, MenuItem,
  TextField, Button, CircularProgress, Alert
} from '@mui/material';
import StockChart from '../components/StockChart';
import { getStockData, getAllStocks } from '../services/api';

const timeIntervals = [
  { value: 10, label: 'Last 10 minutes' },
  { value: 30, label: 'Last 30 minutes' },
  { value: 60, label: 'Last hour' },
  { value: 120, label: 'Last 2 hours' },
  { value: 180, label: 'Last 3 hours' }
];

/**
 * Stock page component for displaying stock charts
 */
const StockPage = () => {
  const [selectedStock, setSelectedStock] = useState('NVDA');
  const [customMinutes, setCustomMinutes] = useState('');
  const [timeInterval, setTimeInterval] = useState(30);
  const [stockData, setStockData] = useState(null);
  const [availableStocks, setAvailableStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch available stocks
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const stocks = await getAllStocks();
        setAvailableStocks(stocks);
      } catch (error) {
        console.error('Failed to fetch stocks:', error);
        setError('Failed to load available stocks');
      }
    };

    fetchStocks();
  }, []);

  // Fetch stock data when stock or time interval changes
  useEffect(() => {
    if (!selectedStock) return;
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getStockData(selectedStock, timeInterval);
        setStockData(data);
      } catch (error) {
        console.error('Failed to fetch stock data:', error);
        setError('Failed to load stock data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedStock, timeInterval]);

  // Handler for stock selection
  const handleStockChange = (event) => {
    setSelectedStock(event.target.value);
  };

  // Handler for time interval selection
  const handleTimeIntervalChange = (event) => {
    setTimeInterval(event.target.value);
  };

  // Handler for custom minutes input
  const handleCustomMinutesChange = (event) => {
    setCustomMinutes(event.target.value);
  };

  // Handler for applying custom time interval
  const handleApplyCustomInterval = () => {
    const minutes = parseInt(customMinutes, 10);
    if (!isNaN(minutes) && minutes > 0) {
      setTimeInterval(minutes);
      setCustomMinutes('');
    }
  };

  // Get the name of the selected stock
  const getSelectedStockName = () => {
    const stock = availableStocks.find(s => s.symbol === selectedStock);
    return stock ? stock.name : selectedStock;
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Stock Price Chart
      </Typography>

      {/* Controls */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="stock-select-label">Stock</InputLabel>
              <Select
                labelId="stock-select-label"
                id="stock-select"
                value={selectedStock}
                label="Stock"
                onChange={handleStockChange}
              >
                {availableStocks.map((stock) => (
                  <MenuItem key={stock.symbol} value={stock.symbol}>
                    {stock.name} ({stock.symbol})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="time-interval-select-label">Time Interval</InputLabel>
              <Select
                labelId="time-interval-select-label"
                id="time-interval-select"
                value={timeInterval}
                label="Time Interval"
                onChange={handleTimeIntervalChange}
              >
                {timeIntervals.map((interval) => (
                  <MenuItem key={interval.value} value={interval.value}>
                    {interval.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={8} md={3}>
            <TextField
              fullWidth
              label="Custom Minutes"
              type="number"
              value={customMinutes}
              onChange={handleCustomMinutesChange}
              inputProps={{ min: 1 }}
            />
          </Grid>
          
          <Grid item xs={4} md={2}>
            <Button 
              variant="contained" 
              onClick={handleApplyCustomInterval}
              disabled={!customMinutes}
              fullWidth
            >
              Apply
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Chart */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        stockData && <StockChart data={stockData} stockSymbol={selectedStock} />
      )}

      {/* Information */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          About this Chart
        </Typography>
        <Typography variant="body1" paragraph>
          This chart displays the price history of {getSelectedStockName()} ({selectedStock}) over the last {timeInterval} minutes.
        </Typography>
        <Typography variant="body1" paragraph>
          The chart shows individual price points, and the average price is shown as a reference line.
          You can hover over points to see exact prices at specific times.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Data is updated in real-time and may be delayed by a few minutes from actual market prices.
        </Typography>
      </Paper>
    </Box>
  );
};

export default StockPage; 