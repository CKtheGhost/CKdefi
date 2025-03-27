const axios = require('axios');
const { AptosClient } = require('@aptos-labs/ts-sdk');

exports.getStakingData = async (aptosClient) => {
  try {
    // Example: Fetch staking rates from Aptos blockchain
    const stakingRates = await aptosClient.view({
      function: '0x1::staking::get_staking_rate',
      arguments: [],
    });
    return { protocols: { exampleProtocol: stakingRates[0] } };
  } catch (error) {
    console.error('Error fetching staking data:', error);
    return { protocols: {} };
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