// staking_optimizer.js
// Core module for CompounDefi staking optimization and yield analysis

const axios = require('axios');
const { Aptos } = require('@aptos-labs/ts-sdk');
const { aiClient } = require('../utils/aiClients');
const { formatStakingData, calculateAPR } = require('../utils/marketDataUtils');

// Contract addresses for supported staking/lending protocols
const contracts = {
  amnis: "0x111ae3e5bc816a5e63c2da97d0aa3886519e0cd5e4b046659fa35796bd11542a",
  thala: "0xfaf4e633ae9eb31366c9ca24214231760926576c7b625313b3688b5e900731f6",
  tortuga: "0x952c1b1fc8eb75ee80f432c9d0a84fcda1d5c7481501a7eca9199f1596a60b53",
  ditto: "0xd11107bdf0d6d7040c6c0bfbdecb6545191fdf13e8d8d259952f53e1713f61b5",
  aries: "0x9770fa9c725cbd97eb50b2be5f7416efdfd1f1554beb0750d4dae4c64e860da3",
  echo: "0xeab7ea4d635b6b6add79d5045c4a45d8148d88287b1cfa1c3b6a4b56f46839ed",
  pancakeswap: "0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa",
  liquidswap: "0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12",
  cetus: "0x27156bd56eb5637b9adde4d915b596f92d2f28f0ade2eaef48fa73e360e4e8a6"
};

// Risk profiles for different protocols
const riskProfiles = {
  amnis: { riskLevel: 'medium', securityScore: 8, liquidityScore: 9 },
  thala: { riskLevel: 'medium', securityScore: 7, liquidityScore: 8 },
  tortuga: { riskLevel: 'medium-low', securityScore: 8, liquidityScore: 7 },
  ditto: { riskLevel: 'medium-high', securityScore: 6, liquidityScore: 7 },
  aries: { riskLevel: 'medium-high', securityScore: 6, liquidityScore: 6 },
  echo: { riskLevel: 'high', securityScore: 5, liquidityScore: 5 },
  pancakeswap: { riskLevel: 'medium', securityScore: 7, liquidityScore: 9 },
  liquidswap: { riskLevel: 'medium', securityScore: 7, liquidityScore: 8 },
  cetus: { riskLevel: 'medium', securityScore: 7, liquidityScore: 7 }
};

// Predefined strategies for different risk profiles
const strategies = {
  conservative: {
    name: "Conservative Strategy",
    description: "Focus on lower risk protocols with stable returns",
    riskLevel: "low",
    allocation: [
      { protocol: "amnis", percentage: 40, product: "Liquid Staking" },
      { protocol: "tortuga", percentage: 30, product: "Liquid Staking" },
      { protocol: "thala", percentage: 30, product: "Liquid Staking" }
    ],
    apr: 4.6
  },
  balanced: {
    name: "Balanced Strategy",
    description: "Moderate risk with both staking and lending",
    riskLevel: "medium",
    allocation: [
      { protocol: "amnis", percentage: 35, product: "Liquid Staking" },
      { protocol: "thala", percentage: 25, product: "Liquid Staking" },
      { protocol: "echo", percentage: 20, product: "Lending" },
      { protocol: "pancakeswap", percentage: 20, product: "Liquidity" }
    ],
    apr: 5.8
  },
  aggressive: {
    name: "Aggressive Strategy",
    description: "Higher risk for maximum yield",
    riskLevel: "high",
    allocation: [
      { protocol: "amnis", percentage: 25, product: "Liquid Staking" },
      { protocol: "echo", percentage: 30, product: "Lending" },
      { protocol: "pancakeswap", percentage: 30, product: "Liquidity" },
      { protocol: "aries", percentage: 15, product: "Lending" }
    ],
    apr: 7.2
  },
  maxYield: {
    name: "Maximum Yield",
    description: "Highest risk strategy focused on maximum returns",
    riskLevel: "very high",
    allocation: [
      { protocol: "echo", percentage: 40, product: "Lending" },
      { protocol: "pancakeswap", percentage: 35, product: "Liquidity" },
      { protocol: "aries", percentage: 25, product: "Lending" }
    ],
    apr: 8.5
  }
};

/**
 * Get current staking and lending rate data from supported protocols
 * @returns {Promise<Object>} Formatted staking data with APRs and protocol information
 */
async function getStakingData() {
  try {
    // Initialize protocols data structure
    let protocols = {
      amnis: { staking: { apr: 0, product: "stAPT" }, lending: { apr: 0, product: "Lending" } },
      thala: { staking: { apr: 0, product: "sthAPT" }, lending: { apr: 0, product: "Lending" } },
      tortuga: { staking: { apr: 0, product: "tAPT" } },
      ditto: { staking: { apr: 0, product: "dAPT" } },
      echo: { lending: { apr: 0, product: "Lending" } },
      aries: { lending: { apr: 0, product: "Lending" } },
      pancakeswap: { liquidity: { apr: 0, product: "Liquidity Pool" } },
      liquidswap: { liquidity: { apr: 0, product: "Liquidity Pool" } },
      cetus: { liquidity: { apr: 0, product: "Liquidity Pool" } }
    };
    
    // Fetch staking rates from on-chain or API sources
    const [
      amnisData,
      thalaData,
      tortugaData,
      dittoData,
      echoData,
      ariesData,
      pancakeswapData,
      liquidswapData,
      cetusData
    ] = await Promise.allSettled([
      fetchAmnisStakingRate(),
      fetchThalaStakingRate(),
      fetchTortugaStakingRate(),
      fetchDittoStakingRate(),
      fetchEchoLendingRate(),
      fetchAriesLendingRate(),
      fetchPancakeswapLiquidityRate(),
      fetchLiquidswapLiquidityRate(),
      fetchCetusLiquidityRate()
    ]);
    
    // Update protocol data with fetched rates
    if (amnisData.status === 'fulfilled') {
      protocols.amnis.staking.apr = amnisData.value.staking || 4.2;
      protocols.amnis.lending.apr = amnisData.value.lending || 3.5;
    }
    
    if (thalaData.status === 'fulfilled') {
      protocols.thala.staking.apr = thalaData.value.staking || 4.0;
      protocols.thala.lending.apr = thalaData.value.lending || 3.3;
    }
    
    if (tortugaData.status === 'fulfilled') {
      protocols.tortuga.staking.apr = tortugaData.value.staking || 3.8;
    }
    
    if (dittoData.status === 'fulfilled') {
      protocols.ditto.staking.apr = dittoData.value.staking || 3.9;
    }
    
    if (echoData.status === 'fulfilled') {
      protocols.echo.lending.apr = echoData.value.lending || 5.8;
    }
    
    if (ariesData.status === 'fulfilled') {
      protocols.aries.lending.apr = ariesData.value.lending || 6.2;
    }
    
    if (pancakeswapData.status === 'fulfilled') {
      protocols.pancakeswap.liquidity.apr = pancakeswapData.value.liquidity || 7.5;
    }
    
    if (liquidswapData.status === 'fulfilled') {
      protocols.liquidswap.liquidity.apr = liquidswapData.value.liquidity || 7.0;
    }
    
    if (cetusData.status === 'fulfilled') {
      protocols.cetus.liquidity.apr = cetusData.value.liquidity || 6.8;
    }
    
    // Format and add additional data
    const formattedData = {
      protocols: formatStakingData(protocols),
      strategies,
      recommendedProtocol: findHighestYieldProtocol(protocols),
      lastUpdated: new Date().toISOString()
    };
    
    return formattedData;
  } catch (error) {
    console.error('Error getting staking data:', error);
    throw error;
  }
}

/**
 * Generate personalized staking recommendations based on wallet data
 * @param {string} walletAddress - User's wallet address
 * @param {Object} portfolioData - User's portfolio data
 * @returns {Promise<Object>} Personalized staking recommendations
 */
async function getPersonalizedRecommendations(walletAddress, portfolioData) {
  try {
    if (!walletAddress || !portfolioData) {
      throw new Error('Wallet address and portfolio data required');
    }
    
    // Get latest staking data
    const stakingData = await getStakingData();
    
    // Determine risk profile based on portfolio composition
    const riskProfile = determineRiskProfile(portfolioData);
    
    // Get appropriate strategy for risk profile
    let recommendedStrategy = strategies[riskProfile];
    
    // Calculate potential earnings
    const potentialEarnings = calculatePotentialEarnings(
      portfolioData.totalValueUSD,
      recommendedStrategy.apr
    );
    
    // Prepare staked positions data for AI analysis
    const stakedPositions = prepareStakedPositionsData(portfolioData);
    
    // Get personalized action items using AI
    const actionItems = await getActionItems(walletAddress, portfolioData, stakingData, riskProfile);
    
    // Prepare alternative strategies
    const alternativeStrategies = getAlternativeStrategies(riskProfile);
    
    return {
      walletAddress,
      riskProfile,
      recommendedStrategy,
      potentialEarnings,
      stakedPositions,
      actionItems,
      alternativeStrategies,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error generating personalized recommendations for ${walletAddress}:`, error);
    throw error;
  }
}

/**
 * Determine user's risk profile based on portfolio composition
 * @param {Object} portfolioData - User portfolio data
 * @returns {string} Risk profile (conservative, balanced, aggressive, maxYield)
 */
function determineRiskProfile(portfolioData) {
  try {
    const totalValue = parseFloat(portfolioData.totalValueUSD) || 0;
    const aptBalance = parseFloat(portfolioData.apt?.amount) || 0;
    const stakedAmount = parseFloat(portfolioData.stAPT?.amount || 0) +
                        parseFloat(portfolioData.sthAPT?.amount || 0) +
                        parseFloat(portfolioData.tAPT?.amount || 0) +
                        parseFloat(portfolioData.dAPT?.amount || 0);
    
    const hasLiquidity = portfolioData.ammLiquidity && portfolioData.ammLiquidity.hasLiquidity;
    
    // Calculate staked ratio
    const stakedRatio = totalValue > 0 ? stakedAmount / totalValue : 0;
    
    // Determine risk profile based on portfolio composition
    if (hasLiquidity && stakedRatio < 0.3) {
      return 'aggressive'; // Already has liquidity positions and low staking ratio
    } else if (hasLiquidity) {
      return 'balanced'; // Has liquidity but also significant staking
    } else if (stakedRatio > 0.7) {
      return 'conservative'; // Heavily staked
    } else if (stakedRatio > 0.4) {
      return 'balanced'; // Moderately staked
    } else if (totalValue > 10000) {
      return 'aggressive'; // Large portfolio value
    } else if (totalValue > 1000) {
      return 'balanced'; // Medium portfolio value
    }
    
    // Default to conservative for smaller portfolios
    return 'conservative';
  } catch (error) {
    console.error('Error determining risk profile:', error);
    return 'balanced'; // Default to balanced if error
  }
}

/**
 * Get alternative strategies based on user's risk profile
 * @param {string} currentRiskProfile - User's current risk profile
 * @returns {Array} Alternative strategies
 */
function getAlternativeStrategies(currentRiskProfile) {
  try {
    // Return all strategies except the current one
    return Object.entries(strategies)
      .filter(([key]) => key !== currentRiskProfile)
      .map(([_, strategy]) => ({
        name: strategy.name,
        description: strategy.description,
        riskLevel: strategy.riskLevel,
        apr: strategy.apr
      }));
  } catch (error) {
    console.error('Error getting alternative strategies:', error);
    return [];
  }
}

/**
 * Calculate potential earnings based on investment amount and APR
 * @param {number} amount - Investment amount
 * @param {number} apr - Annual percentage rate
 * @returns {Object} Monthly and yearly potential earnings
 */
function calculatePotentialEarnings(amount, apr) {
  try {
    const yearlyEarnings = (amount * apr) / 100;
    const monthlyEarnings = yearlyEarnings / 12;
    
    return {
      monthly: monthlyEarnings.toFixed(2),
      yearly: yearlyEarnings.toFixed(2)
    };
  } catch (error) {
    console.error('Error calculating potential earnings:', error);
    return { monthly: '0.00', yearly: '0.00' };
  }
}

/**
 * Find the protocol with the highest yield
 * @param {Object} protocols - Protocol data with APRs
 * @returns {string} Highest yield protocol name
 */
function findHighestYieldProtocol(protocols) {
  try {
    let highestYield = 0;
    let highestYieldProtocol = '';
    
    // Check each protocol and their products
    Object.entries(protocols).forEach(([protocol, products]) => {
      Object.entries(products).forEach(([productType, data]) => {
        if (data.apr > highestYield) {
          highestYield = data.apr;
          highestYieldProtocol = protocol;
        }
      });
    });
    
    return highestYieldProtocol;
  } catch (error) {
    console.error('Error finding highest yield protocol:', error);
    return 'amnis'; // Default to amnis if error
  }
}

/**
 * Prepare staked positions data from portfolio
 * @param {Object} portfolioData - User portfolio data
 * @returns {Array} Staked positions details
 */
function prepareStakedPositionsData(portfolioData) {
  try {
    const stakedPositions = [];
    
    // Check for stAPT (Amnis)
    if (portfolioData.stAPT && parseFloat(portfolioData.stAPT.amount) > 0) {
      stakedPositions.push({
        protocol: 'amnis',
        token: 'stAPT',
        amount: portfolioData.stAPT.amount,
        valueUSD: portfolioData.stAPT.valueUSD
      });
    }
    
    // Check for sthAPT (Thala)
    if (portfolioData.sthAPT && parseFloat(portfolioData.sthAPT.amount) > 0) {
      stakedPositions.push({
        protocol: 'thala',
        token: 'sthAPT',
        amount: portfolioData.sthAPT.amount,
        valueUSD: portfolioData.sthAPT.valueUSD
      });
    }
    
    // Check for tAPT (Tortuga)
    if (portfolioData.tAPT && parseFloat(portfolioData.tAPT.amount) > 0) {
      stakedPositions.push({
        protocol: 'tortuga',
        token: 'tAPT',
        amount: portfolioData.tAPT.amount,
        valueUSD: portfolioData.tAPT.valueUSD
      });
    }
    
    // Check for dAPT (Ditto)
    if (portfolioData.dAPT && parseFloat(portfolioData.dAPT.amount) > 0) {
      stakedPositions.push({
        protocol: 'ditto',
        token: 'dAPT',
        amount: portfolioData.dAPT.amount,
        valueUSD: portfolioData.dAPT.valueUSD
      });
    }
    
    return stakedPositions;
  } catch (error) {
    console.error('Error preparing staked positions data:', error);
    return [];
  }
}

/**
 * Get personalized action items using AI analysis
 * @param {string} walletAddress - User's wallet address
 * @param {Object} portfolioData - User's portfolio data
 * @param {Object} stakingData - Current staking rates data
 * @param {string} riskProfile - User's risk profile
 * @returns {Promise<Array>} Action items for the user
 */
async function getActionItems(walletAddress, portfolioData, stakingData, riskProfile) {
  try {
    // Prepare data for AI analysis
    const portfolioSummary = {
      totalValueUSD: portfolioData.totalValueUSD,
      aptBalance: portfolioData.apt?.amount || 0,
      stakedPositions: prepareStakedPositionsData(portfolioData),
      hasLiquidity: portfolioData.ammLiquidity && portfolioData.ammLiquidity.hasLiquidity
    };
    
    // Prepare current market conditions
    const marketSummary = {
      topProtocols: findTopProtocols(stakingData.protocols, 3),
      recommendedStrategy: strategies[riskProfile],
      currentRiskProfile: riskProfile
    };
    
    // Generate action items using AI
    const prompt = `
      As a DeFi yield optimizer for Aptos blockchain, analyze this wallet portfolio and market data:
      
      Wallet: ${walletAddress}
      Portfolio Summary: ${JSON.stringify(portfolioSummary)}
      Market Summary: ${JSON.stringify(marketSummary)}
      
      Provide a JSON array of 2-3 specific action items to optimize this portfolio based on the risk profile "${riskProfile}".
      
      Each action item should contain:
      - action: (string) A clear action instruction
      - details: (string) Explanation of why this action is recommended
      - protocol: (string) Target protocol
      - type: (string) Type of operation (stake, unstake, lend, etc.)
      - amount: (number) Recommended amount in APT
      - contractAddress: (string) Contract address if available
      - functionName: (string) Function name if available
      
      Focus on providing specific, actionable steps that will improve portfolio yield and align with the risk profile.
    `;
    
    let actionItems;
    try {
      const aiResponse = await aiClient.generateRecommendation(prompt);
      actionItems = extractJsonFromAIResponse(aiResponse);
      
      // Validate AI response format
      if (!Array.isArray(actionItems)) {
        throw new Error('Invalid AI response format');
      }
      
      // Add contract addresses if missing
      actionItems = actionItems.map(item => {
        if (!item.contractAddress && item.protocol && contracts[item.protocol.toLowerCase()]) {
          item.contractAddress = contracts[item.protocol.toLowerCase()];
        }
        return item;
      });
    } catch (aiError) {
      console.error('AI recommendation error:', aiError);
      // Fallback to predefined action items
      actionItems = getFallbackActionItems(portfolioData, riskProfile);
    }
    
    return actionItems;
  } catch (error) {
    console.error('Error generating action items:', error);
    return getFallbackActionItems(portfolioData, riskProfile);
  }
}

/**
 * Get fallback action items in case AI analysis fails
 * @param {Object} portfolioData - User's portfolio data
 * @param {string} riskProfile - User's risk profile
 * @returns {Array} Fallback action items
 */
function getFallbackActionItems(portfolioData, riskProfile) {
  const aptAmount = parseFloat(portfolioData.apt?.amount) || 0;
  const totalValue = parseFloat(portfolioData.totalValueUSD) || 0;
  
  // Default action items based on risk profile
  switch (riskProfile) {
    case 'conservative':
      return [
        {
          action: `Stake ${(aptAmount * 0.5).toFixed(2)} APT with Amnis`,
          details: "Amnis offers one of the safest staking options with competitive yields",
          protocol: "amnis",
          type: "stake",
          amount: (aptAmount * 0.5).toFixed(2),
          contractAddress: contracts.amnis,
          functionName: "::staking::stake"
        },
        {
          action: "Diversify staking across protocols",
          details: "Split your staking between multiple providers to reduce protocol risk",
          protocol: "thala",
          type: "stake",
          amount: (aptAmount * 0.3).toFixed(2),
          contractAddress: contracts.thala,
          functionName: "::staking::stake_apt"
        }
      ];
      
    case 'balanced':
      return [
        {
          action: `Stake ${(aptAmount * 0.4).toFixed(2)} APT with Amnis`,
          details: "Liquid staking with Amnis provides a solid foundation for your portfolio",
          protocol: "amnis",
          type: "stake",
          amount: (aptAmount * 0.4).toFixed(2),
          contractAddress: contracts.amnis,
          functionName: "::staking::stake"
        },
        {
          action: `Provide ${(aptAmount * 0.3).toFixed(2)} APT as liquidity`,
          details: "Add some liquidity exposure for higher yields while maintaining moderate risk",
          protocol: "pancakeswap",
          type: "addLiquidity",
          amount: (aptAmount * 0.3).toFixed(2),
          contractAddress: contracts.pancakeswap,
          functionName: "::router::add_liquidity"
        }
      ];
      
    case 'aggressive':
      return [
        {
          action: `Lend ${(aptAmount * 0.4).toFixed(2)} APT on Echo`,
          details: "Echo offers high lending APRs for APT with manageable risk",
          protocol: "echo",
          type: "lend",
          amount: (aptAmount * 0.4).toFixed(2),
          contractAddress: contracts.echo,
          functionName: "::lending::supply"
        },
        {
          action: `Provide ${(aptAmount * 0.4).toFixed(2)} APT as liquidity`,
          details: "Maximize your yield by adding significant liquidity exposure",
          protocol: "pancakeswap",
          type: "addLiquidity",
          amount: (aptAmount * 0.4).toFixed(2),
          contractAddress: contracts.pancakeswap,
          functionName: "::router::add_liquidity"
        }
      ];
      
    default:
      return [
        {
          action: `Stake ${(aptAmount * 0.5).toFixed(2)} APT with Amnis`,
          details: "Start with a safe staking option to generate yield on your APT",
          protocol: "amnis",
          type: "stake",
          amount: (aptAmount * 0.5).toFixed(2),
          contractAddress: contracts.amnis,
          functionName: "::staking::stake"
        }
      ];
  }
}

/**
 * Find top protocols by APR
 * @param {Object} protocols - Protocols data with APRs
 * @param {number} count - Number of top protocols to return
 * @returns {Array} Top protocols
 */
function findTopProtocols(protocols, count) {
  const allProtocolsData = [];
  
  // Flatten protocol data
  Object.entries(protocols).forEach(([protocol, products]) => {
    Object.entries(products).forEach(([type, data]) => {
      allProtocolsData.push({
        protocol,
        type,
        apr: data.apr,
        product: data.product
      });
    });
  });
  
  // Sort by APR (descending) and get top count
  return allProtocolsData
    .sort((a, b) => b.apr - a.apr)
    .slice(0, count);
}

/**
 * Extract JSON from AI response text
 * @param {string} response - AI response text
 * @returns {Object|Array} Parsed JSON from response
 */
function extractJsonFromAIResponse(response) {
  try {
    // Try to find JSON in the response
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || response.match(/{[\s\S]*}/);
    
    if (jsonMatch) {
      // Parse the JSON part
      return JSON.parse(jsonMatch[1] || jsonMatch[0]);
    }
    
    // If no JSON found, return empty array
    return [];
  } catch (error) {
    console.error('Error extracting JSON from AI response:', error);
    return [];
  }
}

// --------------------------------
// Protocol-specific rate fetchers
// --------------------------------

async function fetchAmnisStakingRate() {
  try {
    const response = await axios.get('https://api.amnis.finance/v1/statistics');
    return {
      staking: parseFloat(response.data.stakingApr) || 4.2,
      lending: parseFloat(response.data.lendingApr) || 3.5
    };
  } catch (error) {
    console.error('Error fetching Amnis rates:', error);
    return { staking: 4.2, lending: 3.5 }; // Fallback rates
  }
}

async function fetchThalaStakingRate() {
  try {
    const response = await axios.get('https://api.thala.fi/stats');
    return {
      staking: parseFloat(response.data.sthApt.apr) || 4.0,
      lending: parseFloat(response.data.lending.apr) || 3.3
    };
  } catch (error) {
    console.error('Error fetching Thala rates:', error);
    return { staking: 4.0, lending: 3.3 }; // Fallback rates
  }
}

async function fetchTortugaStakingRate() {
  try {
    const response = await axios.get('https://app.tortuga.finance/api/stats');
    return { staking: parseFloat(response.data.tAptApr) || 3.8 };
  } catch (error) {
    console.error('Error fetching Tortuga rates:', error);
    return { staking: 3.8 }; // Fallback rate
  }
}

async function fetchDittoStakingRate() {
  try {
    const response = await axios.get('https://api.dittofinance.io/stats');
    return { staking: parseFloat(response.data.dAptApr) || 3.9 };
  } catch (error) {
    console.error('Error fetching Ditto rates:', error);
    return { staking: 3.9 }; // Fallback rate
  }
}

async function fetchEchoLendingRate() {
  try {
    const response = await axios.get('https://api.echo.finance/markets');
    return { lending: parseFloat(response.data.aptLendingApr) || 5.8 };
  } catch (error) {
    console.error('Error fetching Echo rates:', error);
    return { lending: 5.8 }; // Fallback rate
  }
}

async function fetchAriesLendingRate() {
  try {
    const response = await axios.get('https://api.aries.markets/markets');
    return { lending: parseFloat(response.data.aptLendingApr) || 6.2 };
  } catch (error) {
    console.error('Error fetching Aries rates:', error);
    return { lending: 6.2 }; // Fallback rate
  }
}

async function fetchPancakeswapLiquidityRate() {
  try {
    const response = await axios.get('https://api.pancakeswap.finance/aptos/apr');
    return { liquidity: parseFloat(response.data.aptUsdc) || 7.5 };
  } catch (error) {
    console.error('Error fetching PancakeSwap rates:', error);
    return { liquidity: 7.5 }; // Fallback rate
  }
}

async function fetchLiquidswapLiquidityRate() {
  try {
    const response = await axios.get('https://api.liquidswap.finance/pools');
    return { liquidity: parseFloat(response.data.aptUsdc) || 7.0 };
  } catch (error) {
    console.error('Error fetching Liquidswap rates:', error);
    return { liquidity: 7.0 }; // Fallback rate
  }
}

async function fetchCetusLiquidityRate() {
  try {
    const response = await axios.get('https://api.cetus.zone/v1/pools');
    return { liquidity: parseFloat(response.data.aptUsdc) || 6.8 };
  } catch (error) {
    console.error('Error fetching Cetus rates:', error);
    return { liquidity: 6.8 }; // Fallback rate
  }
}

module.exports = {
  getStakingData,
  getPersonalizedRecommendations,
  determineRiskProfile,
  calculatePotentialEarnings,
  contracts,
  riskProfiles,
  strategies
};