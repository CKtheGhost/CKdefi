// marketDataUtils.js
// Utilities for fetching, processing, and analyzing market data for DeFi protocols

const axios = require('axios');
const { performance } = require('perf_hooks');
const NodeCache = require('node-cache');

// Initialize cache with default TTL of 5 minutes and check period of 120 seconds
const dataCache = new NodeCache({ stdTTL: 300, checkperiod: 120 });

// Cache keys
const CACHE_KEYS = {
  TOKEN_PRICES: 'token_prices',
  APT_PRICE: 'apt_price',
  PROTOCOL_APRS: 'protocol_aprs',
  MEMECOIN_DATA: 'memecoin_data',
  MARKET_OVERVIEW: 'market_overview',
  HISTORICAL_PRICES: 'historical_prices_'
};

// API endpoints
const API_ENDPOINTS = {
  COINGECKO: 'https://api.coingecko.com/api/v3',
  COINMARKETCAP: 'https://pro-api.coinmarketcap.com/v1',
  DEFILLAMA: 'https://api.llama.fi',
  APTOS_INDEXER: 'https://indexer.mainnet.aptoslabs.com/v1/graphql'
};

// Protocol address mapping
const PROTOCOL_ADDRESSES = {
  amnis: "0x111ae3e5bc816a5e63c2da97d0aa3886519e0cd5e4b046659fa35796bd11542a",
  thala: "0xfaf4e633ae9eb31366c9ca24214231760926576c7b625313b3688b5e900731f6",
  tortuga: "0x952c1b1fc8eb75ee80f432c9d0a84fcda1d5c7481501a7eca9199f1596a60b53",
  ditto: "0xd11107bdf0d6d7040c6c0bfbdecb6545191fdf13e8d8d259952f53e1713f61b5",
  aries: "0x9770fa9c725cbd97eb50b2be5f7416efdfd1f1554beb0750d4dae4c64e860da3",
  echelon: "0xf8197c9fa1a397568a47b7a6c5a9b09fa97c8f29f9dcc347232c22e3b24b1f09",
  echo: "0xeab7ea4d635b6b6add79d5045c4a45d8148d88287b1cfa1c3b6a4b56f46839ed",
  pancakeswap: "0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa",
  liquidswap: "0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12",
  cetus: "0x27156bd56eb5637b9adde4d915b596f92d2f28f0ade2eaef48fa73e360e4e8a6"
};

/**
 * Fetch current price for Aptos (APT) and other tokens
 * @param {Array} tokenIds - Array of token IDs (e.g., ["aptos", "bitcoin", "ethereum"])
 * @param {Object} options - Options for fetching (useFallback, forceRefresh)
 * @returns {Object} Object with token prices mapped by ID
 */
async function getTokenPrices(tokenIds = ['aptos'], options = {}) {
  const cacheKey = options.customCacheKey || CACHE_KEYS.TOKEN_PRICES;
  const forceRefresh = options.forceRefresh || false;
  
  // Use cached data if available and not forcing refresh
  if (!forceRefresh && dataCache.has(cacheKey)) {
    return dataCache.get(cacheKey);
  }
  
  try {
    // Join token IDs for API call
    const ids = Array.isArray(tokenIds) ? tokenIds.join(',') : tokenIds;
    
    // Start performance measurement
    const startTime = performance.now();
    
    // Fetch prices from CoinGecko
    const response = await axios.get(`${API_ENDPOINTS.COINGECKO}/simple/price`, {
      params: {
        ids,
        vs_currencies: 'usd',
        include_24hr_change: true,
        include_market_cap: true
      },
      timeout: 5000
    });
    
    // Process response into a more usable format
    const prices = {};
    for (const [id, data] of Object.entries(response.data)) {
      prices[id] = {
        price: data.usd,
        change24h: data.usd_24h_change || 0,
        marketCap: data.usd_market_cap || 0,
        timestamp: Date.now()
      };
    }
    
    // Performance logging
    const duration = performance.now() - startTime;
    if (duration > 1000) {
      console.warn(`Slow token price fetch: ${duration.toFixed(2)}ms`);
    }
    
    // Cache the result
    dataCache.set(cacheKey, prices);
    return prices;
  } catch (error) {
    console.error('Error fetching token prices:', error.message);
    
    // Use fallback data source if primary fails
    if (options.useFallback !== false) {
      try {
        // Try CoinMarketCap as fallback if API key is provided
        if (process.env.COINMARKETCAP_API_KEY) {
          const cmcResponse = await axios.get(`${API_ENDPOINTS.COINMARKETCAP}/cryptocurrency/quotes/latest`, {
            params: { symbol: 'APT' },
            headers: { 'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY }
          });
          
          const prices = {};
          for (const token of tokenIds) {
            const symbol = token === 'aptos' ? 'APT' : token.toUpperCase();
            const data = cmcResponse.data.data[symbol];
            
            if (data) {
              prices[token] = {
                price: data.quote.USD.price,
                change24h: data.quote.USD.percent_change_24h || 0,
                marketCap: data.quote.USD.market_cap || 0,
                timestamp: Date.now()
              };
            }
          }
          
          if (Object.keys(prices).length > 0) {
            dataCache.set(cacheKey, prices);
            return prices;
          }
        }
      } catch (fallbackError) {
        console.error('Fallback price source also failed:', fallbackError.message);
      }
    }
    
    // If cached data exists, return it even if outdated
    if (dataCache.has(cacheKey)) {
      console.log('Returning cached price data after API failure');
      return dataCache.get(cacheKey);
    }
    
    // Return default values as last resort
    return tokenIds.reduce((result, token) => {
      // Default price values if all else fails
      result[token] = {
        price: token === 'aptos' ? 12.5 : 1,
        change24h: 0,
        marketCap: 0,
        timestamp: Date.now(),
        isDefault: true
      };
      return result;
    }, {});
  }
}

/**
 * Get APT price with simpler interface
 * @param {Object} options - Options for fetching
 * @returns {Number} APT price in USD
 */
async function getAptPrice(options = {}) {
  try {
    const aptData = await getTokenPrices(['aptos'], {
      ...options,
      customCacheKey: CACHE_KEYS.APT_PRICE
    });
    return aptData.aptos?.price || 12.5;
  } catch (error) {
    console.error('Error fetching APT price:', error.message);
    return 12.5; // Default fallback price
  }
}

/**
 * Fetch historical price data for a token
 * @param {String} tokenId - Token ID (e.g., "aptos")
 * @param {Number} days - Number of days of history to fetch (1, 7, 30, 90, etc.)
 * @param {Object} options - Options for fetching
 * @returns {Array} Array of price data points
 */
async function getHistoricalPrices(tokenId, days = 7, options = {}) {
  const cacheKey = `${CACHE_KEYS.HISTORICAL_PRICES}${tokenId}_${days}`;
  const forceRefresh = options.forceRefresh || false;
  
  // Use cached data if available
  if (!forceRefresh && dataCache.has(cacheKey)) {
    return dataCache.get(cacheKey);
  }
  
  try {
    const response = await axios.get(`${API_ENDPOINTS.COINGECKO}/coins/${tokenId}/market_chart`, {
      params: {
        vs_currency: 'usd',
        days: days,
        interval: days > 30 ? 'daily' : undefined
      },
      timeout: 5000
    });
    
    // Process price data
    const priceData = response.data.prices.map(([timestamp, price]) => ({
      timestamp,
      date: new Date(timestamp).toISOString(),
      price
    }));
    
    // Cache the result
    dataCache.set(cacheKey, priceData, days > 1 ? 3600 : 300); // Cache longer for historical data
    return priceData;
  } catch (error) {
    console.error(`Error fetching historical prices for ${tokenId}:`, error.message);
    
    // If cached data exists, return it even if outdated
    if (dataCache.has(cacheKey)) {
      return dataCache.get(cacheKey);
    }
    
    // Generate simulated data as fallback
    return generateSimulatedPriceHistory(tokenId, days);
  }
}

/**
 * Generate simulated price history when API fails
 * @param {String} tokenId - Token ID
 * @param {Number} days - Number of days
 * @returns {Array} Simulated price data
 */
function generateSimulatedPriceHistory(tokenId, days) {
  const currentPrice = tokenId === 'aptos' ? 12.5 : 1;
  const volatility = tokenId === 'aptos' ? 0.05 : 0.02; // 5% daily volatility for APT
  const data = [];
  
  const now = Date.now();
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  
  for (let i = days; i >= 0; i--) {
    const timestamp = now - (i * millisecondsPerDay);
    const noise = ((Math.random() * 2) - 1) * volatility;
    const dayFactor = 1 - (i / days) * 0.2; // Slight trend factor
    const price = currentPrice * (1 + noise) * dayFactor;
    
    data.push({
      timestamp,
      date: new Date(timestamp).toISOString(),
      price: parseFloat(price.toFixed(4))
    });
  }
  
  return data;
}

/**
 * Fetch protocol APRs and staking data
 * @param {Object} options - Options for fetching
 * @returns {Object} Protocol staking data with APRs
 */
async function getProtocolAPRs(options = {}) {
  const cacheKey = CACHE_KEYS.PROTOCOL_APRS;
  const forceRefresh = options.forceRefresh || false;
  
  // Use cached data if available and not forcing refresh
  if (!forceRefresh && dataCache.has(cacheKey)) {
    return dataCache.get(cacheKey);
  }
  
  try {
    // Fetch data from various sources and combine
    const [aptosDefiData, defiLlamaData] = await Promise.all([
      fetchAptosDefiAPRs(),
      fetchDefiLlamaYields('aptos')
    ]);
    
    // Combine and normalize data
    const protocols = {};
    
    // Process DeFiLlama data
    if (defiLlamaData && Array.isArray(defiLlamaData)) {
      defiLlamaData.forEach(pool => {
        const protocolName = pool.project.toLowerCase();
        
        if (!protocols[protocolName]) {
          protocols[protocolName] = {
            staking: {},
            lending: {},
            amm: {}
          };
        }
        
        // Determine protocol category
        const category = pool.category.toLowerCase().includes('stake') ? 'staking' : 
                       pool.category.toLowerCase().includes('lend') ? 'lending' : 'amm';
        
        // Add pool data
        protocols[protocolName][category] = {
          apr: parseFloat(pool.apy) * 100,
          apy: parseFloat(pool.apy) * 100,
          tvl: pool.tvlUsd,
          product: pool.symbol || pool.pool,
          updated: Date.now()
        };
      });
    }
    
    // Override with more precise Aptos network data
    if (aptosDefiData) {
      for (const [protocol, data] of Object.entries(aptosDefiData)) {
        if (!protocols[protocol]) {
          protocols[protocol] = {};
        }
        
        if (data.staking) protocols[protocol].staking = data.staking;
        if (data.lending) protocols[protocol].lending = data.lending;
        if (data.amm) protocols[protocol].amm = data.amm;
      }
    }
    
    // Add protocol addresses
    for (const [protocol, address] of Object.entries(PROTOCOL_ADDRESSES)) {
      if (protocols[protocol]) {
        protocols[protocol].address = address;
      }
    }
    
    // Calculate recommended protocol based on highest APR
    const recommendedProtocol = Object.entries(protocols)
      .filter(([_, data]) => data.staking && data.staking.apr > 0)
      .sort(([_, a], [_, b]) => b.staking.apr - a.staking.apr)[0]?.[0] || 'amnis';
    
    const result = {
      protocols,
      updated: Date.now(),
      recommendedProtocol,
      strategies: generateStrategies(protocols)
    };
    
    // Cache the result
    dataCache.set(cacheKey, result, 3600); // Cache for 1 hour
    return result;
  } catch (error) {
    console.error('Error fetching protocol APRs:', error.message);
    
    // If cached data exists, return it even if outdated
    if (dataCache.has(cacheKey)) {
      return dataCache.get(cacheKey);
    }
    
    // Return default values as last resort
    return generateDefaultProtocolData();
  }
}

/**
 * Fetch DeFi protocol yields from DeFiLlama
 * @param {String} chain - Chain name (e.g., "aptos")
 * @returns {Array} Protocol yield data
 */
async function fetchDefiLlamaYields(chain = 'aptos') {
  try {
    const response = await axios.get(`${API_ENDPOINTS.DEFILLAMA}/pools`, {
      params: { chain },
      timeout: 10000
    });
    
    if (!response.data || !Array.isArray(response.data.data)) {
      throw new Error('Invalid response from DeFiLlama');
    }
    
    return response.data.data.filter(pool => pool.apy > 0);
  } catch (error) {
    console.error('Error fetching DeFiLlama yields:', error.message);
    return [];
  }
}

/**
 * Fetch APRs specifically from Aptos network protocols
 * @returns {Object} APR data by protocol
 */
async function fetchAptosDefiAPRs() {
  try {
    // Example implementation - would need specific API endpoints or on-chain queries
    // This is a placeholder that would need to be replaced with real implementation
    
    // For a production app, you would query each protocol's API or GraphQL endpoints
    const protocols = {
      amnis: await fetchProtocolAPR('amnis', 'https://api.amnisapp.xyz/stats'),
      thala: await fetchProtocolAPR('thala', 'https://api.thala.fi/pools'),
      tortuga: await fetchProtocolAPR('tortuga', 'https://api.tortuga.finance/stats'),
      aries: await fetchProtocolAPR('aries', 'https://api.aries.markets/pools')
    };
    
    return protocols;
  } catch (error) {
    console.error('Error fetching Aptos DeFi APRs:', error.message);
    return null;
  }
}

/**
 * Fetch APR for a specific protocol
 * @param {String} protocol - Protocol name
 * @param {String} endpoint - API endpoint for protocol
 * @returns {Object} Protocol APR data
 */
async function fetchProtocolAPR(protocol, endpoint) {
  try {
    const response = await axios.get(endpoint, { timeout: 5000 });
    
    // Process response based on protocol-specific data formats
    switch (protocol) {
      case 'amnis':
        return {
          staking: {
            apr: response.data.staking?.apr || 5.25,
            apy: response.data.staking?.apy || 5.39,
            tvl: response.data.staking?.tvl || 0,
            product: 'stAPT',
            updated: Date.now()
          }
        };
        
      case 'thala':
        return {
          staking: {
            apr: response.data.staking?.apr || 4.87,
            apy: response.data.staking?.apy || 4.99,
            tvl: response.data.staking?.tvl || 0,
            product: 'sthAPT',
            updated: Date.now()
          }
        };
        
      case 'tortuga':
        return {
          staking: {
            apr: response.data.staking?.apr || 4.61,
            apy: response.data.staking?.apy || 4.72,
            tvl: response.data.staking?.tvl || 0,
            product: 'tAPT',
            updated: Date.now()
          }
        };
        
      case 'aries':
        return {
          lending: {
            apr: response.data.lending?.supplyApr || 3.15,
            apy: response.data.lending?.supplyApy || 3.2,
            tvl: response.data.lending?.tvl || 0,
            product: 'Lending Pool',
            updated: Date.now()
          }
        };
        
      default:
        return {};
    }
  } catch (error) {
    console.error(`Error fetching ${protocol} APR:`, error.message);
    
    // Return default fallback values
    if (protocol === 'amnis') {
      return {
        staking: { apr: 5.25, apy: 5.39, product: 'stAPT', updated: Date.now() }
      };
    } else if (protocol === 'thala') {
      return {
        staking: { apr: 4.87, apy: 4.99, product: 'sthAPT', updated: Date.now() }
      };
    } else if (protocol === 'tortuga') {
      return {
        staking: { apr: 4.61, apy: 4.72, product: 'tAPT', updated: Date.now() }
      };
    } else if (protocol === 'aries') {
      return {
        lending: { apr: 3.15, apy: 3.2, product: 'Lending Pool', updated: Date.now() }
      };
    }
    
    return {};
  }
}

/**
 * Generate optimal staking strategies based on protocol data
 * @param {Object} protocols - Protocol data
 * @returns {Object} Staking strategies
 */
function generateStrategies(protocols) {
  // Create strategies with different risk profiles
  const strategies = {
    conservative: {
      name: 'Conservative',
      description: 'Lower risk, stable returns',
      riskLevel: 'low',
      allocation: []
    },
    balanced: {
      name: 'Balanced',
      description: 'Moderate risk and returns',
      riskLevel: 'medium',
      allocation: []
    },
    aggressive: {
      name: 'Aggressive',
      description: 'Higher risk for maximum returns',
      riskLevel: 'high',
      allocation: []
    },
    maxYield: {
      name: 'Maximum Yield',
      description: 'Optimized for highest possible returns',
      riskLevel: 'very high',
      allocation: []
    }
  };
  
  // Sort protocols by staking APR
  const stakingProtocols = Object.entries(protocols)
    .filter(([_, data]) => data.staking && data.staking.apr > 0)
    .sort(([_, a], [_, b]) => b.staking.apr - a.staking.apr);
  
  if (stakingProtocols.length === 0) {
    return strategies;
  }
  
  // Create allocations based on risk profiles
  // Conservative - Focus on top-tier established protocols
  if (stakingProtocols.length >= 1) {
    // For conservative, allocate 100% to the most established protocol (not necessarily highest APR)
    const conservative = stakingProtocols.find(([name]) => ['amnis', 'thala'].includes(name)) || stakingProtocols[0];
    strategies.conservative.allocation.push({
      protocol: conservative[0],
      percentage: 100,
      apr: conservative[1].staking.apr
    });
    strategies.conservative.apr = conservative[1].staking.apr;
  }
  
  // Balanced - Split between top 2-3 protocols
  if (stakingProtocols.length >= 2) {
    let totalPercent = 0;
    let totalApr = 0;
    
    // Allocate to top 2-3 protocols
    stakingProtocols.slice(0, Math.min(3, stakingProtocols.length)).forEach(([name, data], index) => {
      const percentage = index === 0 ? 50 : index === 1 ? 30 : 20;
      strategies.balanced.allocation.push({
        protocol: name,
        percentage,
        apr: data.staking.apr
      });
      
      totalPercent += percentage;
      totalApr += (percentage / 100) * data.staking.apr;
    });
    
    strategies.balanced.apr = totalApr;
  }
  
  // Aggressive - Higher allocation to highest APR protocols
  if (stakingProtocols.length >= 1) {
    let totalPercent = 0;
    let totalApr = 0;
    
    // Higher weighting to highest APR protocols
    stakingProtocols.slice(0, Math.min(4, stakingProtocols.length)).forEach(([name, data], index) => {
      const percentage = index === 0 ? 40 : index === 1 ? 30 : index === 2 ? 20 : 10;
      strategies.aggressive.allocation.push({
        protocol: name,
        percentage,
        apr: data.staking.apr
      });
      
      totalPercent += percentage;
      totalApr += (percentage / 100) * data.staking.apr;
    });
    
    strategies.aggressive.apr = totalApr;
  }
  
  // Maximum Yield - Concentrate on highest APR protocol with some diversification
  if (stakingProtocols.length >= 1) {
    const topProtocol = stakingProtocols[0];
    
    strategies.maxYield.allocation.push({
      protocol: topProtocol[0],
      percentage: 70,
      apr: topProtocol[1].staking.apr
    });
    
    let totalApr = 0.7 * topProtocol[1].staking.apr;
    
    // Add some diversification with 2nd and 3rd highest APR protocols
    if (stakingProtocols.length >= 3) {
      strategies.maxYield.allocation.push({
        protocol: stakingProtocols[1][0],
        percentage: 20,
        apr: stakingProtocols[1][1].staking.apr
      });
      
      strategies.maxYield.allocation.push({
        protocol: stakingProtocols[2][0],
        percentage: 10,
        apr: stakingProtocols[2][1].staking.apr
      });
      
      totalApr += 0.2 * stakingProtocols[1][1].staking.apr;
      totalApr += 0.1 * stakingProtocols[2][1].staking.apr;
    } else if (stakingProtocols.length >= 2) {
      // If only 2 protocols are available
      strategies.maxYield.allocation.push({
        protocol: stakingProtocols[1][0],
        percentage: 30,
        apr: stakingProtocols[1][1].staking.apr
      });
      
      totalApr += 0.3 * stakingProtocols[1][1].staking.apr;
    }
    
    strategies.maxYield.apr = totalApr;
  }
  
  return strategies;
}

/**
 * Generate default protocol data when API calls fail
 * @returns {Object} Default protocol data
 */
function generateDefaultProtocolData() {
  return {
    protocols: {
      amnis: {
        staking: { apr: 5.25, apy: 5.39, product: 'stAPT', updated: Date.now() },
        address: PROTOCOL_ADDRESSES.amnis
      },
      thala: {
        staking: { apr: 4.87, apy: 4.99, product: 'sthAPT', updated: Date.now() },
        address: PROTOCOL_ADDRESSES.thala
      },
      tortuga: {
        staking: { apr: 4.61, apy: 4.72, product: 'tAPT', updated: Date.now() },
        address: PROTOCOL_ADDRESSES.tortuga
      },
      ditto: {
        staking: { apr: 4.35, apy: 4.44, product: 'dAPT', updated: Date.now() },
        address: PROTOCOL_ADDRESSES.ditto
      },
      aries: {
        lending: { apr: 3.15, apy: 3.2, product: 'Lending Pool', updated: Date.now() },
        address: PROTOCOL_ADDRESSES.aries
      },
      echo: {
        lending: { apr: 2.95, apy: 3.0, product: 'Echo Lending', updated: Date.now() },
        address: PROTOCOL_ADDRESSES.echo
      },
      pancakeswap: {
        amm: { apr: 8.5, apy: 8.87, product: 'APT-USDC LP', updated: Date.now() },
        address: PROTOCOL_ADDRESSES.pancakeswap
      },
      liquidswap: {
        amm: { apr: 7.8, apy: 8.12, product: 'APT-USDC LP', updated: Date.now() },
        address: PROTOCOL_ADDRESSES.liquidswap
      }
    },
    updated: Date.now(),
    recommendedProtocol: 'amnis',
    strategies: {
      conservative: {
        name: 'Conservative',
        description: 'Lower risk, stable returns',
        riskLevel: 'low',
        allocation: [
          { protocol: 'amnis', percentage: 100, apr: 5.25 }
        ],
        apr: 5.25
      },
      balanced: {
        name: 'Balanced',
        description: 'Moderate risk and returns',
        riskLevel: 'medium',
        allocation: [
          { protocol: 'amnis', percentage: 50, apr: 5.25 },
          { protocol: 'thala', percentage: 30, apr: 4.87 },
          { protocol: 'tortuga', percentage: 20, apr: 4.61 }
        ],
        apr: 5.01
      },
      aggressive: {
        name: 'Aggressive',
        description: 'Higher risk for maximum returns',
        riskLevel: 'high',
        allocation: [
          { protocol: 'amnis', percentage: 35, apr: 5.25 },
          { protocol: 'thala', percentage: 25, apr: 4.87 },
          { protocol: 'pancakeswap', percentage: 25, apr: 8.5 },
          { protocol: 'liquidswap', percentage: 15, apr: 7.8 }
        ],
        apr: 6.31
      },
      maxYield: {
        name: 'Maximum Yield',
        description: 'Optimized for highest possible returns',
        riskLevel: 'very high',
        allocation: [
          { protocol: 'pancakeswap', percentage: 50, apr: 8.5 },
          { protocol: 'liquidswap', percentage: 30, apr: 7.8 },
          { protocol: 'amnis', percentage: 20, apr: 5.25 }
        ],
        apr: 7.67
      }
    }
  };
}

/**
 * Fetch trending meme coins and token data
 * @param {Object} options - Options for fetching
 * @returns {Object} Meme coin data
 */
async function getMemeCoinsData(options = {}) {
  const cacheKey = CACHE_KEYS.MEMECOIN_DATA;
  const forceRefresh = options.forceRefresh || false;
  
  // Use cached data if available and not forcing refresh
  if (!forceRefresh && dataCache.has(cacheKey)) {
    return dataCache.get(cacheKey);
  }
  
  try {
    // In a real implementation, this would fetch from CoinGecko or other API
    // This is a simplified version with some static data
    
    // Fetch APT price for reference
    const aptPrice = await getAptPrice();
    
    // Create meme coin data
    const coinData = {
      coins: [
        {
          id: 'aptos',
          symbol: 'APT',
          name: 'Aptos',
          image: 'https://cryptologos.cc/logos/aptos-apt-logo.svg?v=026',
          price: aptPrice,
          change24h: 2.34,
          change7d: 5.21,
          marketCap: 4571234567,
          rank: 1
        },
        {
          id: 'aptogotchi',
          symbol: 'APTOGOTCHI',
          name: 'Aptogotchi',
          price: 0.024,
          change24h: 12.5,
          change7d: 25.7,
          marketCap: 12500000,
          rank: 2
        },
        {
          id: 'aptoads',
          symbol: 'APTOADS',
          name: 'Aptoads',
          price: 0.0075,
          change24h: 8.3,
          change7d: 15.2,
          marketCap: 7800000,
          rank: 3
        },
        {
          id: 'moveape',
          symbol: 'MOVEAPE',
          name: 'MoveApe',
          price: 0.0032,
          change24h: -5.7,
          change7d: 9.8,
          marketCap: 5400000,
          rank: 4
        },
        {
          id: 'aptosaurus',
          symbol: 'APTOSAURUS',
          name: 'Aptosaurus',
          price: 0.00085,
          change24h: 22.4,
          change7d: 45.6,
          marketCap: 3200000,
          rank: 5
        }
      ],
      marketInfo: {
        totalMarketCap: 4600134567,
        totalVolume24h: 325876123,
        aptDominance: 99.37,
        change24h: 3.45,
        sentiment: aptPrice > 12 ? "Bullish" : "Neutral"
      },
      lastUpdated: new Date().toISOString()
    };
    
    // Cache the result
    dataCache.set(cacheKey, coinData, 300); // Cache for 5 minutes
    return coinData;
  } catch (error) {
    console.error('Error fetching meme coin data:', error.message);
    
    // If cached data exists, return it even if outdated
    if (dataCache.has(cacheKey)) {
      return dataCache.get(cacheKey);
    }
    
    // Return default values as last resort
    return {
      coins: [
        {
          id: 'aptos',
          symbol: 'APT',
          name: 'Aptos',
          image: 'https://cryptologos.cc/logos/aptos-apt-logo.svg?v=026',
          price: 12.5,
          change24h: 0,
          marketCap: 4500000000,
          rank: 1
        }
      ],
      marketInfo: {
        totalMarketCap: 4500000000,
        totalVolume24h: 300000000,
        aptDominance: 100,
        change24h: 0,
        sentiment: "Neutral"
      },
      lastUpdated: new Date().toISOString()
    };
  }
}

/**
 * Get market overview with combined data
 * @param {Object} options - Options for fetching
 * @returns {Object} Market overview data
 */
async function getMarketOverview(options = {}) {
  const cacheKey = CACHE_KEYS.MARKET_OVERVIEW;
  const forceRefresh = options.forceRefresh || false;
  
  // Use cached data if available and not forcing refresh
  if (!forceRefresh && dataCache.has(cacheKey)) {
    return dataCache.get(cacheKey);
  }
  
  try {
    // Fetch multiple data sources in parallel
    const [priceData, protocolData, memeCoinsData] = await Promise.all([
      getTokenPrices(['aptos', 'bitcoin', 'ethereum']),
      getProtocolAPRs(),
      getMemeCoinsData()
    ]);
    
    // Combine into a comprehensive market overview
    const overview = {
      prices: {
        apt: priceData.aptos,
        btc: priceData.bitcoin,
        eth: priceData.ethereum
      },
      defi: {
        protocols: protocolData.protocols,
        recommendedProtocol: protocolData.recommendedProtocol,
        strategies: protocolData.strategies,
        totalTvl: calculateTotalTVL(protocolData.protocols)
      },
      tokens: {
        trending: memeCoinsData.coins.slice(0, 5),
        marketInfo: memeCoinsData.marketInfo
      },
      updated: Date.now()
    };
    
    // Cache the result
    dataCache.set(cacheKey, overview, 600); // Cache for 10 minutes
    return overview;
  } catch (error) {
    console.error('Error fetching market overview:', error.message);
    
    // If cached data exists, return it even if outdated
    if (dataCache.has(cacheKey)) {
      return dataCache.get(cacheKey);
    }
    
    // Return empty structure
    return {
      prices: {},
      defi: { protocols: {}, recommendedProtocol: 'amnis', strategies: {}, totalTvl: 0 },
      tokens: { trending: [], marketInfo: {} },
      updated: Date.now()
    };
  }
}

/**
 * Calculate total TVL from protocols data
 * @param {Object} protocols - Protocol data
 * @returns {Number} Total TVL
 */
function calculateTotalTVL(protocols) {
  let totalTvl = 0;
  
  for (const protocol of Object.values(protocols)) {
    if (protocol.staking && protocol.staking.tvl) {
      totalTvl += parseFloat(protocol.staking.tvl) || 0;
    }
    if (protocol.lending && protocol.lending.tvl) {
      totalTvl += parseFloat(protocol.lending.tvl) || 0;
    }
    if (protocol.amm && protocol.amm.tvl) {
      totalTvl += parseFloat(protocol.amm.tvl) || 0;
    }
  }
  
  return totalTvl;
}

/**
 * Clear all caches to force fresh data
 */
function clearAllCaches() {
  dataCache.flushAll();
  console.log('All market data caches cleared');
}

module.exports = {
  getTokenPrices,
  getAptPrice,
  getHistoricalPrices,
  getProtocolAPRs,
  getMemeCoinsData,
  getMarketOverview,
  clearAllCaches,
  PROTOCOL_ADDRESSES,
  CACHE_KEYS
};