const axios = require('axios');

exports.getStakingData = async () => {
  // Placeholder: Implement actual staking data fetching from Aptos blockchain
  try {
    // Example: Replace with real Aptos blockchain client
    return {
      protocols: { 'Protocol A': 5.2, 'Protocol B': 6.8 },
      strategies: {},
    };
  } catch (error) {
    console.error('Error fetching staking data:', error);
    return { protocols: {}, strategies: {} };
  }
};

exports.getNewsData = async () => {
  try {
    const response = await axios.get('https://cryptopanic.com/api/v1/posts/', {
      params: { auth_token: process.env.CRYPTOPANIC_API_KEY },
    });
    return { articles: response.data.results, lastUpdated: new Date().toISOString() };
  } catch (error) {
    console.error('Error fetching news data:', error);
    return { articles: [], lastUpdated: new Date().toISOString() };
  }
};

exports.getTokenData = async () => {
  try {
    const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
      headers: { 'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY },
    });
    return { coins: response.data.data, lastUpdated: new Date().toISOString() };
  } catch (error) {
    console.error('Error fetching token data:', error);
    return { coins: [], lastUpdated: new Date().toISOString() };
  }
};