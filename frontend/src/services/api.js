import axios from 'axios';

// Base URL for API
const API_BASE_URL = 'http://localhost:3000';

// Mock data for when API calls fail
const MOCK_DATA = {
  stockPrice: (ticker) => ({
    averagePrice: 250 + Math.random() * 50,
    priceHistory: Array.from({ length: 20 }, (_, i) => ({
      timestamp: new Date(Date.now() - (i * 60000)).toISOString(),
      price: 200 + Math.random() * 100
    })).reverse()
  }),
  correlation: (ticker1, ticker2) => ({
    correlation: -0.5 + Math.random(),
    correlations: {
      [ticker1]: {
        [ticker2]: -0.5 + Math.random()
      },
      [ticker2]: {
        [ticker1]: -0.5 + Math.random()
      }
    },
    stocksData: {
      [ticker1]: { symbol: ticker1, name: getStockNameBySymbol(ticker1), averagePrice: 250 + Math.random() * 50 },
      [ticker2]: { symbol: ticker2, name: getStockNameBySymbol(ticker2), averagePrice: 250 + Math.random() * 50 }
    }
  })
};

// Helper to get stock name by symbol
function getStockNameBySymbol(symbol) {
  const stocks = getAllStocksSync();
  const stock = stocks.find(s => s.symbol === symbol);
  return stock ? stock.name : symbol;
}

/**
 * Fetch stock data for a specific ticker and time range
 * @param {string} ticker - Stock ticker symbol
 * @param {number} minutes - Time range in minutes
 * @returns {Promise} - Promise containing the stock data
 */
export const getStockData = async (ticker, minutes) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/stock/${ticker}/price`, {
      params: { minutes },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    // Return mock data if API call fails
    console.log('Using mock data for stock prices');
    return MOCK_DATA.stockPrice(ticker);
  }
};

/**
 * Fetch correlation data for multiple stocks
 * @param {number} minutes - Time range in minutes
 * @param {Array} tickers - Array of stock ticker symbols
 * @returns {Promise} - Promise containing correlation data
 */
export const getCorrelationData = async (minutes, tickers) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/stock/correlation`, {
      params: { minutes, tickers: tickers.join(',') },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching correlation data:', error);
    // Return mock data if API call fails
    console.log('Using mock data for correlation');
    return MOCK_DATA.correlation(tickers[0], tickers[1]);
  }
};

/**
 * Get list of all available stocks - synchronous version for internal use
 * @returns {Array} - Array of stock objects with symbol and name
 */
function getAllStocksSync() {
  return [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'META', name: 'Meta Platforms Inc.' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation' },
    { symbol: 'JPM', name: 'JPMorgan Chase & Co.' },
    { symbol: 'BAC', name: 'Bank of America Corp.' },
    { symbol: 'JNJ', name: 'Johnson & Johnson' },
  ];
}

/**
 * Get list of all available stocks
 * @returns {Promise<Array>} - Promise containing array of stock objects with symbol and name
 */
export const getAllStocks = async () => {
  // In a real app, this would be an API call
  // For demonstration, we'll return a fixed list
  return getAllStocksSync();
}; 