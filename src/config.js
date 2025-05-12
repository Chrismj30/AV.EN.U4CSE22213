module.exports = {
  port: process.env.PORT || 3000,
  stockExchangeBaseUrl: 'http://20.244.56.144/evaluation-service',
  cacheExpiryInSeconds: 60,
  useMockData: false, // Try to use real data
  token: null, // This will be set at runtime if useMockData is false
  apiKey: "test-evaluation" // Try using a static API key
}; 