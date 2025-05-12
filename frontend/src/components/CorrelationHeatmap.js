import React, { useState } from 'react';
import {
  Paper, Typography, Box, Tooltip, useTheme,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Card, CardContent, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { formatCorrelation, formatPrice, getCorrelationColor } from '../utils/formatters';

// Component to display stock information when a cell is clicked
const StockInfoCard = ({ stock, onClose }) => {
  if (!stock) return null;

  return (
    <Card sx={{ mb: 3, position: 'relative' }}>
      <IconButton
        sx={{ position: 'absolute', top: 8, right: 8 }}
        onClick={onClose}
        size="small"
      >
        <CloseIcon fontSize="small" />
      </IconButton>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {stock.symbol} ({stock.name})
        </Typography>
        <Typography variant="body1">
          Average Price: {formatPrice(stock.averagePrice)}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Data based on the last {stock.minutes} minutes
        </Typography>
      </CardContent>
    </Card>
  );
};

// Component for individual cells in the heatmap
const CorrelationCell = ({ 
  value, 
  isHeader, 
  stockInfo, 
  onClick,
  highlighted
}) => {
  const theme = useTheme();
  
  // For header cells
  if (isHeader) {
    return (
      <Tooltip title={stockInfo?.name || ''} arrow placement="top">
        <TableCell 
          sx={{ 
            fontWeight: 'bold', 
            backgroundColor: theme.palette.grey[100],
            cursor: 'pointer',
            ...(highlighted && { backgroundColor: theme.palette.primary.light }),
            '&:hover': { backgroundColor: theme.palette.primary.light }
          }}
          align="center"
          onClick={() => onClick(stockInfo)}
        >
          {stockInfo?.symbol || ''}
        </TableCell>
      </Tooltip>
    );
  }
  
  // For correlation cells
  const backgroundColor = value !== null 
    ? getCorrelationColor(value) 
    : theme.palette.grey[100];
  
  const textColor = value !== null 
    ? (Math.abs(value) > 0.6 ? '#ffffff' : theme.palette.text.primary) 
    : theme.palette.text.secondary;
  
  return (
    <TableCell 
      sx={{ 
        backgroundColor,
        color: textColor,
        textAlign: 'center',
        cursor: value !== null ? 'default' : 'not-allowed',
        fontWeight: Math.abs(value) > 0.8 ? 'bold' : 'normal',
        borderRadius: '4px',
        transition: 'all 0.2s ease-in-out',
        ...(highlighted && { boxShadow: `inset 0 0 0 2px ${theme.palette.primary.main}` }),
        '&:hover': value !== null ? { 
          transform: 'scale(1.05)',
          boxShadow: `0 4px 8px rgba(0,0,0,0.15)` 
        } : {}
      }}
      align="center"
    >
      {value !== null ? formatCorrelation(value) : 'N/A'}
    </TableCell>
  );
};

/**
 * Component to display a heatmap of stock correlations
 * @param {Object} props - Component props
 * @param {Object} props.correlationData - Correlation data from API
 * @param {number} props.minutes - Time range in minutes
 */
const CorrelationHeatmap = ({ correlationData, minutes }) => {
  const [selectedStock, setSelectedStock] = useState(null);
  const [selectedStockPosition, setSelectedStockPosition] = useState(null);
  
  // Exit early if no data is available
  if (!correlationData || !correlationData.correlations || Object.keys(correlationData.correlations).length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6">No correlation data available</Typography>
      </Paper>
    );
  }
  
  // Build the correlation matrix from the data
  const stocks = Object.keys(correlationData.correlations);
  const stocksData = correlationData.stocksData || {};
  
  const handleCellClick = (stockInfo, position) => {
    setSelectedStock(stockInfo);
    setSelectedStockPosition(position);
  };
  
  const handleCloseCard = () => {
    setSelectedStock(null);
    setSelectedStockPosition(null);
  };
  
  return (
    <Box>
      {selectedStock && (
        <StockInfoCard 
          stock={{
            ...selectedStock,
            minutes
          }} 
          onClose={handleCloseCard} 
        />
      )}
      
      <Paper elevation={3} sx={{ p: 3, overflow: 'auto' }}>
        <Typography variant="h5" gutterBottom>
          Stock Correlation Heatmap
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
          Based on the last {minutes} minutes of stock price data
        </Typography>
        
        <TableContainer component={Paper} elevation={2} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'grey.200' }}>
                  Stock
                </TableCell>
                {stocks.map((ticker, index) => (
                  <CorrelationCell 
                    key={ticker} 
                    isHeader 
                    stockInfo={stocksData[ticker]} 
                    onClick={(stockInfo) => handleCellClick(stockInfo, { type: 'column', index })}
                    highlighted={selectedStockPosition?.type === 'column' && selectedStockPosition?.index === index}
                  />
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {stocks.map((rowTicker, rowIndex) => (
                <TableRow key={rowTicker}>
                  <CorrelationCell 
                    isHeader 
                    stockInfo={stocksData[rowTicker]} 
                    onClick={(stockInfo) => handleCellClick(stockInfo, { type: 'row', index: rowIndex })}
                    highlighted={selectedStockPosition?.type === 'row' && selectedStockPosition?.index === rowIndex}
                  />
                  {stocks.map((colTicker, colIndex) => {
                    // Diagonal elements (same stock) should show 1.0
                    const value = rowTicker === colTicker 
                      ? 1.0 
                      : correlationData.correlations[rowTicker]?.[colTicker] || null;
                    
                    return (
                      <CorrelationCell 
                        key={`${rowTicker}-${colTicker}`} 
                        value={value}
                        highlighted={
                          (selectedStockPosition?.type === 'row' && selectedStockPosition?.index === rowIndex) ||
                          (selectedStockPosition?.type === 'column' && selectedStockPosition?.index === colIndex)
                        }
                      />
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default CorrelationHeatmap; 