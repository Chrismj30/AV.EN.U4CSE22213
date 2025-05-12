import React, { useState, useEffect } from 'react';
import { 
  Typography, Box, Grid, Paper, 
  FormControl, InputLabel, Select, MenuItem, 
  TextField, Button, CircularProgress, Alert,
  Autocomplete, Chip
} from '@mui/material';
import CorrelationHeatmap from '../components/CorrelationHeatmap';
import { getCorrelationData, getAllStocks } from '../services/api';

const timeIntervals = [
  { value: 30, label: 'Last 30 minutes' },
  { value: 60, label: 'Last hour' },
  { value: 120, label: 'Last 2 hours' },
  { value: 240, label: 'Last 4 hours' },
  { value: 480, label: 'Last 8 hours' }
];

const CorrelationPage = () => {
  const [selectedStocks, setSelectedStocks] = useState(['NVDA', 'AAPL']);
  const [availableStocks, setAvailableStocks] = useState([]);
  const [timeInterval, setTimeInterval] = useState(60);
  const [customMinutes, setCustomMinutes] = useState('');
  const [correlationData, setCorrelationData] = useState(null);
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

  // Fetch correlation data when stocks or time interval changes
  useEffect(() => {
    if (selectedStocks.length !== 2) return;
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await getCorrelationData(timeInterval, selectedStocks);
        setCorrelationData(data);
      } catch (error) {
        console.error('Failed to fetch correlation data:', error);
        setError('Failed to load correlation data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedStocks, timeInterval]);

  const handleStocksChange = (event, newValue) => {
    if (newValue.length > 2) {
      setError('Only two stocks can be compared at once');
      return;
    }
    setSelectedStocks(newValue);
    setError(null);
  };

  const handleTimeIntervalChange = (event) => {
    setTimeInterval(event.target.value);
  };

  const handleCustomMinutesChange = (event) => {
    setCustomMinutes(event.target.value);
  };

  const handleApplyCustomInterval = () => {
    const minutes = parseInt(customMinutes);
    if (!isNaN(minutes) && minutes > 0) {
      setTimeInterval(minutes);
      setCustomMinutes('');
    }
  };

  const getStockBySymbol = (symbol) => {
    return availableStocks.find(stock => stock.symbol === symbol) || { symbol, name: symbol };
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Stock Correlation Analysis
      </Typography>

      {/* Controls */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={5}>
            <Autocomplete
              multiple
              id="stocks-autocomplete"
              options={availableStocks.map(stock => stock.symbol)}
              value={selectedStocks}
              onChange={handleStocksChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Stocks (max 2)"
                  placeholder="Add stock"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => {
                  const stock = getStockBySymbol(option);
                  const props = getTagProps({ index });
                  const { key } = props;
                  return (
                    <Chip
                      key={key}
                      label={`${stock.name} (${stock.symbol})`}
                      onDelete={props.onDelete}
                      disabled={props.disabled}
                      tabIndex={props.tabIndex}
                      className={props.className}
                    />
                  );
                })
              }
            />
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
          
          <Grid item xs={4} md={1}>
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

      {/* Correlation Heatmap */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        correlationData && <CorrelationHeatmap correlationData={correlationData} minutes={timeInterval} />
      )}

      {/* Information */}
      <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          About Stock Correlation
        </Typography>
        <Typography variant="body1" paragraph>
          The correlation coefficient measures how strongly two stocks move together. Values range from -1 to +1:
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, backgroundColor: 'rgba(0, 0, 255, 0.1)' }}>
              <Typography variant="subtitle1" gutterBottom>
                Positive Correlation (0 to +1)
              </Typography>
              <Typography variant="body2">
                Stocks tend to move in the same direction. A value close to +1 indicates a strong positive relationship.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 0, 0, 0.1)' }}>
              <Typography variant="subtitle1" gutterBottom>
                Negative Correlation (0 to -1)
              </Typography>
              <Typography variant="body2">
                Stocks tend to move in opposite directions. A value close to -1 indicates a strong negative relationship.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, backgroundColor: 'rgba(128, 128, 128, 0.1)' }}>
              <Typography variant="subtitle1" gutterBottom>
                No Correlation (close to 0)
              </Typography>
              <Typography variant="body2">
                No consistent relationship between the movement of the two stocks.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default CorrelationPage; 