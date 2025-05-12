const axios = require('axios');

// Try a slightly different URL format
const tokenUrl = 'http://20.244.56.144/evaluation-service/auth/gettoken';

// This would contain your credentials for the API
const credentials = {
  email: "user@example.com",
  password: "password123"
  
  // If you have specific credentials, replace the above with them
  // For example:
  // clientId: "your_client_id",
  // clientSecret: "your_client_secret"
};

async function getToken() {
  try {
    console.log('Trying to get token from:', tokenUrl);
    console.log('Using credentials:', JSON.stringify(credentials, null, 2));
    
    const response = await axios.post(tokenUrl, credentials);
    if (response.data && response.data.token) {
      console.log('Token received successfully');
      return response.data.token;
    } else if (response.data) {
      console.log('Response received but no token found:', JSON.stringify(response.data, null, 2));
      throw new Error('Token not found in response');
    } else {
      throw new Error('Empty response received');
    }
  } catch (error) {
    console.error('Error fetching token:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
}

module.exports = {
  getToken
}; 