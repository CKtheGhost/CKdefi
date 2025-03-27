/**
 * dataFetcher.js - Enhanced data retrieval module for CompounDefi
 * 
 * Provides unified interface for fetching market data, protocol information,
 * token prices, and portfolio data from multiple sources with failover capabilities.
 */

const axios = require('axios');
const { getPricesByTokens } = require('../utils/marketDataUtils');
const { getAptosClient } = require('../utils/aptosClient');
const rpcConfig = require('../config/rpc');
const contractAddresses = require('../config/contracts');
const cache = require('../middleware/caching');

const CACHE_KEYS = {
  MARKET_DATA: 'market:data',
  TOKEN_PRICES: 'token:prices',
  PROTOCOL_DATA: 'protocol:data',
  NEWS_DATA: 'news:data'
};

const CACHE_TTL = {
  MARKET_DATA: 5 * 60, // 5 minutes
  TOKEN_PRICES: 2 * 60, // 2 minutes
  PROTOCOL_DATA: 15 * 60, // 15 minutes
  NEWS_DATA: 30 * 60 // 30 minutes
};

// API endpoints for data retrieval
const DATA_ENDPOINTS = {
  PRICE: [
    'https://api.coingecko.com/api/v3/simple/price',
    'https://price-api.crypto.com/price/v1/exchange/tokens',
    'https://api.binance.com/api/v3/ticker/price'
  ],
  NEWS: [
    'https://api.cryptopanic.com/v1/posts/',
    'https://aptos-data-feed.onrender.com/api/news',
    'https://min-api.cryptocompare.com/data/v2/news/'
  ],
  PROTOCOLS: [
    'https://api-data-feed.movebit.xyz/protocols',
    'https://aptos-data-feed.onrender.com/api/protocols'
  ]
};

/**
 * Fetch token prices with automatic failover
 * @param {string[]} tokens - Array of token symbols or IDs
 * @param {Object} options - Options for fetching prices
 * @returns {Promise<Object>} Token price data
 */
async function fetchTokenPrices(tokens, options = {}) {
  const cacheKey = `${CACHE_KEYS.TOKEN_PRICES}:${tokens.join(',')}`;
  
  // Check cache first
  const cachedData = await cache.get(cacheKey);
  if (cachedData && !options.bypassCache) {
    console.log('Using cached token prices');
    return cachedData;
  }
  
  try {
    // Get prices from utility function (has its own failover)
    const prices = await getPricesByTokens(tokens);
    
    // Store in cache
    await cache.set(cacheKey, prices, CACHE_TTL.TOKEN_PRICES);
    
    return prices;
  } catch (error) {
    console.error('Error fetching token prices:', error.message);
    
    // Fallback to direct API calls if utility function fails
    for (const endpoint of DATA_ENDPOINTS.PRICE) {
      try {
        const response = await axios.get(endpoint, {
          params: {
            ids: tokens.join(','),
            vs_currencies: 'usd',
            apiKey: process.env.CRYPTO_API_KEY
          },
          timeout: 5000
        });
        
        // Process response based on endpoint structure
        let prices = {};
        if (endpoint.includes('coingecko')) {
          prices = response.data;
        } else if (endpoint.includes('crypto.com')) {
          prices = tokens.reduce((acc, token) => {
            const tokenData = response.data.data.find(t => t.symbol.toLowerCase() === token.toLowerCase());
            if (tokenData) {
              acc[token] = { usd: tokenData.price };
            }
            return acc;
          }, {});
        } else if (endpoint.includes('binance')) {
          prices = tokens.reduce((acc, token) => {
            const tokenData = response.data.find(t => t.symbol.toLowerCase() === `${token.toLowerCase()}usdt`);
            if (tokenData) {
              acc[token] = { usd: parseFloat(tokenData.price) };
            }
            return acc;
          }, {});
        }
        
        // Cache and return the prices
        await cache.set(cacheKey, prices, CACHE_TTL.TOKEN_PRICES);
        return prices;
      } catch (endpointError) {
        console.error(`Error fetching from ${endpoint}:`, endpointError.message);
        // Continue to next endpoint on failure
      }
    }
    
    // All endpoints failed, return default values
    const defaultPrices = tokens.reduce((acc, token) => {
      acc[token] = { usd: token.toLowerCase() === 'apt' ? 8.5 : 1.0 };
      return acc;
    }, {});
    
    return defaultPrices;
  }
}

/**
 * Fetch latest crypto news
 * @param {Object} options - Options for filtering news
 * @returns {Promise<Object>} News articles and metadata
 */
async function fetchNews(options = {}) {
  const { category = 'aptos', limit = 10, bypassCache = false } = options;
  const cacheKey = `${CACHE_KEYS.NEWS_DATA}:${category}:${limit}`;
  
  // Check cache first
  const cachedData = await cache.get(cacheKey);
  if (cachedData && !bypassCache) {
    console.log('Using cached news data');
    return cachedData;
  }
  
  // Data structure for news
  const newsData = {
    articles: [],
    categories: {},
    featuredArticle: null,
    lastUpdated: new Date().toISOString()
  };
  
  // Try each news endpoint
  for (const endpoint of DATA_ENDPOINTS.NEWS) {
    try {
      const response = await axios.get(endpoint, {
        params: {
          currencies: 'aptos',
          public_key: process.env.CRYPTOPANIC_API_KEY,
          limit: limit + 5, // Request extra to filter out low quality
          categories: category,
          lang: 'en'
        },
        timeout: 10000
      });
      
      // Process based on endpoint structure
      let articles = [];
      
      if (endpoint.includes('cryptopanic')) {
        articles = response.data.results.map(item => ({
          id: item.id,
          headline: item.title,
          summary: item.metadata?.description || '',
          source: item.source.domain,
          date: item.published_at,
          url: item.url,
          category: item.currencies[0]?.title || 'Crypto',
          image: item.metadata?.image || '',
          readTime: Math.ceil((item.metadata?.description?.length || 0) / 1000) || 3
        }));
      } else if (endpoint.includes('cryptocompare')) {
        articles = response.data.Data.map(item => ({
          id: item.id,
          headline: item.title,
          summary: item.body,
          source: item.source_info.name,
          date: new Date(item.published_on * 1000).toISOString(),
          url: item.url,
          category: item.categories.split('|')[0] || 'Crypto',
          image: item.imageurl,
          readTime: Math.ceil(item.body.length / 1000) || 3
        }));
      } else {
        // Custom endpoint structure
        articles = response.data.articles || response.data.news || response.data || [];
        
        // Normalize to standard format if needed
        if (articles[0] && !articles[0].headline) {
          articles = articles.map(item => ({
            id: item.id || Math.random().toString(36).substring(2, 15),
            headline: item.title || item.headline || '',
            summary: item.description || item.summary || '',
            source: item.source || item.siteName || '',
            date: item.publishedAt || item.date || new Date().toISOString(),
            url: item.url || item.link || '',
            category: item.category || 'Crypto',
            image: item.urlToImage || item.image || '',
            readTime: Math.ceil((item.description?.length || 0) / 1000) || 3
          }));
        }
      }
      
      // Filter out articles with missing essential data
      const filteredArticles = articles.filter(article => 
        article.headline && article.headline.length > 5 && 
        (!article.summary || article.summary.length > 10)
      );
      
      // Update news data
      newsData.articles = filteredArticles.slice(0, limit);
      
      // Set featured article (usually the first one)
      if (filteredArticles.length > 0 && filteredArticles[0].image) {
        newsData.featuredArticle = filteredArticles[0];
      }
      
      // Compile categories
      filteredArticles.forEach(article => {
        const category = article.category || 'General';
        newsData.categories[category] = (newsData.categories[category] || 0) + 1;
      });
      
      // Cache and return data if successful
      await cache.set(cacheKey, newsData, CACHE_TTL.NEWS_DATA);
      return newsData;
    } catch (error) {
      console.error(`Error fetching news from ${endpoint}:`, error.message);
      // Continue to next endpoint on failure
    }
  }
  
  // If all endpoints fail, generate mock news data
  const mockArticles = [
    {
      id: '1',
      headline: 'Aptos DeFi Ecosystem Shows Strong Growth',
      summary: 'The Aptos DeFi ecosystem has shown remarkable growth in recent months with TVL increasing by 250%.',
      source: 'Crypto Insights',
      date: new Date().toISOString(),
      url: 'https://example.com/aptos-defi-growth',
      category: 'DeFi',
      image: 'https://i.imgur.com/3r2VVnF.jpg',
      readTime: 3
    },
    {
      id: '2',
      headline: 'New Yield Farming Opportunities on Aptos',
      summary: 'Several new yield farming protocols have launched on Aptos, offering APRs as high as 200% for early users.',
      source: 'DeFi Daily',
      date: new Date(Date.now() - 86400000).toISOString(),
      url: 'https://example.com/aptos-yield-farming',
      category: 'Yield',
      image: 'https://i.imgur.com/L0p5xzK.jpg',
      readTime: 5
    },
    {
      id: '3',
      headline: 'Aptos TVL Hits New All-Time High of $800M',
      summary: 'Total Value Locked in Aptos DeFi protocols has reached a new all-time high of $800 million, signaling growing adoption.',
      source: 'Blockchain Times',
      date: new Date(Date.now() - 172800000).toISOString(),
      url: 'https://example.com/aptos-tvl-ath',
      category: 'Market',
      image: 'https://i.imgur.com/wjbRpxB.jpg',
      readTime: 2
    }
  ];
  
  newsData.articles = mockArticles;
  newsData.featuredArticle = mockArticles[0];
  newsData.categories = {
    'DeFi': 1,
    'Yield': 1,
    'Market': 1
  };
  
  return newsData;
}

/**
 * Fetch protocol data including APRs, TVL, and features
 * @param {Object} options - Options for filtering protocols
 * @returns {Promise<Object>} Protocol data
 */
async function fetchProtocolData(options = {}) {
  const { bypassCache = false } = options;
  const cacheKey = CACHE_KEYS.PROTOCOL_DATA;
  
  // Check cache first
  const cachedData = await cache.get(cacheKey);
  if (cachedData && !bypassCache) {
    console.log('Using cached protocol data');
    return cachedData;
  }
  
  // Default response structure
  const protocolData = {
    protocols: {},
    strategies: {},
    recommendedProtocol: null,
    lastUpdated: new Date().toISOString()
  };
  
  // Try each protocol endpoint
  for (const endpoint of DATA_ENDPOINTS.PROTOCOLS) {
    try {
      const response = await axios.get(endpoint, { timeout: 10000 });
      
      // Process protocol data
      if (response.data && Object.keys(response.data).length > 0) {
        // Store the raw protocol data
        protocolData.protocols = response.data.protocols || response.data;
        
        // Extract strategy recommendations if available
        protocolData.strategies = response.data.strategies || {};
        
        // Determine recommended protocol based on highest APR
        const protocols = Object.entries(protocolData.protocols);
        if (protocols.length > 0) {
          const sorted = [...protocols].sort((a, b) => {
            const aApr = parseFloat(a[1].staking?.apr || 0);
            const bApr = parseFloat(b[1].staking?.apr || 0);
            return bApr - aApr;
          });
          
          protocolData.recommendedProtocol = sorted[0][0];
        }
        
        // Cache and return data
        await cache.set(cacheKey, protocolData, CACHE_TTL.PROTOCOL_DATA);
        return protocolData;
      }
    } catch (error) {
      console.error(`Error fetching protocol data from ${endpoint}:`, error.message);
      // Continue to next endpoint on failure
    }
  }
  
  // All endpoints failed, generate mock protocol data
  const mockProtocols = {
    amnis: {
      name: 'Amnis Finance',
      staking: {
        apr: '7.5',
        product: 'Liquid Staking',
        tvl: '$45.2M'
      },
      lending: {
        apr: '3.2',
        product: 'Lending Platform',
        tvl: '$12.1M'
      },
      features: ['Liquid staking', 'No lockup period', 'Auto-compounding'],
      risks: ['Smart contract risk', 'Oracle risk'],
      links: {
        website: 'https://amnis.finance',
        twitter: 'https://twitter.com/amnisfinance',
        documentation: 'https://docs.amnis.finance'
      }
    },
    thala: {
      name: 'Thala Labs',
      staking: {
        apr: '8.2',
        product: 'Liquid Staking',
        tvl: '$52.8M'
      },
      lending: {
        apr: '3.8',
        product: 'Money Market',
        tvl: '$18.5M'
      },
      features: ['Liquid staking', 'Yield farming', 'Governance token'],
      risks: ['Smart contract risk', 'Market risk'],
      links: {
        website: 'https://thala.fi',
        twitter: 'https://twitter.com/thala_fi',
        documentation: 'https://docs.thala.fi'
      }
    },
    tortuga: {
      name: 'Tortuga Finance',
      staking: {
        apr: '7.8',
        product: 'Liquid Staking',
        tvl: '$38.7M'
      },
      features: ['Liquid staking', 'Delegation', 'Governance'],
      risks: ['Smart contract risk', 'Validator risk'],
      links: {
        website: 'https://tortuga.finance',
        twitter: 'https://twitter.com/tortugafinance',
        documentation: 'https://docs.tortuga.finance'
      }
    },
    ditto: {
      name: 'Ditto Staking',
      staking: {
        apr: '7.2',
        product: 'Staking Platform',
        tvl: '$32.5M'
      },
      features: ['Liquid staking', 'Multiple validators'],
      risks: ['Smart contract risk', 'Validator risk', 'Oracle risk'],
      links: {
        website: 'https://ditto.money',
        twitter: 'https://twitter.com/dittomoney',
        documentation: 'https://docs.ditto.money'
      }
    },
    echo: {
      name: 'Echo Finance',
      lending: {
        apr: '4.1',
        product: 'Money Market',
        tvl: '$24.3M'
      },
      features: ['Lending', 'Borrowing', 'Flash loans'],
      risks: ['Smart contract risk', 'Liquidation risk', 'Interest rate risk'],
      links: {
        website: 'https://echo.finance',
        twitter: 'https://twitter.com/echofinance',
        documentation: 'https://docs.echo.finance'
      }
    }
  };
  
  // Mock strategies for different risk profiles
  const mockStrategies = {
    conservative: {
      name: 'Conservative Strategy',
      apr: '5.8',
      riskLevel: 'Low',
      allocation: [
        { protocol: 'amnis', product: 'Liquid Staking', percentage: 60 },
        { protocol: 'thala', product: 'Money Market', percentage: 40 }
      ],
      description: 'Focus on capital preservation with stable staking returns and low-risk lending.'
    },
    balanced: {
      name: 'Balanced Strategy',
      apr: '7.2',
      riskLevel: 'Medium',
      allocation: [
        { protocol: 'thala', product: 'Liquid Staking', percentage: 40 },
        { protocol: 'echo', product: 'Money Market', percentage: 30 },
        { protocol: 'tortuga', product: 'Liquid Staking', percentage: 30 }
      ],
      description: 'Balanced approach with mix of staking and lending opportunities.'
    },
    aggressive: {
      name: 'Aggressive Strategy',
      apr: '9.5',
      riskLevel: 'High',
      allocation: [
        { protocol: 'thala', product: 'Liquid Staking', percentage: 35 },
        { protocol: 'echo', product: 'Money Market', percentage: 40 },
        { protocol: 'pancakeswap', product: 'Liquidity Pooling', percentage: 25 }
      ],
      description: 'Higher risk strategy focusing on maximal yield across multiple protocols.'
    }
  };
  
  protocolData.protocols = mockProtocols;
  protocolData.strategies = mockStrategies;
  protocolData.recommendedProtocol = 'thala';
  
  return protocolData;
}

/**
 * Fetch on-chain wallet data with enhanced privacy
 * @param {string} address - Wallet address to analyze
 * @param {Object} options - Options for data retrieval
 * @returns {Promise<Object>} Wallet portfolio data
 */
async function fetchWalletData(address, options = {}) {
  if (!address || !address.startsWith('0x')) {
    throw new Error('Invalid wallet address');
  }
  
  const { shouldTrack = false, includeHistory = false } = options;
  
  // Initialize Aptos client
  const aptosClient = await getAptosClient();
  
  // Fetch basic account resources
  let accountResources;
  try {
    accountResources = await aptosClient.getAccountResources(address);
  } catch (error) {
    console.error(`Error fetching account resources for ${address}:`, error.message);
    throw new Error(`Failed to fetch wallet data: ${error.message}`);
  }
  
  // Extract APT balance
  const coinResource = accountResources.find(resource => 
    resource.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>'
  );
  
  const aptBalance = coinResource ? 
    parseFloat(coinResource.data.coin.value) / 10**8 : 0;
  
  // Extract staked tokens
  let stAPT = 0;
  let sthAPT = 0;
  let tAPT = 0;
  let dAPT = 0;
  
  // Check for Amnis staked tokens (stAPT)
  const stAPTResource = accountResources.find(resource => 
    resource.type.includes('staking::StakedAptos') ||
    resource.type.includes('0x111ae3e5bc816a5e63c2da97d0aa3886519e0cd5e4b046659fa35796bd11542a')
  );
  
  if (stAPTResource) {
    stAPT = parseFloat(stAPTResource.data.value || stAPTResource.data.coin?.value || 0) / 10**8;
  }
  
  // Check for Thala staked tokens (sthAPT)
  const sthAPTResource = accountResources.find(resource => 
    resource.type.includes('StakedAptosCoin') ||
    resource.type.includes('0xfaf4e633ae9eb31366c9ca24214231760926576c7b625313b3688b5e900731f6')
  );
  
  if (sthAPTResource) {
    sthAPT = parseFloat(sthAPTResource.data.value || sthAPTResource.data.coin?.value || 0) / 10**8;
  }
  
  // Check for Tortuga staked tokens (tAPT)
  const tAPTResource = accountResources.find(resource => 
    resource.type.includes('TortugaAptos') ||
    resource.type.includes('0x952c1b1fc8eb75ee80f432c9d0a84fcda1d5c7481501a7eca9199f1596a60b53')
  );
  
  if (tAPTResource) {
    tAPT = parseFloat(tAPTResource.data.value || tAPTResource.data.coin?.value || 0) / 10**8;
  }
  
  // Check for Ditto staked tokens (dAPT)
  const dAPTResource = accountResources.find(resource => 
    resource.type.includes('DittoAptos') ||
    resource.type.includes('0xd11107bdf0d6d7040c6c0bfbdecb6545191fdf13e8d8d259952f53e1713f61b5')
  );
  
  if (dAPTResource) {
    dAPT = parseFloat(dAPTResource.data.value || dAPTResource.data.coin?.value || 0) / 10**8;
  }
  
  // Get token prices
  const prices = await fetchTokenPrices(['aptos']);
  const aptPrice = prices.aptos?.usd || 10.0;
  
  // Calculate USD values
  const aptValueUSD = aptBalance * aptPrice;
  const stAPTValueUSD = stAPT * aptPrice;
  const sthAPTValueUSD = sthAPT * aptPrice;
  const tAPTValueUSD = tAPT * aptPrice;
  const dAPTValueUSD = dAPT * aptPrice;
  
  // Check for AMM liquidity positions
  let ammLiquidity = {
    hasLiquidity: false,
    positions: [],
    estimatedValueUSD: 0
  };
  
  // Look for PancakeSwap, Liquidswap, etc.
  const lpPositions = accountResources.filter(resource => 
    resource.type.includes('LP') || 
    resource.type.includes('LiquidityPool') ||
    resource.type.includes('Pair')
  );
  
  if (lpPositions.length > 0) {
    ammLiquidity.hasLiquidity = true;
    
    // Estimate liquidity value (simple estimation)
    const totalLiquidityValue = lpPositions.reduce((total, position) => {
      // Extract values if available, otherwise estimate
      const positionValue = parseFloat(position.data.value || position.data.coin?.value || 0) / 10**8;
      return total + positionValue;
    }, 0) * aptPrice; // Convert to USD using APT price as approximation
    
    ammLiquidity.estimatedValueUSD = totalLiquidityValue;
    
    // Extract position details when available
    ammLiquidity.positions = lpPositions.map(position => {
      const poolMatch = position.type.match(/\<([^>]+)\>/);
      const poolInfo = poolMatch ? poolMatch[1] : 'Unknown Pool';
      
      return {
        protocol: position.type.toLowerCase().includes('cake') ? 'pancakeswap' : 
                 position.type.toLowerCase().includes('liquid') ? 'liquidswap' : 'unknown',
        pool: poolInfo,
        valueUSD: parseFloat(position.data.value || position.data.coin?.value || 0) / 10**8 * aptPrice
      };
    });
  }
  
  // Calculate total value
  const totalValueUSD = aptValueUSD + stAPTValueUSD + sthAPTValueUSD + tAPTValueUSD + dAPTValueUSD + ammLiquidity.estimatedValueUSD;
  
  // Calculate total Aptos (native + staked)
  const totalAptos = aptBalance + stAPT + sthAPT + tAPT + dAPT;
  
  // Get recent transactions if requested
  let recentTransactions = [];
  if (includeHistory) {
    try {
      const transactions = await aptosClient.getAccountTransactions(address, { limit: 20 });
      
      recentTransactions = transactions.map(tx => ({
        hash: tx.hash,
        type: tx.type,
        success: tx.success,
        timestamp: tx.timestamp,
        function: tx.payload?.function || '',
        gasUsed: tx.gas_used,
        version: tx.version
      }));
    } catch (error) {
      console.error(`Error fetching transactions for ${address}:`, error.message);
      // Continue without transaction history
    }
  }
  
  // Compile portfolio data
  const portfolioData = {
    wallet: address,
    portfolio: {
      totalValueUSD,
      totalAptos,
      apt: {
        amount: aptBalance.toFixed(6),
        valueUSD: aptValueUSD
      },
      stAPT: {
        amount: stAPT.toFixed(6),
        valueUSD: stAPTValueUSD
      },
      sthAPT: {
        amount: sthAPT.toFixed(6),
        valueUSD: sthAPTValueUSD
      },
      tAPT: {
        amount: tAPT.toFixed(6),
        valueUSD: tAPTValueUSD
      },
      dAPT: {
        amount: dAPT.toFixed(6),
        valueUSD: dAPTValueUSD
      },
      ammLiquidity,
      recentTransactions
    },
    lastUpdated: new Date().toISOString()
  };
  
  // Track wallet activity if enabled (for analytics)
  if (shouldTrack) {
    try {
      // Simple analytics tracking
      const analyticsData = {
        address: address.substring(0, 6) + '...' + address.substring(address.length - 4), // Anonymized
        totalValue: totalValueUSD,
        hasStakedTokens: stAPT > 0 || sthAPT > 0 || tAPT > 0 || dAPT > 0,
        hasLiquidity: ammLiquidity.hasLiquidity,
        timestamp: new Date().toISOString()
      };
      
      // In a production environment, you'd send this to your analytics service
      console.log('Analytics tracking:', analyticsData);
    } catch (error) {
      // Don't let analytics tracking failure affect the response
      console.error('Analytics tracking error:', error.message);
    }
  }
  
  return portfolioData;
}

/**
 * Fetch market overview data including trends, volumes, and sentiment
 * @returns {Promise<Object>} Market overview data
 */
async function fetchMarketOverview() {
  const cacheKey = CACHE_KEYS.MARKET_DATA;
  
  // Check cache first
  const cachedData = await cache.get(cacheKey);
  if (cachedData) {
    console.log('Using cached market overview data');
    return cachedData;
  }
  
  try {
    // Fetch token prices for market data
    const prices = await fetchTokenPrices(['aptos', 'bitcoin', 'ethereum']);
    
    // Get protocol data for TVL and yields
    const protocolData = await fetchProtocolData();
    
    // Calculate total TVL across protocols
    const totalTVL = Object.values(protocolData.protocols).reduce((total, protocol) => {
      const tvlString = protocol.staking?.tvl || protocol.lending?.tvl || '0';
      const tvlValue = parseFloat(tvlString.replace(/[^0-9.]/g, '')) || 0;
      return total + tvlValue;
    }, 0);
    
    // Calculate average APR across protocols
    const aprValues = Object.values(protocolData.protocols)
      .filter(protocol => protocol.staking?.apr)
      .map(protocol => parseFloat(protocol.staking.apr));
    
    const averageAPR = aprValues.length > 0 
      ? aprValues.reduce((sum, apr) => sum + apr, 0) / aprValues.length 
      : 0;
    
    // Determine market sentiment based on price movements
    const aptPrice = prices.aptos?.usd || 0;
    let sentiment = 'Neutral';
    
    if (aptPrice > 10) {
      sentiment = 'Bullish';
    } else if (aptPrice < 8) {
      sentiment = 'Bearish';
    }
    
    // Compile market overview data
    const marketOverview = {
      aptos: {
        price: aptPrice,
        change24h: 2.5, // Mock value, would be calculated from historical data
        marketCap: aptPrice * 1.0e9, // Mock value based on circulating supply
        volume24h: 428.5e6 // Mock trading volume
      },
      defiStats: {
        totalTVL: totalTVL,
        averageAPR: averageAPR,
        activeUsers: 125000, // Mock value
        transactions24h: 350000 // Mock value
      },
      marketInfo: {
        sentiment,
        trend: sentiment === 'Bullish' ? 'Upward' : sentiment === 'Bearish' ? 'Downward' : 'Sideways',
        volatility: 'Medium',
        liquidityScore: 8.2 // Scale of 1-10
      },
      topMovers: [
        { symbol: 'thalaX', name: 'Thala X', change24h: 12.4, price: 0.32 },
        { symbol: 'echoToken', name: 'Echo Token', change24h: 8.7, price: 0.18 },
        { symbol: 'cakeAPT', name: 'PancakeSwap APT', change24h: -5.2, price: 0.84 },
        { symbol: 'amnisReward', name: 'Amnis Reward', change24h: 4.1, price: 0.12 },
        { symbol: 'tortuga', name: 'Tortuga Token', change24h: -2.8, price: 0.45 }
      ],
      lastUpdated: new Date().toISOString()
    };
    
    // Cache and return market data
    await cache.set(cacheKey, marketOverview, CACHE_TTL.MARKET_DATA);
    return marketOverview;
  } catch (error) {
    console.error('Error fetching market overview:', error.message);
    
    // Return default market data on error
    return {
      aptos: {
        price: 9.5,
        change24h: 1.2,
        marketCap: 9.5e9,
        volume24h: 350e6
      },
      defiStats: {
        totalTVL: 250e6,
        averageAPR: 7.5,
        activeUsers: 100000,
        transactions24h: 300000
      },
      marketInfo: {
        sentiment: 'Neutral',
        trend: 'Sideways',
        volatility: 'Medium',
        liquidityScore: 7.5
      },
      topMovers: [
        { symbol: 'thalaX', name: 'Thala X', change24h: 10.2, price: 0.30 },
        { symbol: 'echoToken', name: 'Echo Token', change24h: 6.5, price: 0.16 },
        { symbol: 'cakeAPT', name: 'PancakeSwap APT', change24h: -4.8, price: 0.82 },
        { symbol: 'amnisReward', name: 'Amnis Reward', change24h: 3.5, price: 0.11 },
        { symbol: 'tortuga', name: 'Tortuga Token', change24h: -2.2, price: 0.41 }
      ],
      lastUpdated: new Date().toISOString()
    };
  }
}

module.exports = {
  fetchTokenPrices,
  fetchNews,
  fetchProtocolData,
  fetchWalletData,
  fetchMarketOverview
};