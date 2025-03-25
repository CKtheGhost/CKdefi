const axios = require('axios');

// In-memory cache for token data
let tokenDataCache = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get token market data from external API
 * @returns {Promise<Object>} Token data
 */
async function getMemeCoinData() {
  const now = Date.now();
  
  // Return cached data if still valid
  if (tokenDataCache && (now - lastFetchTime) < CACHE_DURATION) {
    return tokenDataCache;
  }
  
  try {
    // Fetch APT price
    const aptosPrice = await getAptosPrice();
    
    // Fetch top Aptos tokens
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        ids: 'aptos,econia,starswap,liquidswap,mojito-markets',
        order: 'market_cap_desc',
        per_page: 10,
        page: 1,
        sparkline: true,
        price_change_percentage: '24h'
      },
      timeout: 10000
    });
    
    const coins = response.data.map(coin => {
      const price_change_percentage = coin.price_change_percentage_24h || 0;
      return {
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        price: coin.current_price,
        market_cap: coin.market_cap,
        volume_24h: coin.total_volume,
        price_change_percentage_24h: price_change_percentage,
        image: coin.image,
        lastUpdated: coin.last_updated,
        platform: "Aptos",
        isAptNative: coin.symbol.toLowerCase() === 'apt',
        aptPerToken: coin.current_price / aptosPrice,
        sparkline_7d: coin.sparkline_in_7d?.price || [],
        isGainer: price_change_percentage > 0
      };
    });
    
    // Sort by price change percentage
    coins.sort((a, b) => Math.abs(b.price_change_percentage_24h) - Math.abs(a.price_change_percentage_24h));
    
    const result = {
      coins,
      aptosPrice,
      lastUpdated: new Date().toISOString()
    };
    
    // Update cache
    tokenDataCache = result;
    lastFetchTime = now;
    
    return result;
  } catch (error) {
    console.error('Error fetching token data:', error.message);
    
    // Return cached data if available, even if expired
    if (tokenDataCache) {
      return tokenDataCache;
    }
    
    // Return fallback data if no cache available
    return {
      coins: [
        {
          name: "Aptos",
          symbol: "APT",
          price: 12.5,
          market_cap: 5842303751,
          volume_24h: 215432100,
          price_change_percentage_24h: 2.5,
          image: "https://assets.coingecko.com/coins/images/26455/large/aptos_round.png",
          lastUpdated: new Date().toISOString(),
          platform: "Aptos",
          isAptNative: true,
          aptPerToken: 1,
          sparkline_7d: [12.1, 12.3, 12.2, 12.4, 12.5, 12.6, 12.5],
          isGainer: true
        }
      ],
      aptosPrice: 12.5,
      lastUpdated: new Date().toISOString()
    };
  }
}

/**
 * Get current APT price
 * @returns {Promise<number>} APT price in USD
 */
async function getAptosPrice() {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: 'aptos',
        vs_currencies: 'usd'
      },
      timeout: 5000
    });
    
    return response.data.aptos.usd;
  } catch (error) {
    console.error('Error fetching APT price:', error.message);
    return 12.5; // Fallback price
  }
}

module.exports = { getMemeCoinData, getAptosPrice };
