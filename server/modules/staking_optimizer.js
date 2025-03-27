/**
 * staking_optimizer.js - Staking and yield optimization module for CompounDefi
 * 
 * This module analyzes staking options across Aptos protocols, identifies optimal allocations
 * based on APR, risk, and liquidity factors, and generates personalized recommendations.
 */

const axios = require('axios');
const { Aptos, AptosConfig, Network } = require('@aptos-labs/ts-sdk');
const marketDataUtils = require('../utils/marketDataUtils');

// Contract addresses for various Aptos staking protocols
const contracts = {
  amnis: "0x111ae3e5bc816a5e63c2da97d0aa3886519e0cd5e4b046659fa35796bd11542a",
  thala: "0xfaf4e633ae9eb31366c9ca24214231760926576c7b625313b3688b5e900731f6",
  tortuga: "0x952c1b1fc8eb75ee80f432c9d0a84fcda1d5c7481501a7eca9199f1596a60b53",
  ditto: "0xd11107bdf0d6d7040c6c0bfbdecb6545191fdf13e8d8d259952f53e1713f61b5",
  aries: "0x9770fa9c725cbd97eb50b2be5f7416efdfd1f1554beb0750d4dae4c64e860da3",
  echo: "0xeab7ea4d635b6b6add79d5045c4a45d8148d88287b1cfa1c3b6a4b56f46839ed",
  liquidswap: "0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12",
  cetus: "0x27156bd56eb5637b9adde4d915b596f92d2f28f0ade2eaef48fa73e360e4e8a6",
  pancakeswap: "0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa"
};

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
 * Fetch current staking data from all supported protocols
 * @returns {Promise<Object>} Staking data including APRs and protocol details
 */
async function getStakingData() {
  try {
    // Initialize Aptos client if needed
    await initializeAptosClient();
    
    // Parallel fetch staking data from all protocols
    const [
      amnisData,
      thalaData,
      tortugaData,
      dittoData,
      ariesData,
      echoData
    ] = await Promise.allSettled([
      fetchAmnisStakingData(),
      fetchThalaStakingData(),
      fetchTortugaStakingData(),
      fetchDittoStakingData(),
      fetchAriesLendingData(),
      fetchEchoLendingData()
    ]);
    
    // Consolidate protocol data
    const protocolsData = {
      amnis: amnisData.status === 'fulfilled' ? amnisData.value : createFallbackData('amnis', 'stake'),
      thala: thalaData.status === 'fulfilled' ? thalaData.value : createFallbackData('thala', 'stake'),
      tortuga: tortugaData.status === 'fulfilled' ? tortugaData.value : createFallbackData('tortuga', 'stake'),
      ditto: dittoData.status === 'fulfilled' ? dittoData.value : createFallbackData('ditto', 'stake'),
      aries: ariesData.status === 'fulfilled' ? ariesData.value : createFallbackData('aries', 'lend'),
      echo: echoData.status === 'fulfilled' ? echoData.value : createFallbackData('echo', 'lend')
    };
    
    // Generate optimal strategies
    const strategies = generateOptimalStrategies(protocolsData);
    
    // Get market sentiment and risk analysis
    const marketAnalysis = await marketDataUtils.getMarketSentiment();
    
    return {
      protocols: protocolsData,
      strategies,
      marketAnalysis,
      lastUpdated: new Date().toISOString(),
      recommendedProtocol: determineRecommendedProtocol(protocolsData)
    };
  } catch (error) {
    console.error('Error getting staking data:', error);
    return {
      protocols: {},
      strategies: {},
      lastUpdated: new Date().toISOString(),
      error: error.message
    };
  }
}

/**
 * Fetch staking data from Amnis protocol
 * @returns {Promise<Object>} Protocol staking data
 */
async function fetchAmnisStakingData() {
  try {
    // Fetch on-chain data and API data
    const response = await axios.get('https://api.amnis.finance/api/v1/staking/stats');
    
    // Calculate rewards and APR
    const aprPercentage = response.data?.apr || response.data?.apy || 4.25;
    
    return {
      name: 'Amnis Finance',
      apr: aprPercentage.toFixed(2),
      tvl: response.data?.tvl || '$54.3M',
      token: 'stAPT',
      tokenPrice: response.data?.stakingTokenPrice || 12.42,
      product: 'Liquid Staking',
      stakingType: 'Liquid',
      cooldownPeriod: 0,
      minimumStake: '0.05 APT',
      features: ['No lockup', 'Liquid staking', 'Ecosystem integrations'],
      risks: ['Smart contract risk', 'Oracle risk'],
      riskRating: 2,
      staking: {
        apr: aprPercentage.toFixed(2),
        product: 'Liquid Staking',
        lockupPeriod: '0 days'
      },
      website: 'https://amnis.finance',
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching Amnis data:', error);
    throw error;
  }
}

/**
 * Fetch staking data from Thala protocol
 * @returns {Promise<Object>} Protocol staking data
 */
async function fetchThalaStakingData() {
  try {
    // Fetch on-chain data and API data
    const response = await axios.get('https://api.thala.fi/aptos/liquid-staking');
    
    // Calculate rewards and APR
    const aprPercentage = response.data?.apr || 4.35;
    
    return {
      name: 'Thala Labs',
      apr: aprPercentage.toFixed(2),
      tvl: response.data?.tvl || '$41.7M',
      token: 'sthAPT',
      tokenPrice: response.data?.tokenPrice || 12.47,
      product: 'Liquid Staking',
      stakingType: 'Liquid',
      cooldownPeriod: 0,
      minimumStake: '0.05 APT',
      features: ['No lockup', 'Yield from validators', 'MEV sharing'],
      risks: ['Smart contract risk', 'Validator risk'],
      riskRating: 2,
      staking: {
        apr: aprPercentage.toFixed(2),
        product: 'Liquid Staking',
        lockupPeriod: '0 days'
      },
      website: 'https://app.thala.fi',
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching Thala data:', error);
    throw error;
  }
}

/**
 * Fetch staking data from Tortuga protocol
 * @returns {Promise<Object>} Protocol staking data
 */
async function fetchTortugaStakingData() {
  try {
    // Fetch on-chain data and API data
    const response = await axios.get('https://api.tortuga.finance/api/v1/stats');
    
    // Calculate rewards and APR
    const aprPercentage = response.data?.apr || 4.3;
    
    return {
      name: 'Tortuga Finance',
      apr: aprPercentage.toFixed(2),
      tvl: response.data?.tvl || '$37.5M',
      token: 'tAPT',
      tokenPrice: response.data?.tokenPrice || 12.45,
      product: 'Liquid Staking',
      stakingType: 'Liquid',
      cooldownPeriod: 0,
      minimumStake: '0.1 APT',
      features: ['No lockup', 'Liquid staking', 'Validator diversification'],
      risks: ['Smart contract risk', 'Oracle risk', 'Validator risk'],
      riskRating: 2.5,
      staking: {
        apr: aprPercentage.toFixed(2),
        product: 'Liquid Staking',
        lockupPeriod: '0 days'
      },
      website: 'https://app.tortuga.finance',
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching Tortuga data:', error);
    throw error;
  }
}

/**
 * Fetch staking data from Ditto protocol
 * @returns {Promise<Object>} Protocol staking data
 */
async function fetchDittoStakingData() {
  try {
    // Fetch on-chain data and API data
    const response = await axios.get('https://api.dittofinance.io/stats');
    
    // Calculate rewards and APR
    const aprPercentage = response.data?.apr || 4.28;
    
    return {
      name: 'Ditto Finance',
      apr: aprPercentage.toFixed(2),
      tvl: response.data?.tvl || '$18.3M',
      token: 'dAPT',
      tokenPrice: response.data?.tokenPrice || 12.44,
      product: 'Liquid Staking',
      stakingType: 'Liquid',
      cooldownPeriod: 0,
      minimumStake: '0.1 APT',
      features: ['No lockup', 'Liquid staking', 'Staking rewards'],
      risks: ['Smart contract risk', 'Market risk'],
      riskRating: 2.5,
      staking: {
        apr: aprPercentage.toFixed(2),
        product: 'Liquid Staking',
        lockupPeriod: '0 days'
      },
      website: 'https://ditto.finance',
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching Ditto data:', error);
    throw error;
  }
}

/**
 * Fetch lending data from Aries Markets 
 * @returns {Promise<Object>} Protocol lending data
 */
async function fetchAriesLendingData() {
  try {
    // Fetch API data
    const response = await axios.get('https://api.ariesmarkets.xyz/markets');
    
    // Find APT market data
    const aptMarket = response.data?.markets?.find(m => m.symbol === 'APT') || {};
    
    const supplyApr = aptMarket.supplyApr || 3.8;
    
    return {
      name: 'Aries Markets',
      apr: supplyApr.toFixed(2),
      tvl: aptMarket.tvl || '$12.5M',
      product: 'Lending',
      token: 'APT',
      tokenPrice: aptMarket.price || 12.45,
      features: ['Variable APR', 'No lockup', 'Borrow against assets'],
      risks: ['Smart contract risk', 'Liquidation risk', 'Interest rate risk'],
      riskRating: 3.2,
      lending: {
        apr: supplyApr.toFixed(2),
        product: 'APT Lending',
        lockupPeriod: '0 days'
      },
      website: 'https://ariesmarkets.xyz',
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching Aries data:', error);
    throw error;
  }
}

/**
 * Fetch lending data from Echo protocol
 * @returns {Promise<Object>} Protocol lending data
 */
async function fetchEchoLendingData() {
  try {
    // Fetch API data
    const response = await axios.get('https://api.echo.finance/markets');
    
    // Find APT market data
    const aptMarket = response.data?.markets?.find(m => m.asset === 'APT') || {};
    
    const supplyApr = aptMarket.supplyApr || 3.7;
    
    return {
      name: 'Echo Finance',
      apr: supplyApr.toFixed(2),
      tvl: aptMarket.tvl || '$9.8M',
      product: 'Lending',
      token: 'APT',
      tokenPrice: aptMarket.price || 12.45,
      features: ['Variable APR', 'No lockup', 'Multiple collateral types'],
      risks: ['Smart contract risk', 'Liquidation risk', 'Market risk'],
      riskRating: 3.2,
      lending: {
        apr: supplyApr.toFixed(2),
        product: 'APT Lending',
        lockupPeriod: '0 days'
      },
      website: 'https://echo.finance',
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching Echo data:', error);
    throw error;
  }
}

/**
 * Create fallback data when API calls fail
 * @param {String} protocol - Protocol identifier
 * @param {String} type - Protocol type (stake, lend, etc.)
 * @returns {Object} Fallback protocol data
 */
function createFallbackData(protocol, type) {
  const fallbackValues = {
    amnis: { name: 'Amnis Finance', apr: '4.25', tvl: '$54.3M', token: 'stAPT' },
    thala: { name: 'Thala Labs', apr: '4.35', tvl: '$41.7M', token: 'sthAPT' },
    tortuga: { name: 'Tortuga Finance', apr: '4.30', tvl: '$37.5M', token: 'tAPT' },
    ditto: { name: 'Ditto Finance', apr: '4.28', tvl: '$18.3M', token: 'dAPT' },
    aries: { name: 'Aries Markets', apr: '3.80', tvl: '$12.5M', token: 'APT' },
    echo: { name: 'Echo Finance', apr: '3.70', tvl: '$9.8M', token: 'APT' }
  };
  
  const values = fallbackValues[protocol] || { 
    name: protocol.charAt(0).toUpperCase() + protocol.slice(1), 
    apr: '4.00', 
    tvl: '$10M', 
    token: 'APT' 
  };
  
  const result = {
    name: values.name,
    apr: values.apr,
    tvl: values.tvl,
    token: values.token,
    tokenPrice: 12.45,
    product: type === 'stake' ? 'Liquid Staking' : 'Lending',
    features: ['Fallback data', 'API unavailable'],
    risks: ['Data accuracy risk'],
    riskRating: 3.0,
    lastUpdated: new Date().toISOString()
  };
  
  if (type === 'stake') {
    result.staking = {
      apr: values.apr,
      product: 'Liquid Staking',
      lockupPeriod: '0 days'
    };
  } else if (type === 'lend') {
    result.lending = {
      apr: values.apr,
      product: 'APT Lending',
      lockupPeriod: '0 days'
    };
  }
  
  return result;
}

/**
 * Generate optimal strategy allocations based on risk profiles
 * @param {Object} protocolsData - Protocol data
 * @returns {Object} Optimal strategies
 */
function generateOptimalStrategies(protocolsData) {
  // Sort protocols by APR
  const sortedByApr = Object.entries(protocolsData)
    .sort((a, b) => parseFloat(b[1].apr) - parseFloat(a[1].apr));
  
  // Sort protocols by security (inverse of risk rating)
  const sortedBySecurity = Object.entries(protocolsData)
    .sort((a, b) => parseFloat(a[1].riskRating) - parseFloat(b[1].riskRating));
  
  // Create conservative strategy (prioritize security)
  const conservativeStrategy = {
    name: 'Conservative Strategy',
    description: 'Focus on protocols with lower risk and established security track records',
    riskLevel: 'Conservative',
    allocation: createAllocation([
      { protocol: sortedBySecurity[0][0], percentage: 50 },
      { protocol: sortedBySecurity[1][0], percentage: 30 },
      { protocol: sortedBySecurity[2][0], percentage: 20 }
    ], protocolsData)
  };
  
  // Create balanced strategy
  const balancedStrategy = {
    name: 'Balanced Strategy',
    description: 'Balance between yield and security across multiple protocols',
    riskLevel: 'Balanced',
    allocation: createAllocation([
      { protocol: sortedByApr[1][0], percentage: 40 },
      { protocol: sortedByApr[0][0], percentage: 30 },
      { protocol: sortedBySecurity[0][0], percentage: 30 }
    ], protocolsData)
  };
  
  // Create aggressive strategy (prioritize yield)
  const aggressiveStrategy = {
    name: 'Aggressive Strategy',
    description: 'Focus on maximum yield across leading protocols',
    riskLevel: 'Aggressive',
    allocation: createAllocation([
      { protocol: sortedByApr[0][0], percentage: 60 },
      { protocol: sortedByApr[1][0], percentage: 25 },
      { protocol: sortedByApr[2][0], percentage: 15 }
    ], protocolsData)
  };
  
  // Add blended APRs
  conservativeStrategy.apr = calculateBlendedApr(conservativeStrategy.allocation);
  balancedStrategy.apr = calculateBlendedApr(balancedStrategy.allocation);
  aggressiveStrategy.apr = calculateBlendedApr(aggressiveStrategy.allocation);
  
  return {
    conservative: conservativeStrategy,
    balanced: balancedStrategy,
    aggressive: aggressiveStrategy
  };
}

/**
 * Create allocation with protocol details
 * @param {Array} allocations - Allocation percentages by protocol
 * @param {Object} protocolsData - Protocol data
 * @returns {Array} Complete allocation data
 */
function createAllocation(allocations, protocolsData) {
  return allocations.map(item => {
    const protocol = protocolsData[item.protocol];
    return {
      protocol: item.protocol,
      percentage: item.percentage,
      expectedApr: protocol.apr,
      product: protocol.staking?.product || protocol.lending?.product || protocol.product,
      token: protocol.token
    };
  });
}

/**
 * Calculate blended APR for an allocation
 * @param {Array} allocation - Portfolio allocation
 * @returns {String} Blended APR
 */
function calculateBlendedApr(allocation) {
  if (!allocation || allocation.length === 0) return '0.00';
  
  const weightedSum = allocation.reduce((sum, item) => {
    return sum + (parseFloat(item.expectedApr) * (item.percentage / 100));
  }, 0);
  
  return weightedSum.toFixed(2);
}

/**
 * Determine recommended protocol based on APR and risk
 * @param {Object} protocolsData - Protocol data
 * @returns {String} Recommended protocol id
 */
function determineRecommendedProtocol(protocolsData) {
  if (Object.keys(protocolsData).length === 0) return 'amnis';
  
  // Create scoring system based on APR (70%) and safety (30%)
  const scoredProtocols = Object.entries(protocolsData).map(([id, data]) => {
    const aprScore = parseFloat(data.apr) * 0.7;
    const safetyScore = (5 - (data.riskRating || 3)) * 0.6; // Invert risk rating
    
    return {
      id,
      score: aprScore + safetyScore
    };
  });
  
  // Sort by score and return highest
  scoredProtocols.sort((a, b) => b.score - a.score);
  
  return scoredProtocols[0]?.id || 'amnis';
}

/**
 * Generate personalized recommendation based on wallet data 
 * @param {String} walletAddress - User's wallet address
 * @param {Object} portfolioData - User's portfolio data
 * @returns {Promise<Object>} Personalized recommendation
 */
async function getPersonalizedRecommendations(walletAddress, portfolioData) {
  try {
    // Get latest staking data
    const stakingData = await getStakingData();
    
    // Determine user's risk profile based on portfolio composition
    const riskProfile = determineRiskProfile(portfolioData);
    
    // Get strategy based on risk profile
    const strategy = stakingData.strategies[riskProfile.profile];
    
    // Generate personalized earning projections
    const totalApt = calculateTotalAptValue(portfolioData);
    const potentialEarnings = calculatePotentialEarnings(totalApt, strategy.apr);
    
    // Generate action items
    const actionItems = generateActionItems(portfolioData, strategy, stakingData.protocols);
    
    return {
      walletAddress,
      riskProfile: riskProfile.profile,
      factors: riskProfile.factors,
      recommendedStrategy: {
        ...strategy,
        amount: totalApt.toFixed(2),
        potentialApr: strategy.apr
      },
      potentialEarnings,
      actionItems,
      alternativeStrategies: Object.values(stakingData.strategies)
        .filter(s => s.riskLevel !== riskProfile.profile)
        .map(s => ({
          name: s.name,
          description: s.description,
          riskLevel: s.riskLevel,
          apr: s.apr
        })),
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating personalized recommendations:', error);
    return {
      walletAddress,
      riskProfile: 'balanced',
      error: error.message,
      lastUpdated: new Date().toISOString()
    };
  }
}

/**
 * Determine user's risk profile based on portfolio composition
 * @param {Object} portfolioData - User's portfolio data
 * @returns {Object} Risk profile and contributing factors
 */
function determineRiskProfile(portfolioData) {
  const factors = [];
  let riskPoints = 0;
  
  // Check if portfolio contains multiple token types
  const hasStakedTokens = portfolioData.stAPT?.amount > 0 || 
                         portfolioData.sthAPT?.amount > 0 || 
                         portfolioData.tAPT?.amount > 0;
  
  if (hasStakedTokens) {
    factors.push('Already participating in staking');
    riskPoints += 1;
  }
  
  // Check for LP positions
  if (portfolioData.ammLiquidity?.hasLiquidity) {
    factors.push('Has AMM liquidity positions');
    riskPoints += 2;
  }
  
  // Check portfolio value
  const totalValue = parseFloat(portfolioData.totalValueUSD || 0);
  if (totalValue > 50000) {
    factors.push('Large portfolio value');
    riskPoints += 1;
  } else if (totalValue < 5000) {
    factors.push('Smaller portfolio value');
    riskPoints -= 1;
  }
  
  // Check for recent transactions
  if (portfolioData.recentTransactions?.length > 10) {
    factors.push('Active trader');
    riskPoints += 1;
  }
  
  // Determine profile
  let profile;
  if (riskPoints >= 2) {
    profile = 'aggressive';
  } else if (riskPoints <= -1) {
    profile = 'conservative';
  } else {
    profile = 'balanced';
  }
  
  return { profile, factors };
}

/**
 * Calculate total APT value in the portfolio
 * @param {Object} portfolioData - User's portfolio data
 * @returns {Number} Total APT value
 */
function calculateTotalAptValue(portfolioData) {
  // Native APT
  let totalApt = parseFloat(portfolioData.apt?.amount || 0);
  
  // Staked tokens (approximate APT value)
  totalApt += parseFloat(portfolioData.stAPT?.amount || 0);
  totalApt += parseFloat(portfolioData.sthAPT?.amount || 0);
  totalApt += parseFloat(portfolioData.tAPT?.amount || 0);
  
  return totalApt;
}

/**
 * Calculate potential earnings based on APT amount and APR
 * @param {Number} aptAmount - Total APT amount
 * @param {String|Number} apr - Annual percentage rate 
 * @returns {Object} Potential earnings
 */
function calculatePotentialEarnings(aptAmount, apr) {
  const aprValue = parseFloat(apr);
  if (isNaN(aprValue) || isNaN(aptAmount)) {
    return { monthly: '0.00', yearly: '0.00' };
  }
  
  // Assuming APT price is $12.45
  const aptPrice = 12.45;
  const annualAptEarnings = aptAmount * (aprValue / 100);
  const annualUsdEarnings = annualAptEarnings * aptPrice;
  
  return {
    monthly: (annualUsdEarnings / 12).toFixed(2),
    yearly: annualUsdEarnings.toFixed(2),
    apt: {
      monthly: (annualAptEarnings / 12).toFixed(2),
      yearly: annualAptEarnings.toFixed(2)
    }
  };
}

/**
 * Generate action items based on portfolio and recommended strategy
 * @param {Object} portfolioData - User's portfolio data
 * @param {Object} strategy - Recommended strategy
 * @param {Object} protocols - Protocol data
 * @returns {Array} Action items
 */
function generateActionItems(portfolioData, strategy, protocols) {
  const actionItems = [];
  
  // Get unstaked APT amount
  const unstakedApt = parseFloat(portfolioData.apt?.amount || 0);
  
  // Get already staked amounts
  const stakedAmounts = {
    amnis: parseFloat(portfolioData.stAPT?.amount || 0),
    thala: parseFloat(portfolioData.sthAPT?.amount || 0),
    tortuga: parseFloat(portfolioData.tAPT?.amount || 0)
  };
  
  // Generate optimized allocation
  strategy.allocation.forEach(allocation => {
    const protocol = allocation.protocol;
    const targetPercentage = allocation.percentage;
    const currentStaked = stakedAmounts[protocol] || 0;
    const totalApt = calculateTotalAptValue(portfolioData);
    const targetAmount = (targetPercentage / 100) * totalApt;
    
    // Calculate difference
    const difference = targetAmount - currentStaked;
    
    if (difference > 0 && difference >= 0.1) {