// portfolio_tracker.js
// Core module for tracking and analyzing user portfolios on Aptos

const { Aptos, AptosConfig, Network } = require('@aptos-labs/ts-sdk');
const axios = require('axios');
const { fetchAptosTokenPrice } = require('../utils/marketDataUtils');

// Initialize Aptos clients for different networks
const APTOS_RPC_ENDPOINTS = {
  MAINNET: [
    "https://fullnode.mainnet.aptoslabs.com/v1",
    "https://aptos-mainnet.nodereal.io/v1/94b7ed5c0b7e423fa0c7b6fb595e6fc0/v1",
    "https://aptos-mainnet-rpc.publicnode.com",
    "https://rpc.ankr.com/aptos"
  ],
  TESTNET: [
    "https://fullnode.testnet.aptoslabs.com/v1",
    "https://aptos-testnet.nodereal.io/v1/94b7ed5c0b7e423fa0c7b6fb595e6fc0/v1",
    "https://aptos-testnet-rpc.publicnode.com"
  ]
};

// Known token addresses for liquid staking derivatives
const KNOWN_TOKENS = {
  // Liquid staking tokens
  "0x1::aptos_coin::AptosCoin": { symbol: "APT", name: "Aptos Coin", decimals: 8 },
  "0x111ae3e5bc816a5e63c2da97d0aa3886519e0cd5e4b046659fa35796bd11542a::stapt_token::StakedApt": { symbol: "stAPT", name: "Amnis Staked APT", decimals: 8 },
  "0xfaf4e633ae9eb31366c9ca24214231760926576c7b625313b3688b5e900731f6::stake_token::StakedAptos": { symbol: "sthAPT", name: "Thala Staked APT", decimals: 8 },
  "0x952c1b1fc8eb75ee80f432c9d0a84fcda1d5c7481501a7eca9199f1596a60b53::staked_apt_coin::StakedAptCoin": { symbol: "tAPT", name: "Tortuga Staked APT", decimals: 8 },
  "0xd11107bdf0d6d7040c6c0bfbdecb6545191fdf13e8d8d259952f53e1713f61b5::ditto_staked_apt::DittoStakedApt": { symbol: "dAPT", name: "Ditto Staked APT", decimals: 8 }
};

/**
 * Get portfolio data for a specific wallet address
 * @param {string} walletAddress - The wallet address to fetch data for
 * @param {Object} options - Options for fetching portfolio data
 * @returns {Promise<Object>} Complete portfolio data
 */
async function getPortfolioData(walletAddress, options = {}) {
  try {
    console.log(`Fetching portfolio data for ${walletAddress}`);
    
    if (!walletAddress.startsWith('0x') || walletAddress.length !== 66) {
      throw new Error('Invalid wallet address format');
    }
    
    // Initialize Aptos client
    const aptosClient = await getAptosClient();
    
    // Get APT price for valuation
    const aptPrice = await fetchAptosTokenPrice();
    
    // Get wallet balances
    const [
      coinBalances,
      stakedPositions,
      liquidityPositions,
      recentTransactions
    ] = await Promise.all([
      getWalletCoinBalances(aptosClient, walletAddress),
      getStakedPositions(aptosClient, walletAddress),
      getLiquidityPositions(aptosClient, walletAddress),
      getRecentTransactions(aptosClient, walletAddress, options.txLimit || 20)
    ]);
    
    // Format portfolio data
    const portfolio = formatPortfolioData(
      walletAddress,
      coinBalances,
      stakedPositions,
      liquidityPositions,
      aptPrice
    );
    
    // Include historical performance data if requested
    if (options.includeHistorical) {
      portfolio.historicalData = await getHistoricalPerformance(walletAddress);
    }
    
    // Add recent transactions
    portfolio.recentTransactions = recentTransactions;
    
    return {
      wallet: walletAddress,
      portfolio,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error fetching portfolio data for ${walletAddress}:`, error);
    throw error;
  }
}

/**
 * Initialize and get an Aptos client
 * @returns {Promise<Aptos>} Initialized Aptos client
 */
async function getAptosClient() {
  try {
    const network = process.env.APTOS_NETWORK === 'TESTNET' ? Network.TESTNET : Network.MAINNET;
    const endpoints = network === Network.TESTNET ? APTOS_RPC_ENDPOINTS.TESTNET : APTOS_RPC_ENDPOINTS.MAINNET;
    
    // Try endpoints until one works
    for (const endpoint of endpoints) {
      try {
        console.log(`Trying RPC endpoint: ${endpoint}`);
        
        const aptosConfig = new AptosConfig({ 
          network,
          clientConfig: { FULLNODE_URL: endpoint },
          timeout: 10000
        });
        
        const aptos = new Aptos(aptosConfig);
        
        // Test the connection
        await aptos.getLedgerInfo();
        console.log(`Successfully connected to RPC endpoint: ${endpoint}`);
        return aptos;
      } catch (error) {
        console.warn(`Failed to connect to RPC endpoint ${endpoint}:`, error.message);
      }
    }
    
    throw new Error('All RPC endpoints failed');
  } catch (error) {
    console.error('Failed to initialize Aptos client:', error);
    
    // Fallback to default config
    const network = process.env.APTOS_NETWORK === 'TESTNET' ? Network.TESTNET : Network.MAINNET;
    const aptosConfig = new AptosConfig({ network });
    return new Aptos(aptosConfig);
  }
}

/**
 * Get wallet coin balances
 * @param {Aptos} aptosClient - Initialized Aptos client
 * @param {string} walletAddress - Wallet address
 * @returns {Promise<Array>} Wallet coin balances
 */
async function getWalletCoinBalances(aptosClient, walletAddress) {
  try {
    const response = await aptosClient.getAccountCoinsData({ accountAddress: walletAddress });
    return response.current_coin_balances || [];
  } catch (error) {
    console.error('Error fetching wallet coin balances:', error);
    return [];
  }
}

/**
 * Get staked positions from wallet resources
 * @param {Aptos} aptosClient - Initialized Aptos client
 * @param {string} walletAddress - Wallet address
 * @returns {Promise<Object>} Staked positions
 */
async function getStakedPositions(aptosClient, walletAddress) {
  try {
    const resources = await aptosClient.getAccountResources({
      accountAddress: walletAddress
    });
    
    const stakedPositions = {
      stAPT: { amount: 0 }, // Amnis
      sthAPT: { amount: 0 }, // Thala
      tAPT: { amount: 0 },   // Tortuga
      dAPT: { amount: 0 }    // Ditto
    };
    
    // Look for staked token resources
    for (const resource of resources) {
      // Amnis stAPT
      if (resource.type.includes('0x111ae3e5bc816a5e63c2da97d0aa3886519e0cd5e4b046659fa35796bd11542a::stapt_token::StakedApt')) {
        stakedPositions.stAPT.amount = parseFloat(resource.data.coin?.value || 0) / 1e8;
      }
      // Thala sthAPT
      else if (resource.type.includes('0xfaf4e633ae9eb31366c9ca24214231760926576c7b625313b3688b5e900731f6::stake_token::StakedAptos')) {
        stakedPositions.sthAPT.amount = parseFloat(resource.data.value || 0) / 1e8;
      }
      // Tortuga tAPT
      else if (resource.type.includes('0x952c1b1fc8eb75ee80f432c9d0a84fcda1d5c7481501a7eca9199f1596a60b53::staked_apt_coin::StakedAptCoin')) {
        stakedPositions.tAPT.amount = parseFloat(resource.data.value || 0) / 1e8;
      }
      // Ditto dAPT
      else if (resource.type.includes('0xd11107bdf0d6d7040c6c0bfbdecb6545191fdf13e8d8d259952f53e1713f61b5::ditto_staked_apt::DittoStakedApt')) {
        stakedPositions.dAPT.amount = parseFloat(resource.data.value || 0) / 1e8;
      }
    }
    
    return stakedPositions;
  } catch (error) {
    console.error('Error fetching staked positions:', error);
    return {
      stAPT: { amount: 0 },
      sthAPT: { amount: 0 },
      tAPT: { amount: 0 },
      dAPT: { amount: 0 }
    };
  }
}

/**
 * Get liquidity positions in AMMs
 * @param {Aptos} aptosClient - Initialized Aptos client
 * @param {string} walletAddress - Wallet address
 * @returns {Promise<Object>} Liquidity positions
 */
async function getLiquidityPositions(aptosClient, walletAddress) {
  try {
    const resources = await aptosClient.getAccountResources({
      accountAddress: walletAddress
    });
    
    let hasLiquidity = false;
    let estimatedValueUSD = 0;
    const positions = [];
    
    // Check for PancakeSwap LP tokens
    const pancakePositions = resources.filter(r => 
      r.type.includes('0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::router::LiquidityPosition')
    );
    
    if (pancakePositions.length > 0) {
      hasLiquidity = true;
      
      for (const position of pancakePositions) {
        if (position.data.balance && parseFloat(position.data.balance) > 0) {
          positions.push({
            protocol: 'pancakeswap',
            poolType: position.data.pool_type || 'Unknown',
            balance: parseFloat(position.data.balance) / 1e8,
            valueUSD: parseFloat(position.data.usd_value || 0)
          });
          estimatedValueUSD += parseFloat(position.data.usd_value || 0);
        }
      }
    }
    
    // Check for Liquidswap LP tokens
    const liquidswapPositions = resources.filter(r => 
      r.type.includes('0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::lp_account::LpBalance')
    );
    
    if (liquidswapPositions.length > 0) {
      hasLiquidity = true;
      
      for (const position of liquidswapPositions) {
        if (position.data.balance && parseFloat(position.data.balance) > 0) {
          positions.push({
            protocol: 'liquidswap',
            poolType: position.data.pool_type || 'Unknown',
            balance: parseFloat(position.data.balance) / 1e8,
            valueUSD: parseFloat(position.data.usd_value || 0)
          });
          estimatedValueUSD += parseFloat(position.data.usd_value || 0);
        }
      }
    }
    
    // Check for Cetus LP tokens
    const cetusPositions = resources.filter(r => 
      r.type.includes('0x27156bd56eb5637b9adde4d915b596f92d2f28f0ade2eaef48fa73e360e4e8a6::pool::LpToken')
    );
    
    if (cetusPositions.length > 0) {
      hasLiquidity = true;
      
      for (const position of cetusPositions) {
        if (position.data.value && parseFloat(position.data.value) > 0) {
          positions.push({
            protocol: 'cetus',
            poolType: 'Standard',
            balance: parseFloat(position.data.value) / 1e8,
            valueUSD: parseFloat(position.data.usd_value || 0)
          });
          estimatedValueUSD += parseFloat(position.data.usd_value || 0);
        }
      }
    }
    
    return {
      hasLiquidity,
      estimatedValueUSD,
      positions
    };
  } catch (error) {
    console.error('Error fetching liquidity positions:', error);
    return {
      hasLiquidity: false,
      estimatedValueUSD: 0,
      positions: []
    };
  }
}

/**
 * Get recent transactions for the wallet
 * @param {Aptos} aptosClient - Initialized Aptos client
 * @param {string} walletAddress - Wallet address
 * @param {number} limit - Maximum number of transactions to return
 * @returns {Promise<Array>} Recent transactions
 */
async function getRecentTransactions(aptosClient, walletAddress, limit = 20) {
  try {
    const transactions = await aptosClient.getAccountTransactions({
      accountAddress: walletAddress,
      limit
    });
    
    return transactions.map(tx => ({
      version: tx.version,
      hash: tx.hash,
      type: tx.type,
      timestamp: tx.timestamp,
      success: tx.success,
      vmStatus: tx.vm_status,
      gasUsed: tx.gas_used,
      gasUnitPrice: tx.gas_unit_price
    }));
  } catch (error) {
    console.error('Error fetching recent transactions:', error);
    return [];
  }
}

/**
 * Get historical performance data for the wallet
 * @param {string} walletAddress - Wallet address
 * @returns {Promise<Array>} Historical performance data
 */
async function getHistoricalPerformance(walletAddress) {
  try {
    // This would typically fetch historical wallet value data from a database
    // For now, we'll return dummy data
    const historicalData = [];
    const now = new Date();
    const aptPrice = await fetchAptosTokenPrice();
    
    // Generate 30 days of historical data
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      
      // Add some random variance
      const variance = 0.9 + (Math.random() * 0.2); // 0.9 to 1.1
      const historicalAptPrice = aptPrice * (1 - (i * 0.005)) * variance;
      
      historicalData.push({
        date: date.toISOString(),
        value: (1000 * historicalAptPrice).toFixed(2) // Assuming constant APT amount
      });
    }
    
    return historicalData;
  } catch (error) {
    console.error('Error fetching historical performance:', error);
    return [];
  }
}

/**
 * Format portfolio data into a standardized structure
 * @param {string} walletAddress - Wallet address
 * @param {Array} coinBalances - Coin balances from the wallet
 * @param {Object} stakedPositions - Staked token positions
 * @param {Object} liquidityPositions - Liquidity positions in AMMs
 * @param {number} aptPrice - Current APT price in USD
 * @returns {Object} Formatted portfolio data
 */
function formatPortfolioData(walletAddress, coinBalances, stakedPositions, liquidityPositions, aptPrice) {
  try {
    // Initialize portfolio
    const portfolio = {
      address: walletAddress,
      totalAptos: 0,
      totalValueUSD: 0,
      apt: { amount: 0, valueUSD: 0 },
      stAPT: { amount: 0, valueUSD: 0 },
      sthAPT: { amount: 0, valueUSD: 0 },
      tAPT: { amount: 0, valueUSD: 0 },
      dAPT: { amount: 0, valueUSD: 0 },
      ammLiquidity: liquidityPositions,
      otherTokens: []
    };
    
    // Process coin balances
    for (const coin of coinBalances) {
      const tokenInfo = KNOWN_TOKENS[coin.coin_type] || {
        symbol: getSymbolFromType(coin.coin_type),
        name: getNameFromType(coin.coin_type),
        decimals: 8
      };
      
      const amount = parseFloat(coin.amount) / Math.pow(10, tokenInfo.decimals);
      
      if (tokenInfo.symbol === 'APT') {
        portfolio.apt = {
          amount: amount.toFixed(6),
          valueUSD: (amount * aptPrice).toFixed(2)
        };
        portfolio.totalAptos += amount;
        portfolio.totalValueUSD += amount * aptPrice;
      } else {
        // Handle other tokens
        const valueUSD = tokenInfo.symbol.includes('APT') ? 
          amount * aptPrice : 0; // For now, non-APT tokens have zero value
        
        portfolio.otherTokens.push({
          symbol: tokenInfo.symbol,
          name: tokenInfo.name,
          amount: amount.toFixed(6),
          valueUSD: valueUSD.toFixed(2)
        });
        
        if (valueUSD > 0) {
          portfolio.totalValueUSD += valueUSD;
        }
      }
    }
    
    // Process staked positions
    for (const [token, position] of Object.entries(stakedPositions)) {
      if (position.amount > 0) {
        const valueUSD = position.amount * aptPrice;
        portfolio[token] = {
          amount: position.amount.toFixed(6),
          valueUSD: valueUSD.toFixed(2)
        };
        portfolio.totalAptos += position.amount;
        portfolio.totalValueUSD += valueUSD;
      }
    }
    
    // Add liquidity position value
    if (liquidityPositions.hasLiquidity) {
      portfolio.totalValueUSD += liquidityPositions.estimatedValueUSD;
    }
    
    // Format total USD value
    portfolio.totalValueUSD = parseFloat(portfolio.totalValueUSD).toFixed(2);
    
    return portfolio;
  } catch (error) {
    console.error('Error formatting portfolio data:', error);
    throw error;
  }
}

/**
 * Extract symbol from token type string
 * @param {string} tokenType - Token type string
 * @returns {string} Token symbol
 */
function getSymbolFromType(tokenType) {
  // Extract the last part of the type string
  const parts = tokenType.split('::');
  if (parts.length === 3) {
    return parts[2];
  }
  return 'Unknown';
}

/**
 * Extract name from token type string
 * @param {string} tokenType - Token type string
 * @returns {string} Token name
 */
function getNameFromType(tokenType) {
  // Extract the last part of the type string and format it
  const parts = tokenType.split('::');
  if (parts.length === 3) {
    return parts[2].replace(/([A-Z])/g, ' $1').trim();
  }
  return 'Unknown Token';
}

/**
 * Calculate portfolio risk metrics
 * @param {Object} portfolio - Portfolio data
 * @returns {Object} Risk metrics
 */
function calculateRiskMetrics(portfolio) {
  try {
    const totalValue = parseFloat(portfolio.totalValueUSD);
    if (totalValue <= 0) return { riskScore: 0, stakeRatio: 0, liquidityRatio: 0 };
    
    // Calculate staked ratio
    const stakedValue = parseFloat(portfolio.stAPT?.valueUSD || 0) +
                        parseFloat(portfolio.sthAPT?.valueUSD || 0) +
                        parseFloat(portfolio.tAPT?.valueUSD || 0) +
                        parseFloat(portfolio.dAPT?.valueUSD || 0);
    
    const stakeRatio = stakedValue / totalValue;
    
    // Calculate liquidity ratio
    const liquidityValue = portfolio.ammLiquidity?.estimatedValueUSD || 0;
    const liquidityRatio = liquidityValue / totalValue;
    
    // Calculate risk score - higher liquidity exposure means higher risk
    const riskScore = Math.min(10, Math.round((liquidityRatio * 10) + (1 - stakeRatio) * 5));
    
    return {
      riskScore,
      stakeRatio,
      liquidityRatio
    };
  } catch (error) {
    console.error('Error calculating risk metrics:', error);
    return { riskScore: 0, stakeRatio: 0, liquidityRatio: 0 };
  }
}

/**
 * Calculate portfolio performance metrics
 * @param {Object} portfolio - Portfolio data
 * @param {Array} historicalData - Historical performance data
 * @returns {Object} Performance metrics
 */
function calculatePerformanceMetrics(portfolio, historicalData) {
  try {
    if (!historicalData || historicalData.length < 2) {
      return { dailyChange: 0, weeklyChange: 0, monthlyChange: 0 };
    }
    
    const currentValue = parseFloat(portfolio.totalValueUSD);
    const lastDayValue = parseFloat(historicalData[historicalData.length - 2].value);
    const weekAgoIndex = Math.max(0, historicalData.length - 8);
    const weekAgoValue = parseFloat(historicalData[weekAgoIndex].value);
    const monthAgoValue = parseFloat(historicalData[0].value);
    
    const dailyChange = ((currentValue - lastDayValue) / lastDayValue) * 100;
    const weeklyChange = ((currentValue - weekAgoValue) / weekAgoValue) * 100;
    const monthlyChange = ((currentValue - monthAgoValue) / monthAgoValue) * 100;
    
    return {
      dailyChange: dailyChange.toFixed(2),
      weeklyChange: weeklyChange.toFixed(2),
      monthlyChange: monthlyChange.toFixed(2)
    };
  } catch (error) {
    console.error('Error calculating performance metrics:', error);
    return { dailyChange: 0, weeklyChange: 0, monthlyChange: 0 };
  }
}

module.exports = {
  getPortfolioData,
  calculateRiskMetrics,
  calculatePerformanceMetrics,
  getHistoricalPerformance
};