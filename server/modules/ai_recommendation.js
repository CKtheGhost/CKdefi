/**
 * ai_recommendation.js - Advanced AI-powered investment recommendation engine
 * 
 * Generates personalized DeFi investment strategies based on portfolio analysis,
 * risk profiles, market conditions, and historical performance data.
 */

const { Anthropic } = require('@anthropic-ai/sdk');
const { OpenAI } = require('openai');
const { fetchProtocolData, fetchMarketOverview } = require('./dataFetcher');
const cache = require('../middleware/caching');
const aiConfig = require('../config/ai');

// Initialize AI clients
let anthropicClient;
let openaiClient;

// Initialize AI clients if API keys are available
try {
  if (process.env.ANTHROPIC_API_KEY) {
    anthropicClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
  }
} catch (error) {
  console.error('Failed to initialize Anthropic client:', error);
}

try {
  if (process.env.OPENAI_API_KEY) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
} catch (error) {
  console.error('Failed to initialize OpenAI client:', error);
}

// Cache keys and TTL settings
const CACHE_KEYS = {
  GENERAL_STRATEGY: 'ai:general:strategy',
  PERSONALIZED_STRATEGY: 'ai:personalized:strategy:'
};

const CACHE_TTL = {
  GENERAL_STRATEGY: 60 * 60, // 1 hour
  PERSONALIZED_STRATEGY: 30 * 60 // 30 minutes
};

/**
 * Get a general investment strategy for users who haven't connected their wallet
 * @param {Object} options - Options for strategy generation
 * @returns {Promise<Object>} AI-generated investment strategy
 */
async function getGeneralStrategy(options = {}) {
  const { bypassCache = false, riskProfile = 'balanced' } = options;
  const cacheKey = `${CACHE_KEYS.GENERAL_STRATEGY}:${riskProfile}`;
  
  // Check cache first unless bypassing
  if (!bypassCache) {
    const cachedStrategy = await cache.get(cacheKey);
    if (cachedStrategy) {
      console.log(`Using cached general strategy for ${riskProfile} risk profile`);
      return cachedStrategy;
    }
  }
  
  try {
    // Fetch market and protocol data for AI
    const [marketOverview, protocolData] = await Promise.all([
      fetchMarketOverview(),
      fetchProtocolData()
    ]);
    
    // Filter protocols based on risk profile
    const filteredProtocols = {};
    for (const [name, protocol] of Object.entries(protocolData.protocols)) {
      if (
        (riskProfile === 'conservative' && parseFloat(protocol.staking?.apr || 0) <= 8) ||
        (riskProfile === 'aggressive' && name !== 'echo') || // Example filtering logic
        riskProfile === 'balanced'
      ) {
        filteredProtocols[name] = protocol;
      }
    }
    
    // Construct prompt for AI
    const prompt = generateGeneralStrategyPrompt({
      protocols: filteredProtocols,
      marketOverview,
      riskProfile
    });
    
    // Generate recommendation using AI
    const aiResponse = await generateAIResponse(prompt);
    let recommendation;
    
    try {
      // Extract JSON from AI response
      const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/) || 
                       aiResponse.match(/{[\s\S]*}/);
      
      if (jsonMatch) {
        recommendation = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } else {
        throw new Error('Could not parse AI response as JSON');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.log('Raw AI response:', aiResponse);
      throw new Error('Error parsing recommendation data');
    }
    
    // Post-process and validate recommendation
    const processedRecommendation = postProcessRecommendation(recommendation, filteredProtocols, riskProfile);
    
    // Add metadata
    processedRecommendation.riskProfile = riskProfile;
    processedRecommendation.generatedAt = new Date().toISOString();
    processedRecommendation.source = 'ai';
    processedRecommendation.type = 'general';
    
    // Cache the result
    await cache.set(cacheKey, processedRecommendation, CACHE_TTL.GENERAL_STRATEGY);
    
    return processedRecommendation;
  } catch (error) {
    console.error('Error generating general strategy:', error);
    
    // Return fallback strategy on error
    return getFallbackStrategy(riskProfile);
  }
}

/**
 * Generate a personalized investment strategy based on user's portfolio
 * @param {Object} portfolioData - User's portfolio data
 * @param {Object} options - Options for strategy generation
 * @returns {Promise<Object>} AI-generated personalized investment strategy
 */
async function getPersonalizedStrategy(portfolioData, options = {}) {
  const { 
    bypassCache = false, 
    riskProfile = 'balanced', 
    amount = 100,
    preserveStakedPositions = true 
  } = options;
  
  const walletAddress = portfolioData.wallet;
  if (!walletAddress) {
    throw new Error('Wallet address is required');
  }
  
  const cacheKey = `${CACHE_KEYS.PERSONALIZED_STRATEGY}${walletAddress}:${riskProfile}:${amount}`;
  
  // Check cache first unless bypassing
  if (!bypassCache) {
    const cachedStrategy = await cache.get(cacheKey);
    if (cachedStrategy) {
      console.log(`Using cached personalized strategy for ${walletAddress} with ${riskProfile} risk profile`);
      return cachedStrategy;
    }
  }
  
  try {
    // Fetch latest protocol and market data
    const [marketOverview, protocolData] = await Promise.all([
      fetchMarketOverview(),
      fetchProtocolData()
    ]);
    
    // Calculate total portfolio value and allocation percentages
    const portfolio = portfolioData.portfolio;
    const currentAllocation = [];
    
    if (portfolio.apt && parseFloat(portfolio.apt.amount) > 0) {
      currentAllocation.push({
        asset: 'APT',
        protocol: 'native',
        percentage: (portfolio.apt.valueUSD / portfolio.totalValueUSD * 100).toFixed(2),
        value: portfolio.apt.valueUSD.toFixed(2)
      });
    }
    
    if (portfolio.stAPT && parseFloat(portfolio.stAPT.amount) > 0) {
      currentAllocation.push({
        asset: 'stAPT',
        protocol: 'amnis',
        percentage: (portfolio.stAPT.valueUSD / portfolio.totalValueUSD * 100).toFixed(2),
        value: portfolio.stAPT.valueUSD.toFixed(2)
      });
    }
    
    if (portfolio.sthAPT && parseFloat(portfolio.sthAPT.amount) > 0) {
      currentAllocation.push({
        asset: 'sthAPT',
        protocol: 'thala',
        percentage: (portfolio.sthAPT.valueUSD / portfolio.totalValueUSD * 100).toFixed(2),
        value: portfolio.sthAPT.valueUSD.toFixed(2)
      });
    }
    
    if (portfolio.tAPT && parseFloat(portfolio.tAPT.amount) > 0) {
      currentAllocation.push({
        asset: 'tAPT',
        protocol: 'tortuga',
        percentage: (portfolio.tAPT.valueUSD / portfolio.totalValueUSD * 100).toFixed(2),
        value: portfolio.tAPT.valueUSD.toFixed(2)
      });
    }
    
    if (portfolio.dAPT && parseFloat(portfolio.dAPT.amount) > 0) {
      currentAllocation.push({
        asset: 'dAPT',
        protocol: 'ditto',
        percentage: (portfolio.dAPT.valueUSD / portfolio.totalValueUSD * 100).toFixed(2),
        value: portfolio.dAPT.valueUSD.toFixed(2)
      });
    }
    
    if (portfolio.ammLiquidity && portfolio.ammLiquidity.hasLiquidity) {
      currentAllocation.push({
        asset: 'AMM Liquidity',
        protocol: 'liquidity',
        percentage: (portfolio.ammLiquidity.estimatedValueUSD / portfolio.totalValueUSD * 100).toFixed(2),
        value: portfolio.ammLiquidity.estimatedValueUSD.toFixed(2)
      });
    }
    
    // Construct prompt for personalized recommendation
    const prompt = generatePersonalizedStrategyPrompt({
      protocols: protocolData.protocols,
      marketOverview,
      riskProfile,
      currentAllocation,
      totalValue: portfolio.totalValueUSD,
      amount,
      preserveStakedPositions
    });
    
    // Generate recommendation using AI
    const aiResponse = await generateAIResponse(prompt);
    let recommendation;
    
    try {
      // Extract JSON from AI response
      const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/) || 
                       aiResponse.match(/{[\s\S]*}/);
      
      if (jsonMatch) {
        recommendation = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } else {
        throw new Error('Could not parse AI response as JSON');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.log('Raw AI response:', aiResponse);
      throw new Error('Error parsing recommendation data');
    }
    
    // Post-process and validate recommendation
    const processedRecommendation = postProcessRecommendation(recommendation, protocolData.protocols, riskProfile);
    
    // Calculate amounts based on percentage allocation and investment amount
    if (processedRecommendation.allocation) {
      processedRecommendation.allocation.forEach(item => {
        item.amount = ((parseFloat(item.percentage) / 100) * amount).toFixed(2);
      });
    }
    
    // Add metadata
    processedRecommendation.riskProfile = riskProfile;
    processedRecommendation.walletAddress = walletAddress;
    processedRecommendation.totalInvestment = amount;
    processedRecommendation.currentAllocation = currentAllocation;
    processedRecommendation.generatedAt = new Date().toISOString();
    processedRecommendation.source = 'ai';
    processedRecommendation.type = 'personalized';
    
    // Add execution information for frontend
    processedRecommendation.ui = {
      animationDelay: 300,
      chartColors: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'],
      visualizationType: 'doughnut'
    };
    
    // Add agent capabilities for execution
    processedRecommendation.agentCapabilities = {
      canExecuteTransactions: true,
      supportedOperations: processedRecommendation.allocation.map(item => ({
        protocol: item.protocol,
        operationType: item.product.toLowerCase().includes('staking') ? 'stake' : 'lend',
        amount: item.amount,
        contractAddress: getContractAddressForProtocol(item.protocol)
      }))
    };
    
    // Cache the result
    await cache.set(cacheKey, processedRecommendation, CACHE_TTL.PERSONALIZED_STRATEGY);
    
    return processedRecommendation;
  } catch (error) {
    console.error('Error generating personalized strategy:', error);
    
    // Return fallback strategy on error
    return getFallbackStrategy(riskProfile, amount, portfolioData);
  }
}

/**
 * Generate prompt for general strategy
 * @param {Object} params - Parameters for prompt construction
 * @returns {string} AI prompt
 */
function generateGeneralStrategyPrompt(params) {
  const { protocols, marketOverview, riskProfile } = params;
  
  // Format protocols for the prompt
  const protocolsInfo = Object.entries(protocols).map(([name, data]) => {
    return `${name}: ${JSON.stringify({
      staking: data.staking,
      lending: data.lending,
      features: data.features
    }, null, 2)}`;
  }).join('\n\n');
  
  // Format market overview for the prompt
  const marketInfo = JSON.stringify({
    aptos: marketOverview.aptos,
    sentiment: marketOverview.marketInfo.sentiment,
    trend: marketOverview.marketInfo.trend,
    totalTVL: marketOverview.defiStats.totalTVL
  }, null, 2);
  
  // Define risk profile characteristics
  const riskProfiles = {
    conservative: 'Low risk tolerance, prioritizing capital preservation over high returns. Focus on established protocols and more secure staking options.',
    balanced: 'Moderate risk tolerance, seeking a balance between growth and security. Mix of staking and lending strategies across multiple protocols.',
    aggressive: 'High risk tolerance, prioritizing maximum returns. Can include newer protocols, liquidity provision, and higher-yield opportunities.'
  };
  
  return `As an AI financial advisor specialized in Aptos DeFi, analyze the following real-time data to provide a general best investment strategy for users with a ${riskProfile} risk profile.

RISK PROFILE DEFINITION: ${riskProfiles[riskProfile]}

CURRENT PROTOCOLS DATA:
${protocolsInfo}

MARKET OVERVIEW:
${marketInfo}

Provide a JSON response with:
{
  "title": "Strategy title that reflects the approach",
  "summary": "Brief summary of the strategy (2-3 sentences)",
  "allocation": [
    {
      "protocol": "protocol name",
      "product": "specific product (e.g., Liquid Staking, Money Market)",
      "percentage": number (0-100, whole numbers, must sum to 100),
      "expectedApr": number (realistic APR value based on current data)
    }
  ],
  "totalApr": number (weighted average of allocation APRs),
  "rationale": "Explanation of strategy based on market conditions (3-4 sentences)",
  "risks": ["Array of specific risks (3-5 items)"],
  "mitigations": ["Array of risk mitigation strategies (3-5 items)"],
  "steps": ["Implementation steps for users (4-6 steps)"]
}

IMPORTANT GUIDELINES:
1. Allocations must sum to exactly 100%
2. Use only the protocols provided in the data
3. APR values must be realistic and based on current data
4. For conservative profiles, focus on established protocols
5. For aggressive profiles, can include higher yield opportunities
6. For balanced profiles, mix staking and lending protocols
7. Consider market sentiment and trends in your recommendations
8. Provide specific, actionable steps for implementation
9. Account for protocol-specific risks in your risk assessment`;
}

/**
 * Generate prompt for personalized strategy
 * @param {Object} params - Parameters for prompt construction
 * @returns {string} AI prompt
 */
function generatePersonalizedStrategyPrompt(params) {
  const { 
    protocols, 
    marketOverview, 
    riskProfile, 
    currentAllocation, 
    totalValue,
    amount,
    preserveStakedPositions 
  } = params;
  
  // Format protocols for the prompt
  const protocolsInfo = Object.entries(protocols).map(([name, data]) => {
    return `${name}: ${JSON.stringify({
      staking: data.staking,
      lending: data.lending,
      features: data.features
    }, null, 2)}`;
  }).join('\n\n');
  
  // Format current allocation for the prompt
  const currentPortfolio = JSON.stringify(currentAllocation, null, 2);
  
  // Format market overview for the prompt
  const marketInfo = JSON.stringify({
    aptos: marketOverview.aptos,
    sentiment: marketOverview.marketInfo.sentiment,
    trend: marketOverview.marketInfo.trend
  }, null, 2);
  
  return `As an AI financial advisor specialized in Aptos DeFi, provide a personalized investment strategy for a user with the following profile and portfolio data:

INVESTMENT AMOUNT: ${amount} APT
TOTAL PORTFOLIO VALUE: $${totalValue.toFixed(2)}
RISK PROFILE: ${riskProfile}
PREFERENCES: ${preserveStakedPositions ? 'User prefers to preserve currently staked positions.' : 'User is open to rebalancing all positions.'}

CURRENT PORTFOLIO ALLOCATION:
${currentPortfolio}

AVAILABLE PROTOCOLS DATA:
${protocolsInfo}

MARKET OVERVIEW:
${marketInfo}

Provide a JSON response with:
{
  "title": "Personalized strategy title",
  "summary": "Brief summary of the strategy (2-3 sentences)",
  "allocation": [
    {
      "protocol": "protocol name",
      "product": "specific product (e.g., Liquid Staking, Money Market)",
      "percentage": number (0-100, whole numbers, must sum to 100),
      "expectedApr": number (realistic APR value based on current data)
    }
  ],
  "totalApr": number (weighted average of allocation APRs),
  "rationale": "Explanation of strategy based on portfolio and market conditions (3-4 sentences)",
  "risks": ["Array of specific risks (3-5 items)"],
  "mitigations": ["Array of risk mitigation strategies (3-5 items)"],
  "steps": ["Implementation steps for this specific portfolio (5-7 steps)"]
}

IMPORTANT GUIDELINES:
1. Allocations must sum to exactly 100%
2. Use only the protocols provided in the data
3. APR values must be realistic and based on current data
4. Consider the user's current allocation when making recommendations
5. Provide specific steps for transitioning from current allocation to recommended allocation
6. ${preserveStakedPositions ? 'Incorporate existing staked positions into the new strategy where possible.' : 'Feel free to recommend a complete rebalancing if optimal.'}
7. Account for the specific amount the user wants to invest (${amount} APT)
8. Recommended APR should align with the risk profile: conservative (lower), balanced (moderate), aggressive (higher)
9. Consider market conditions and trends when making recommendations`;
}

/**
 * Post-process and validate AI recommendation
 * @param {Object} recommendation - Raw AI recommendation
 * @param {Object} protocols - Available protocols data
 * @param {string} riskProfile - User risk profile
 * @returns {Object} Processed recommendation
 */
function postProcessRecommendation(recommendation, protocols, riskProfile) {
  // Create a deep copy to avoid modifying the original
  const processed = JSON.parse(JSON.stringify(recommendation));
  
  // Validate allocation exists
  if (!processed.allocation || !Array.isArray(processed.allocation)) {
    processed.allocation = [];
  }
  
  // Check protocol validity and calculate total percentage
  let totalPercentage = 0;
  processed.allocation = processed.allocation.filter(item => {
    // Ensure protocol exists in available protocols
    const isValid = !!protocols[item.protocol];
    if (!isValid) {
      console.warn(`Removed invalid protocol: ${item.protocol}`);
    }
    totalPercentage += parseFloat(item.percentage) || 0;
    return isValid;
  });
  
  // Normalize percentages if they don't sum to 100%
  if (totalPercentage !== 100 && processed.allocation.length > 0) {
    console.warn(`Allocation percentages sum to ${totalPercentage}, normalizing to 100%`);
    const factor = 100 / totalPercentage;
    processed.allocation.forEach(item => {
      item.percentage = Math.round(parseFloat(item.percentage) * factor);
    });
    
    // Adjust last item if needed to ensure sum is exactly 100%
    const adjustedTotal = processed.allocation.reduce((sum, item) => sum + item.percentage, 0);
    if (adjustedTotal !== 100 && processed.allocation.length > 0) {
      processed.allocation[processed.allocation.length - 1].percentage += (100 - adjustedTotal);
    }
  }
  
  // Recalculate total APR based on allocation
  if (processed.allocation.length > 0) {
    const totalApr = processed.allocation.reduce((sum, item) => {
      return sum + (parseFloat(item.expectedApr) * parseFloat(item.percentage) / 100);
    }, 0);
    processed.totalApr = parseFloat(totalApr.toFixed(2));
  } else {
    processed.totalApr = 0;
  }
  
  // Handle missing properties
  if (!processed.title) {
    processed.title = `${riskProfile.charAt(0).toUpperCase() + riskProfile.slice(1)} Investment Strategy`;
  }
  
  if (!processed.summary) {
    processed.summary = `Optimized ${riskProfile} strategy for Aptos DeFi with an expected APR of ${processed.totalApr}%.`;
  }
  
  if (!processed.rationale) {
    processed.rationale = `Strategy based on current market conditions and available protocols.`;
  }
  
  if (!processed.risks || !Array.isArray(processed.risks)) {
    processed.risks = [
      "Smart contract risk",
      "Market volatility",
      "Protocol-specific risks"
    ];
  }
  
  if (!processed.mitigations || !Array.isArray(processed.mitigations)) {
    processed.mitigations = [
      "Diversification across multiple protocols",
      "Focus on established protocols with security audits",
      "Regular portfolio monitoring"
    ];
  }
  
  if (!processed.steps || !Array.isArray(processed.steps)) {
    processed.steps = [
      "Connect your wallet to CompounDefi",
      "Review and approve the recommended allocation",
      "Execute the strategy with one click",
      "Monitor performance regularly"
    ];
  }
  
  return processed;
}

/**
 * Get fallback strategy when AI generation fails
 * @param {string} riskProfile - User risk profile
 * @param {number} amount - Investment amount
 * @param {Object} portfolioData - Optional portfolio data
 * @returns {Object} Fallback investment strategy
 */
function getFallbackStrategy(riskProfile, amount = 100, portfolioData = null) {
  // Determine if this is a general or personalized strategy
  const isPersonalized = !!portfolioData;
  
  // Create appropriate allocation based on risk profile
  let allocation, totalApr, title, summary;
  
  if (riskProfile === 'conservative') {
    allocation = [
      { protocol: 'amnis', product: 'Liquid Staking', percentage: 60, expectedApr: 7.5 },
      { protocol: 'thala', product: 'Money Market', percentage: 40, expectedApr: 3.2 }
    ];
    totalApr = 5.8;
    title = 'Conservative Preservation Strategy';
    summary = 'A low-risk approach focusing on capital preservation with stable staking returns and secure lending positions.';
  } else if (riskProfile === 'aggressive') {
    allocation = [
      { protocol: 'thala', product: 'Liquid Staking', percentage: 35, expectedApr: 8.2 },
      { protocol: 'echo', product: 'Money Market', percentage: 40, expectedApr: 4.1 },
      { protocol: 'pancakeswap', product: 'Liquidity Pooling', percentage: 25, expectedApr: 18.5 }
    ];
    totalApr = 9.5;
    title = 'High-Yield Growth Strategy';
    summary = 'An aggressive approach targeting maximum returns through a mix of staking, lending, and liquidity provision.';
  } else { // balanced
    allocation = [
      { protocol: 'thala', product: 'Liquid Staking', percentage: 40, expectedApr: 8.2 },
      { protocol: 'amnis', product: 'Liquid Staking', percentage: 30, expectedApr: 7.5 },
      { protocol: 'echo', product: 'Money Market', percentage: 30, expectedApr: 4.1 }
    ];
    totalApr = 6.7;
    title = 'Balanced Growth Strategy';
    summary = 'A balanced approach providing steady returns through diversified staking and lending positions.';
  }
  
  // Calculate amounts if provided
  if (amount) {
    allocation.forEach(item => {
      item.amount = ((item.percentage / 100) * amount).toFixed(2);
    });
  }
  
  // Common elements for all strategies
  const strategy = {
    title,
    summary,
    allocation,
    totalApr,
    rationale: `This strategy is designed for ${riskProfile} investors in the current market environment, focusing on a ${riskProfile === 'conservative' ? 'secure' : riskProfile === 'aggressive' ? 'high-yield' : 'balanced'} approach through ${riskProfile === 'aggressive' ? 'diversification across multiple DeFi products' : 'focus on established protocols'}.`,
    risks: [
      'Smart contract vulnerability risk',
      'Market volatility risk',
      'Protocol-specific operational risks',
      'Regulatory uncertainty in the DeFi space'
    ],
    mitigations: [
      'Diversification across multiple protocols and products',
      'Focus on established protocols with security audits',
      'Regular monitoring of positions and market conditions',
      'Maintaining a portion in liquid assets for flexibility'
    ],
    steps: [
      'Connect your wallet to CompounDefi',
      'Review the recommended allocation',
      'Approve the transactions to execute the strategy',
      'Set up automated monitoring for your positions',
      'Periodically review and rebalance if needed'
    ],
    generatedAt: new Date().toISOString(),
    source: 'fallback',
    type: isPersonalized ? 'personalized' : 'general',
    riskProfile
  };
  
  // Add personalized data if available
  if (isPersonalized) {
    strategy.walletAddress = portfolioData.wallet;
    strategy.totalInvestment = amount;
    
    // Add UI and agent capabilities for execution
    strategy.ui = {
      animationDelay: 300,
      chartColors: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'],
      visualizationType: 'doughnut'
    };
    
    strategy.agentCapabilities = {
      canExecuteTransactions: true,
      supportedOperations: allocation.map(item => ({
        protocol: item.protocol,
        operationType: item.product.toLowerCase().includes('staking') ? 'stake' : 'lend',
        amount: item.amount,
        contractAddress: getContractAddressForProtocol(item.protocol)
      }))
    };
    
    // Extract current allocation if available
    if (portfolioData.portfolio) {
      const portfolio = portfolioData.portfolio;
      const currentAllocation = [];
      
      if (portfolio.apt && parseFloat(portfolio.apt.amount) > 0) {
        currentAllocation.push({
          asset: 'APT',
          protocol: 'native',
          percentage: (portfolio.apt.valueUSD / portfolio.totalValueUSD * 100).toFixed(2),
          value: portfolio.apt.valueUSD.toFixed(2)
        });
      }
      
      if (portfolio.stAPT && parseFloat(portfolio.stAPT.amount) > 0) {
        currentAllocation.push({
          asset: 'stAPT',
          protocol: 'amnis',
          percentage: (portfolio.stAPT.valueUSD / portfolio.totalValueUSD * 100).toFixed(2),
          value: portfolio.stAPT.valueUSD.toFixed(2)
        });
      }
      
      if (portfolio.sthAPT && parseFloat(portfolio.sthAPT.amount) > 0) {
        currentAllocation.push({
          asset: 'sthAPT',
          protocol: 'thala',
          percentage: (portfolio.sthAPT.valueUSD / portfolio.totalValueUSD * 100).toFixed(2),
          value: portfolio.sthAPT.valueUSD.toFixed(2)
        });
      }
      
      if (currentAllocation.length > 0) {
        strategy.currentAllocation = currentAllocation;
      }
    }
  }
  
  return strategy;
}

/**
 * Generate AI response using Anthropic or OpenAI
 * @param {string} prompt - AI prompt
 * @returns {Promise<string>} AI response text
 */
async function generateAIResponse(prompt) {
  // Use provider-specific configurations based on AI config
  const {
    anthropicModel = 'claude-3-5-sonnet-20241022',
    openaiModel = 'gpt-4o',
    temperature = 0.2,
    maxTokens = 4000
  } = aiConfig || {};

  // First try Anthropic if available
  if (anthropicClient) {
    try {
      console.log('Generating AI response with Anthropic');
      const response = await anthropicClient.messages.create({
        model: anthropicModel,
        max_tokens: maxTokens,
        temperature: temperature,
        messages: [
          { role: "user", content: prompt }
        ]
      });
      
      return response.content[0].text;
    } catch (anthropicError) {
      console.error('Anthropic API error:', anthropicError);
      
      // Fall back to OpenAI if available
      if (openaiClient) {
        console.log('Falling back to OpenAI');
      } else {
        throw anthropicError; // Re-throw if no fallback
      }
    }
  }
  
  // Use OpenAI if Anthropic is not available or failed
  if (openaiClient) {
    try {
      console.log('Generating AI response with OpenAI');
      const openaiResponse = await openaiClient.chat.completions.create({
        model: openaiModel,
        messages: [{ role: "user", content: prompt }],
        temperature: temperature,
        max_tokens: maxTokens,
        response_format: { type: "text" }
      });
      
      return openaiResponse.choices[0].message.content;
    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError);
      throw openaiError;
    }
  }
  
  // If no AI service is available
  throw new Error('No AI service (Anthropic or OpenAI) is available');
}

/**
 * Get the contract address for a protocol
 * @param {string} protocol - Protocol name
 * @returns {string} Contract address
 */
function getContractAddressForProtocol(protocol) {
  // Map of protocol names to contract addresses
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
  
  return contracts[protocol.toLowerCase()] || null;
}

/**
 * Get available AI models for recommendation generation
 * @returns {Object} Available AI models and their status
 */
function getAvailableAIModels() {
  return {
    anthropic: {
      available: !!anthropicClient,
      model: aiConfig.anthropicModel || 'claude-3-5-sonnet-20241022'
    },
    openai: {
      available: !!openaiClient,
      model: aiConfig.openaiModel || 'gpt-4o'
    }
  };
}

/**
 * Clear AI recommendation cache
 * @param {string} type - Cache type to clear (general, personalized, or all)
 * @param {string} walletAddress - Optional wallet address for personalized cache
 * @returns {Promise<Object>} Cache clearing result
 */
async function clearRecommendationCache(type = 'all', walletAddress = null) {
  let clearedKeys = [];
  
  if (type === 'general' || type === 'all') {
    // Clear general strategy cache
    const generalKeys = await cache.keys(`${CACHE_KEYS.GENERAL_STRATEGY}:*`);
    for (const key of generalKeys) {
      await cache.del(key);
      clearedKeys.push(key);
    }
  }
  
  if (type === 'personalized' || type === 'all') {
    // Clear personalized strategy cache
    let personalizedPattern = walletAddress ? 
      `${CACHE_KEYS.PERSONALIZED_STRATEGY}${walletAddress}:*` : 
      `${CACHE_KEYS.PERSONALIZED_STRATEGY}*`;
      
    const personalizedKeys = await cache.keys(personalizedPattern);
    for (const key of personalizedKeys) {
      await cache.del(key);
      clearedKeys.push(key);
    }
  }
  
  return {
    success: true,
    clearedKeys,
    count: clearedKeys.length,
    message: `Cleared ${clearedKeys.length} cache entries`
  };
}

module.exports = {
  getGeneralStrategy,
  getPersonalizedStrategy,
  getAvailableAIModels,
  clearRecommendationCache
};