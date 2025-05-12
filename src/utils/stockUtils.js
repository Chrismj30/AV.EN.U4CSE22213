const moment = require('moment');
const { calculateAverage } = require('./statisticsUtils');

function processStockPriceHistory(priceHistory) {
  if (!priceHistory || priceHistory.length === 0) {
    return {
      averageStockPrice: 0,
      priceHistory: []
    };
  }

  const prices = priceHistory.map(item => item.price);
  const averageStockPrice = calculateAverage(prices);

  return {
    averageStockPrice,
    priceHistory
  };
}

function alignStockPriceDataByTime(stockA, stockB) {
  if (!stockA.priceHistory || !stockB.priceHistory || 
      stockA.priceHistory.length === 0 || stockB.priceHistory.length === 0) {
    return {
      alignedPricesA: [],
      alignedPricesB: [],
      alignedTimestamps: []
    };
  }

  const combinedTimestamps = new Set();
  
  stockA.priceHistory.forEach(item => {
    combinedTimestamps.add(item.lastUpdatedAt);
  });
  
  stockB.priceHistory.forEach(item => {
    combinedTimestamps.add(item.lastUpdatedAt);
  });
  
  const sortedTimestamps = Array.from(combinedTimestamps).sort();

  function findClosestPrice(timestamps, prices, targetTime) {
    let closestValue = null;
    let minDifference = Infinity;
    
    for (let i = 0; i < timestamps.length; i++) {
      const timeA = moment(timestamps[i]);
      const timeB = moment(targetTime);
      const difference = Math.abs(timeA.diff(timeB, 'milliseconds'));
      
      if (difference < minDifference) {
        minDifference = difference;
        closestValue = prices[i];
      }
    }
    
    return closestValue;
  }

  const timestampsA = stockA.priceHistory.map(item => item.lastUpdatedAt);
  const pricesA = stockA.priceHistory.map(item => item.price);
  
  const timestampsB = stockB.priceHistory.map(item => item.lastUpdatedAt);
  const pricesB = stockB.priceHistory.map(item => item.price);

  const alignedPricesA = [];
  const alignedPricesB = [];
  const alignedTimestamps = [];

  sortedTimestamps.forEach(timestamp => {
    const priceA = findClosestPrice(timestampsA, pricesA, timestamp);
    const priceB = findClosestPrice(timestampsB, pricesB, timestamp);
    
    if (priceA !== null && priceB !== null) {
      alignedPricesA.push(priceA);
      alignedPricesB.push(priceB);
      alignedTimestamps.push(timestamp);
    }
  });

  return {
    alignedPricesA,
    alignedPricesB,
    alignedTimestamps
  };
}

module.exports = {
  processStockPriceHistory,
  alignStockPriceDataByTime
}; 