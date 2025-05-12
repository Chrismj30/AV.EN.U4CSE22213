const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const config = require('./config');
const { getToken } = require('./tokenGen');

const app = express();

// Enable CORS for frontend requests
app.use(cors({
  origin: 'http://localhost:3001', // Allow frontend requests
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Define API routes
app.use('/api', routes);

async function startServer() {
  if (config.useMockData) {
    console.log('Starting server with mock data (as configured)');
    app.listen(config.port, () => {
      console.log(`Stock Price Aggregation Service running on port ${config.port} (using mock data)`);
    });
    return;
  }

  if (config.apiKey) {
    console.log('Starting server with API key authentication');
    app.listen(config.port, () => {
      console.log(`Stock Price Aggregation Service running on port ${config.port} (using API key)`);
    });
    return;
  }

  try {
    // Get token for the stock exchange API
    config.token = await getToken();
    console.log('Token initialized successfully');
    
    app.listen(config.port, () => {
      console.log(`Stock Price Aggregation Service running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to initialize token. Using mock data:', error.message);
    
    app.listen(config.port, () => {
      console.log(`Stock Price Aggregation Service running on port ${config.port} (using mock data)`);
    });
  }
}

startServer(); 