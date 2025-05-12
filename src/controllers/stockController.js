const stockService = require('../services/stockService');
const { calculateCorrelation } = require('../utils/statisticsUtils');
const { processStockPriceHistory, alignStockPriceDataByTime } = require('../utils/stockUtils');
const config = require('../config');

async function getAverageStockPrice(req, res) {
  try {
    const { ticker } = req.params;
    const minutes = req.query.minutes ? parseInt(req.query.minutes) : null;
    const aggregation = req.query.aggregation;
    
    if (aggregation && aggregation !== 'average') {
      return res.status(400).json({ error: 'Only average aggregation is supported' });
    }
    
    let priceHistory;
    if (config.useMockData) {
      // Use mock data directly if configured
      priceHistory = stockService.getMockStockData(ticker, minutes);
      if (!Array.isArray(priceHistory)) {
        priceHistory = [priceHistory];
      }
    } else {
      try {
        priceHistory = await stockService.getStockPriceHistory(ticker, minutes);
      } catch (error) {
        console.log('Using mock data due to API error');
        // Use mock data if the external API is unavailable
        priceHistory = stockService.getMockStockData(ticker, minutes);
        if (!Array.isArray(priceHistory)) {
          priceHistory = [priceHistory];
        }
      }
    }
    
    const result = processStockPriceHistory(priceHistory);
    
    return res.json(result);
  } catch (error) {
    console.error('Error in getAverageStockPrice:', error.message);
    return res.status(500).json({ error: 'Failed to get average stock price' });
  }
}

async function getStockCorrelation(req, res) {
  try {
    const minutes = req.query.minutes ? parseInt(req.query.minutes) : 60;
    let tickers = req.query.tickers;
    
    // Handle comma-separated tickers format
    if (typeof tickers === 'string') {
      tickers = tickers.split(',');
    } else if (!tickers) {
      tickers = req.query.ticker; // Fallback to the original format
    }
    
    if (!tickers || !Array.isArray(tickers) || tickers.length !== 2) {
      return res.status(400).json({ 
        error: 'Exactly two tickers must be provided'
      });
    }
    
    const [tickerA, tickerB] = tickers;
    
    let priceHistoryA, priceHistoryB;
    
    if (config.useMockData) {
      // Use mock data directly if configured
      priceHistoryA = stockService.getMockStockData(tickerA, minutes);
      priceHistoryB = stockService.getMockStockData(tickerB, minutes);
      
      if (!Array.isArray(priceHistoryA)) {
        priceHistoryA = [priceHistoryA];
      }
      
      if (!Array.isArray(priceHistoryB)) {
        priceHistoryB = [priceHistoryB];
      }
    } else {
      try {
        [priceHistoryA, priceHistoryB] = await Promise.all([
          stockService.getStockPriceHistory(tickerA, minutes),
          stockService.getStockPriceHistory(tickerB, minutes)
        ]);
      } catch (error) {
        console.log('Using mock data due to API error');
        // Use mock data if the external API is unavailable
        priceHistoryA = stockService.getMockStockData(tickerA, minutes);
        priceHistoryB = stockService.getMockStockData(tickerB, minutes);
        
        if (!Array.isArray(priceHistoryA)) {
          priceHistoryA = [priceHistoryA];
        }
        
        if (!Array.isArray(priceHistoryB)) {
          priceHistoryB = [priceHistoryB];
        }
      }
    }
    
    const stockA = processStockPriceHistory(priceHistoryA);
    const stockB = processStockPriceHistory(priceHistoryB);
    
    const { alignedPricesA, alignedPricesB } = alignStockPriceDataByTime(stockA, stockB);
    
    let correlation = 0;
    if (alignedPricesA.length > 1) {
      correlation = calculateCorrelation(alignedPricesA, alignedPricesB);
    }
    
    return res.json({
      correlation: parseFloat(correlation.toFixed(4)),
      stocks: {
        [tickerA]: {
          averagePrice: stockA.averageStockPrice,
          priceHistory: stockA.priceHistory
        },
        [tickerB]: {
          averagePrice: stockB.averageStockPrice,
          priceHistory: stockB.priceHistory
        }
      }
    });
  } catch (error) {
    console.error('Error in getStockCorrelation:', error.message);
    return res.status(500).json({ error: 'Failed to calculate stock correlation' });
  }
}

module.exports = {
  getAverageStockPrice,
  getStockCorrelation
}; 