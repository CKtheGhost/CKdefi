/**
 * portfolio_tracker.js - Wallet portfolio tracking and analysis module for CompounDefi
 * 
 * This module fetches and analyzes wallet portfolio data from the Aptos blockchain,
 * including native APT, staked tokens, and liquidity positions.
 */

const axios = require('axios');
const { Aptos, AptosConfig, Network } = require('@aptos-labs/ts-sdk');
const marketDataUtils = require('../utils/marketDataUtils');

// Initialize Aptos client with fallback RPC endpoints
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

// LiquidStaking token addresses
const LIQUID_STAKING_TOKENS = {
  stAPT: '0x111ae3e5bc816a5e63c2da97d0aa3886519e0cd5e4b046659fa35796bd11542a::staking::StakedAptos',
  sthAPT: '0xfaf4e633ae9eb31366c9ca24214231760926576c7b625313b3688b5e900731f6::stake::StakedAptos',
  tAPT: '0x952c1b1fc8eb75ee80f432c9d0a84fcda1d5c7481501a7eca9199f1596a60b53::stapt_token::StakedApt',
  dAPT: '0xd11107bdf0d6d7040c6c0bfbdecb6545191fdf13e8d8d259952f53e1713f61b5::ditto::DittoAPT'
};

// AMM Protocol addresses
const AMM_PROTOCOLS = {
  liquidswap: '0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12',
  pancakeswap: '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa',
  cetus: '0x27156bd56eb5637b9adde4d915b596f92d2f28f0ade2eaef48fa73e360e4e8a6'
};

let aptosClient = null;

// Initialize Aptos client with the best available endpoint
async function initializeAptosClient() {
  if (aptosClient) return aptosClient;
  
  const network = process.env.APTOS_NETWORK === 'TESTNET' ? Network.TESTNET : Network.MAINNET;
  const endpoints = network === Network.TESTNET ? APTOS_RPC_ENDPOINTS.TESTNET : APTOS_RPC_ENDPOINTS.MAINNET;
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Trying RPC endpoint: ${endpoint}`);
      const response = await axios.get(`${endpoint}/info`, { 
        timeout: 5000
      });
      
      if (response.status === 200) {
        console.log(`Successfully connected to RPC endpoint: ${endpoint}`);
        
        const config = new AptosConfig({ 
          network,
          clientConfig: {
            FULLNODE_URL: endpoint,
            INDEXER_URL: network === Network.TESTNET 
              ? "https://indexer.testnet.aptoslabs.com/v1/graphql"
              : "https://indexer.mainnet.aptoslabs.com/v1/graphql"
          }
        });
        
        aptosClient = new Aptos(config);
        return aptosClient;
      }
    } catch (error) {
      console.error(`Failed to connect to RPC endpoint ${endpoint}:`, error.message);
    }
  }
  
  console.warn(`All RPC endpoints failed, defaulting to first one: ${endpoints[0]}`);
  const config = new AptosConfig({ 
    network,
    clientConfig: {
      FULLNODE_URL: endpoints[0]
    }
  });
  
  aptosClient = new Aptos(config);
  return aptosClient;
}

/**
 * Get wallet portfolio data including APT balance, staked tokens, and liquidity positions
 * @param {String} walletAddress - Wallet address to analyze
 * @returns {Promise<Object>} Portfolio data
 */
async function getPortfolioData(walletAddress) {
  try {
    // Validate wallet address format
    if (!walletAddress.startsWith('0x') || walletAddress.length !== 66) {
      throw new Error('Invalid wallet address format');
    }
    
    // Initialize Aptos client
    const aptos = await initializeAptosClient();
    
    // Fetch APT price from market data
    const aptPrice = await marketDataUtils.getTokenPrice('aptos');
    
    // Fetch account resources in parallel
    const [accountResources, accountTransactions] = await Promise.all([
      aptos.getAccountResources(walletAddress),
      fetchRecentTransactions(walletAddress)
    ]);
    
    // Extract APT balance
    const coinStore = accountResources.find(
      (r) => r.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>'
    );
    
    const aptBalance = coinStore ? parseInt(coinStore.data.coin.value) / 100000000 : 0;
    const aptValueUSD = aptBalance * aptPrice;
    
    // Extract staked tokens balances
    const stakedTokensData = extractStakedTokensData(accountResources, aptPrice);
    
    // Check for AMM liquidity positions
    const ammLiquidityData = await checkAmmLiquidity(walletAddress, aptos, aptPrice);
    
    // Calculate total portfolio value
    const totalValueUSD = 
      aptValueUSD + 
      (stakedTokensData.stAPT?.valueUSD || 0) + 
      (stakedTokensData.sthAPT?.valueUSD || 0) + 
      (stakedTokensData.tAPT?.valueUSD || 0) + 
      (stakedTokensData.dAPT?.valueUSD || 0) + 
      (ammLiquidityData.hasLiquidity ? ammLiquidityData.valueUSD : 0);
    
    // Calculate total APT value (including staked)
    const totalAptos = 
      aptBalance + 
      parseFloat(stakedTokensData.stAPT?.amount || 0) + 
      parseFloat(stakedTokensData.sthAPT?.amount || 0) + 
      parseFloat(stakedTokensData.tAPT?.amount || 0) + 
      parseFloat(stakedTokensData.dAPT?.amount || 0);
    
    // Format and return portfolio data
    return {
      wallet: walletAddress,
      portfolio: {
        apt: {
          amount: aptBalance.toFixed(6),
          valueUSD: aptValueUSD.toFixed(2)
        },
        ...stakedTokensData,
        ammLiquidity: ammLiquidityData,
        totalValueUSD: totalValueUSD.toFixed(2),
        totalAptos: totalAptos.toFixed(6),
        recentTransactions: accountTransactions,
        lastUpdated: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    throw new Error(`Failed to fetch portfolio data: ${error.message}`);
  }
}

/**
 * Extract staked tokens data from account resources
 * @param {Array} accountResources - Account resources
 * @param {Number} aptPrice - Current APT price
 * @returns {Object} Staked tokens data
 */
function extractStakedTokensData(accountResources, aptPrice) {
  const result = {};
  
  // Check for stAPT (Amnis)
  const stAPTResource = accountResources.find(
    (r) => r.type === `0x1::coin::CoinStore<${LIQUID_STAKING_TOKENS.stAPT}>`
  );
  
  if (stAPTResource && parseInt(stAPTResource.data.coin.value) > 0) {
    const stAPTAmount = parseInt(stAPTResource.data.coin.value) / 100000000;
    result.stAPT = {
      amount: stAPTAmount.toFixed(6),
      valueUSD: (stAPTAmount * aptPrice).toFixed(2),
      protocol: 'amnis'
    };
  }
  
  // Check for sthAPT (Thala)
  const sthAPTResource = accountResources.find(
    (r) => r.type === `0x1::coin::CoinStore<${LIQUID_STAKING_TOKENS.sthAPT}>`
  );
  
  if (sthAPTResource && parseInt(sthAPTResource.data.coin.value) > 0) {
    const sthAPTAmount = parseInt(sthAPTResource.data.coin.value) / 100000000;
    result.sthAPT = {
      amount: sthAPTAmount.toFixed(6),
      valueUSD: (sthAPTAmount * aptPrice).toFixed(2),
      protocol: 'thala'
    };
  }
  
  // Check for tAPT (Tortuga)
  const tAPTResource = accountResources.find(
    (r) => r.type === `0x1::coin::CoinStore<${LIQUID_STAKING_TOKENS.tAPT}>`
  );
  
  if (tAPTResource && parseInt(tAPTResource.data.coin.value) > 0) {
    const tAPTAmount = parseInt(tAPTResource.data.coin.value) / 100000000;
    result.tAPT = {
      amount: tAPTAmount.toFixed(6),
      valueUSD: (tAPTAmount * aptPrice).toFixed(2),
      protocol: 'tortuga'
    };
  }
  
  // Check for dAPT (Ditto)
  const dAPTResource = accountResources.find(
    (r) => r.type === `0x1::coin::CoinStore<${LIQUID_STAKING_TOKENS.dAPT}>`
  );
  
  if (dAPTResource && parseInt(dAPTResource.data.coin.value) > 0) {
    const dAPTAmount = parseInt(dAPTResource.data.coin.value) / 100000000;
    result.dAPT = {
      amount: dAPTAmount.toFixed(6),
      valueUSD: (dAPTAmount * aptPrice).toFixed(2),
      protocol: 'ditto'
    };
  }
  
  return result;
}

/**
 * Check for AMM liquidity positions
 * @param {String} walletAddress - Wallet address to check
 * @param {Object} aptos - Aptos client instance
 * @param {Number} aptPrice - Current APT price
 * @returns {Promise<Object>} Liquidity positions data
 */
async function checkAmmLiquidity(walletAddress, aptos, aptPrice) {
  try {
    // Initialize result
    const result = {
      hasLiquidity: false,
      positions: [],
      valueUSD: 0
    };
    
    // Check for LP tokens and positions in supported protocols
    let totalLiquidityValue = 0;
    
    // Check PancakeSwap positions
    try {
      const pancakePositions = await axios.get(`https://api.pancakeswap.finance/v1/aptos/positions/${walletAddress}`);
      
      if (pancakePositions.data?.positions?.length > 0) {
        result.hasLiquidity = true;
        
        pancakePositions.data.positions.forEach(position => {
          const positionValue = parseFloat(position.valueUSD || 0);
          totalLiquidityValue += positionValue;
          
          result.positions.push({
            protocol: 'pancakeswap',
            valueUSD: positionValue.toFixed(2),
            pool: position.pool?.name || 'Unknown Pool',
            valueInApt: (positionValue / aptPrice).toFixed(6)
          });
        });
      }
    } catch (error) {
      console.log('Error checking PancakeSwap positions:', error.message);
    }
    
    // Check Liquidswap positions (simplified)
    try {
      const liquidswapPositions = await axios.get(`https://api.liquidswap.com/v1/pools/positions/${walletAddress}`);
      
      if (liquidswapPositions.data?.positions?.length > 0) {
        result.hasLiquidity = true;
        
        liquidswapPositions.data.positions.forEach(position => {
          const positionValue = parseFloat(position.value || 0);
          totalLiquidityValue += positionValue;
          
          result.positions.push({
            protocol: 'liquidswap',
            valueUSD: positionValue.toFixed(2),
            pool: position.poolName || 'Unknown Pool',
            valueInApt: (positionValue / aptPrice).toFixed(6)
          });
        });
      }
    } catch (error) {
      console.log('Error checking Liquidswap positions:', error.message);
    }
    
    // If we couldn't get specific positions but user has LP tokens, provide an estimate
    if (!result.hasLiquidity) {
      // Search for LP token types in resources
      const resources = await aptos.getAccountResources(walletAddress);
      const lpTokens = resources.filter(r => 
        r.type.includes('LiquidityToken') || 
        r.type.includes('LpToken') || 
        r.type.includes('PancakeLP')
      );
      
      if (lpTokens.length > 0) {
        result.hasLiquidity = true;
        result.estimatedCount = lpTokens.length;
        
        // Rough estimate of value (very approximate)
        totalLiquidityValue = lpTokens.length * 100; // $100 per position rough estimate
        result.estimationMethod = 'token_count';
      }
    }
    
    // Update total value
    result.valueUSD = totalLiquidityValue;
    result.estimatedValueUSD = totalLiquidityValue;
    
    return result;
  } catch (error) {
    console.error('Error checking AMM liquidity:', error);
    return { hasLiquidity: false, valueUSD: 0 };
  }
}

/**
 * Fetch recent transactions for a wallet
 * @param {String} walletAddress - Wallet address
 * @returns {Promise<Array>} Recent transactions
 */
async function fetchRecentTransactions(walletAddress) {
  try {
    const response = await axios.get(
      `https://fullnode.mainnet.aptoslabs.com/v1/accounts/${walletAddress}/transactions?limit=10`
    );
    
    return response.data.map(tx => ({
      hash: tx.hash,
      type: determineTransactionType(tx),
      timestamp: tx.timestamp,
      success: tx.success,
      gasUsed: tx.gas_used
    }));
  } catch (error) {
    console.error('Error fetching recent transactions:', error);
    return [];
  }
}

/**
 * Determine transaction type from transaction data
 * @param {Object} tx - Transaction data
 * @returns {String} Transaction type
 */
function determineTransactionType(tx) {
  try {
    if (!tx.payload) return 'unknown';
    
    const functionName = tx.payload.function;
    
    if (functionName.includes('::staking::')) {
      return functionName.includes('::stake') ? 'stake' : 'unstake';
    } else if (functionName.includes('::lending::') || functionName.includes('::pool::')) {
      return functionName.includes('::supply') || functionName.includes('::deposit') 
        ? 'lend' 
        : 'withdraw';
    } else if (functionName.includes('::router::') || functionName.includes('::swap::')) {
      if (functionName.includes('::add_liquidity')) {
        return 'addLiquidity';
      } else if (functionName.includes('::remove_liquidity')) {
        return 'removeLiquidity';
      } else if (functionName.includes('::swap')) {
        return 'swap';
      }
    } else if (functionName.includes('0x1::coin::transfer')) {
      return 'transfer';
    }
    
    return 'other';
  } catch (error) {
    return 'unknown';
  }
}

/**
 * Analyze portfolio performance
 * @param {String} walletAddress - Wallet address
 * @param {Object} portfolioData - Current portfolio data
 * @returns {Promise<Object>} Performance analysis
 */
async function analyzePortfolioPerformance(walletAddress, portfolioData) {
  try {
    // Get historical APT price data
    const historicalPrices = await marketDataUtils.getHistoricalPrices('aptos', 30); // 30 days
    
    // Calculate estimated portfolio value over time
    const totalAptos = parseFloat(portfolioData.totalAptos || 0);
    const historicalData = [];
    
    historicalPrices.forEach(pricePoint => {
      historicalData.push({
        date: pricePoint.date,
        value: (totalAptos * pricePoint.price).toFixed(2),
        price: pricePoint.price
      });
    });
    
    // Calculate basic performance metrics
    const startValue = parseFloat(historicalData[0]?.value || 0);
    const endValue = parseFloat(historicalData[historicalData.length - 1]?.value || 0);
    const absoluteChange = endValue - startValue;
    const percentageChange = startValue > 0 ? (absoluteChange / startValue) * 100 : 0;
    
    // Calculate volatility
    const returns = [];
    for (let i = 1; i < historicalData.length; i++) {
      const prevValue = parseFloat(historicalData[i-1].value);
      const currentValue = parseFloat(historicalData[i].value);
      if (prevValue > 0) {
        returns.push((currentValue - prevValue) / prevValue);
      }
    }
    
    const volatility = calculateVolatility(returns) * 100;
    
    return {
      historicalData,
      performance: {
        startValue: startValue.toFixed(2),
        endValue: endValue.toFixed(2),
        absoluteChange: absoluteChange.toFixed(2),
        percentageChange: percentageChange.toFixed(2),
        period: '30 days',
        volatility: volatility.toFixed(2)
      },
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error analyzing portfolio performance:', error);
    return {
      error: `Failed to analyze portfolio performance: ${error.message}`,
      lastUpdated: new Date().toISOString()
    };
  }
}

/**
 * Calculate volatility (standard deviation of returns)
 * @param {Array} returns - Array of daily returns
 * @returns {Number} Volatility
 */
function calculateVolatility(returns) {
  if (returns.length === 0) return 0;
  
  const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const squareDiffs = returns.map(r => Math.pow(r - mean, 2));
  const variance = squareDiffs.reduce((sum, d) => sum + d, 0) / returns.length;
  
  return Math.sqrt(variance);
}

module.exports = {
  getPortfolioData,
  analyzePortfolioPerformance
};