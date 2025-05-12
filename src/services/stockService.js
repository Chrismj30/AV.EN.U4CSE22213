const axios = require('axios');
const NodeCache = require('node-cache');
const config = require('../config');

const cache = new NodeCache({ stdTTL: config.cacheExpiryInSeconds });

const CACHE_KEYS = {
  STOCKS_LIST: 'stocks_list',
  STOCK_PRICE: (ticker, minutes) => `stock_price_${ticker}_${minutes || 'latest'}`
};

async function getAllStocks() {
  const cacheKey = CACHE_KEYS.STOCKS_LIST;
  const cachedStocks = cache.get(cacheKey);
  
  if (cachedStocks) {
    return cachedStocks;
  }

  try {
    const headers = {};
    
    if (config.token) {
      headers.Authorization = `Bearer ${config.token}`;
    } else if (config.apiKey) {
      headers.Authorization = config.apiKey;
    }
    
    console.log('Making request with headers:', JSON.stringify(headers, null, 2));
    
    const response = await axios.get(`${config.stockExchangeBaseUrl}/stocks`, {
      headers: headers
    });
    console.log('Stock API response:', response.status);
    const stocks = response.data.stocks;
    
    cache.set(cacheKey, stocks);
    return stocks;
  } catch (error) {
    console.error('Error fetching stocks:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    }
    throw new Error('Failed to fetch stocks from the exchange');
  }
}

async function getStockPriceHistory(ticker, minutes) {
  const cacheKey = CACHE_KEYS.STOCK_PRICE(ticker, minutes);
  const cachedPriceHistory = cache.get(cacheKey);
  
  if (cachedPriceHistory) {
    return cachedPriceHistory;
  }

  try {
    let url = `${config.stockExchangeBaseUrl}/stocks/${ticker}`;
    if (minutes) {
      url += `?minutes=${minutes}`;
    }
    
    const headers = {};
    
    if (config.token) {
      headers.Authorization = `Bearer ${config.token}`;
    } else if (config.apiKey) {
      headers.Authorization = config.apiKey;
    }
    
    console.log('Fetching stock price from:', url);
    console.log('Using headers:', JSON.stringify(headers, null, 2));
    
    const response = await axios.get(url, {
      headers: headers
    });
    console.log('Stock price API response status:', response.status);
    
    let priceHistory;
    if (minutes) {
      priceHistory = response.data;
      console.log(`Retrieved ${priceHistory.length} price points for ${ticker}`);
    } else {
      priceHistory = [response.data.stock];
      console.log(`Retrieved latest price for ${ticker}`);
    }
    
    cache.set(cacheKey, priceHistory, 10); // Short TTL for price data
    return priceHistory;
  } catch (error) {
    console.error(`Error fetching price history for ${ticker}:`, error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    }
    throw new Error(`Failed to fetch price history for ${ticker}`);
  }
}

// Add mock data for testing when the external API is not available
function getMockStockData(ticker, minutes) {
  console.log(`Generating mock data for ${ticker} for the last ${minutes || 'latest'} minutes`);
  
  if (!minutes) {
    return {
      price: Math.random() * 1000,
      lastUpdatedAt: new Date().toISOString()
    };
  }
  
  const result = [];
  const now = new Date();
  
  for (let i = 0; i < Math.min(10, minutes); i++) {
    const time = new Date(now.getTime() - i * 60000);
    result.push({
      price: Math.random() * 1000,
      lastUpdatedAt: time.toISOString()
    });
  }
  
  return result;
}

module.exports = {
  getAllStocks,
  getStockPriceHistory,
  getMockStockData
}; 