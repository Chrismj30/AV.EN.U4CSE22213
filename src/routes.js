const express = require('express');
const stockController = require('./controllers/stockController');

const router = express.Router();

// Stock price endpoint
router.get('/stock/:ticker/price', stockController.getAverageStockPrice);

// Stock correlation endpoint
router.get('/stock/correlation', stockController.getStockCorrelation);

module.exports = router; 