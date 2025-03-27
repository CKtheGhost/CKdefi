// aiUtils.js
// Utilities for AI model interactions, prompt engineering, and recommendation generation

const { Anthropic } = require('anthropic');
const { OpenAI } = require('openai');
const axios = require('axios');
const { performance } = require('perf_hooks');

// AI models configuration
const AI_MODELS = {
  CLAUDE: {
    standard: "claude-3-5-sonnet-20241022", // Default model
    fast: "claude-3-haiku-20240307",
    powerful: "claude-3-opus-20240229"
  },
  OPENAI: {
    standard: "gpt-4o",
    fast: "gpt-3.5-turbo",
    powerful: "gpt-4-turbo"
  }
};

// Cache for AI responses with expiration times
const aiResponseCache = {
  generalStrategy: { data: null, timestamp: 0, ttl: 60 * 60 * 1000 }, // 1 hour
  marketAnalysis: { data: null, timestamp: 0, ttl: 30 * 60 * 1000 },  // 30 minutes
  tokenAnalysis: { data: null, timestamp: 0, ttl: 15 * 60 * 1000 },   // 15 minutes
  protocolComparison: { data: null, timestamp: 0, ttl: 3 * 60 * 60 * 1000 }, // 3 hours
  personalizedRecommendations: {}  // Address-based cache
};

/**
 * Initialize AI clients
 * @returns {Object} Object containing initialized AI clients
 */
function initializeAIClients() {
  let anthropicClient = null;
  let openaiClient = null;
  
  if (process.env.ANTHROPIC_API_KEY) {
    anthropicClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
  }
  
  if (process.env.OPENAI_API_KEY) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  
  return { anthropicClient, openaiClient };
}

/**
 * Generate an AI response with fallbacks between providers
 * @param {String} prompt - Prompt to send to AI model
 * @param {Object} options - Options for the request
 * @returns {Promise<Object>} AI response
 */
async function generateAIResponse(prompt, options = {}) {
  const startTime = performance.now();
  const { anthropicClient, openaiClient } = initializeAIClients();
  
  if (!anthropicClient && !openaiClient) {
    throw new Error('No AI API keys available. Set ANTHROPIC_API_KEY or OPENAI_API_KEY in .env file.');
  }
  
  // Default options
  const {
    model = 'standard',
    temperature = 0.2,
    maxTokens = 4000,
    responseFormat = null,
    tryBoth = true,
    preferClaude = true
  } = options;
  
  // Determine which provider to try first
  const tryOrder = preferClaude ? 
    [{ client: anthropicClient, name: 'Anthropic' }, { client: openaiClient, name: 'OpenAI' }] :
    [{ client: openaiClient, name: 'OpenAI' }, { client: anthropicClient, name: 'Anthropic' }];
  
  let lastError = null;
  let response = null;
  
  // Try providers in order
  for (const { client, name } of tryOrder) {
    if (!client) continue;
    
    try {
      console.log(`Attempting to generate response with ${name}`);
      
      if (name === 'Anthropic') {
        const claudeModel = AI_MODELS.CLAUDE[model] || AI_MODELS.CLAUDE.standard;
        
        const claudeResponse = await anthropicClient.messages.create({
          model: claudeModel,
          max_tokens: maxTokens,
          temperature: temperature,
          messages: [
            { role: "user", content: prompt }
          ]
        });
        
        response = { 
          content: claudeResponse.content[0].text,
          model: claudeModel,
          provider: 'claude'
        };
      } else { // OpenAI
        const openaiModel = AI_MODELS.OPENAI[model] || AI_MODELS.OPENAI.standard;
        
        const openaiOptions = {
          model: openaiModel,
          messages: [{ role: "user", content: prompt }],
          temperature: temperature,
          max_tokens: maxTokens
        };
        
        // Add response format if specified
        if (responseFormat === 'json') {
          openaiOptions.response_format = { type: "json_object" };
        }
        
        const openaiResponse = await openaiClient.chat.completions.create(openaiOptions);
        
        response = { 
          content: openaiResponse.choices[0].message.content,
          model: openaiModel,
          provider: 'openai'
        };
      }
      
      // Log success
      const duration = performance.now() - startTime;
      console.log(`AI response generated with ${name} in ${duration.toFixed(2)}ms`);
      
      break; // Exit loop if successful
    } catch (error) {
      console.error(`Error using ${name}:`, error);
      lastError = error;
      
      // If we don't want to try both or this is the last option, rethrow
      if (!tryBoth || name === tryOrder[tryOrder.length - 1].name) {
        throw new Error(`${name} API failed: ${error.message}`);
      }
      
      // Otherwise continue to the next provider
    }
  }
  
  if (!response) {
    throw lastError || new Error('Failed to generate AI response with any provider');
  }
  
  return response;
}

/**
 * Extract JSON from AI response text
 * @param {String} content - AI response content
 * @returns {Object} Parsed JSON object
 */
function extractJSON(content) {
  try {
    // Try direct JSON parsing first
    try {
      return JSON.parse(content);
    } catch (e) {
      // Not valid JSON, continue to extraction
    }
    
    // Look for JSON in code blocks
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                      content.match(/```\n([\s\S]*?)\n```/) || 
                      content.match(/{[\s\S]*?}/);
    
    if (jsonMatch) {
      // Parse the matched JSON
      return JSON.parse(jsonMatch[1] || jsonMatch[0]);
    }
    
    throw new Error('No valid JSON found in the response');
  } catch (error) {
    console.error('Error extracting JSON from AI response:', error);
    
    // Return a minimal object to prevent further errors
    return { error: 'Failed to parse AI response as JSON' };
  }
}

/**
 * Generate general market strategy recommendation
 * @param {Object} stakingData - Protocol staking data
 * @param {Object} tokenData - Token market data
 * @param {Object} newsData - Recent news data
 * @param {Object} options - Options for the request
 * @returns {Promise<Object>} AI-generated strategy
 */
async function generateGeneralStrategy(stakingData, tokenData, newsData, options = {}) {
  try {
    const forceRefresh = options.forceRefresh || false;
    const now = Date.now();
    
    // Check cache
    if (!forceRefresh && 
        aiResponseCache.generalStrategy.data && 
        (now - aiResponseCache.generalStrategy.timestamp) < aiResponseCache.generalStrategy.ttl) {
      console.log('Using cached general strategy');
      return aiResponseCache.generalStrategy.data;
    }
    
    // Build prompt
    const prompt = `As an AI financial advisor specialized in Aptos DeFi, analyze the following real-time data to provide a general best investment strategy for users who have not yet connected their wallet:

1. Staking/Lending Rewards: ${JSON.stringify(stakingData.protocols, null, 2)}
2. Token Overview: ${JSON.stringify(tokenData.coins?.slice(0, 5) || [], null, 2)} (top 5 tokens by movement)
3. Latest News: ${JSON.stringify(newsData.articles?.slice(0, 5) || [], null, 2)} (top 5 news items)

Provide a JSON response with:
- title: "General Market Strategy"
- summary: Brief summary of the strategy (2-3 sentences)
- allocation: Array of {protocol, product, percentage, expectedApr}
- totalApr: Blended APR of the strategy
- rationale: Explanation based on the data (3-4 sentences)
- risks: Array of potential risks (3-5 items)
- marketOutlook: Brief analysis of current market conditions
- lastUpdated: Current timestamp`;

    // Generate response
    const result = await generateAIResponse(prompt, {
      ...options,
      responseFormat: 'json'
    });
    
    // Extract and process JSON
    let strategyData = extractJSON(result.content);
    
    // Add timestamp if not included
    if (!strategyData.lastUpdated) {
      strategyData.lastUpdated = new Date().toISOString();
    }
    
    // Add model/provider info
    strategyData.generatedBy = {
      model: result.model,
      provider: result.provider
    };
    
    // Update cache
    aiResponseCache.generalStrategy = {
      data: strategyData,
      timestamp: now,
      ttl: options.ttl || aiResponseCache.generalStrategy.ttl
    };
    
    return strategyData;
  } catch (error) {
    console.error('Error generating general strategy:', error);
    throw error;
  }
}

/**
 * Generate personalized investment recommendation based on wallet data
 * @param {String} walletAddress - User wallet address
 * @param {Object} portfolioData - User portfolio data
 * @param {Object} stakingData - Current staking rates
 * @param {Object} userPreferences - User preferences
 * @param {Object} options - Options for the request
 * @returns {Promise<Object>} Personalized recommendation
 */
async function generatePersonalizedRecommendation(walletAddress, portfolioData, stakingData, userPreferences = {}, options = {}) {
  try {
    const forceRefresh = options.forceRefresh || false;
    const now = Date.now();
    const cacheKey = `${walletAddress}_${userPreferences.riskProfile || 'balanced'}`;
    
    // Check cache
    if (!forceRefresh &&
        aiResponseCache.personalizedRecommendations[cacheKey] &&
        (now - aiResponseCache.personalizedRecommendations[cacheKey].timestamp) < (30 * 60 * 1000)) { // 30 minutes TTL
      console.log('Using cached personalized recommendation');
      return aiResponseCache.personalizedRecommendations[cacheKey].data;
    }
    
    // Default risk profile
    const riskProfile = userPreferences.riskProfile || 'balanced';
    
    // Build prompt
    const prompt = `As an AI financial advisor specialized in Aptos DeFi, provide a personalized staking and investment strategy for a user with:
1. Wallet Address: ${walletAddress}
2. Risk profile: ${riskProfile}
3. Current portfolio: ${JSON.stringify(portfolioData, null, 2)}

Current staking rates:
${JSON.stringify(stakingData.protocols, null, 2)}

User preferences to consider:
${JSON.stringify(userPreferences, null, 2)}

Provide a JSON response with:
- title: Recommendation title
- summary: Brief summary (2-3 sentences)
- allocation: Array of {protocol, product, percentage, expectedApr, amount}
- totalApr: Blended APR
- steps: Array of implementation instructions (5-7 steps)
- risks: Array of investment risks (3-5 items)
- mitigations: Array of risk mitigation strategies (3-5 items)
- additionalNotes: Additional insights or recommendations
- optimizationFrequency: Recommended rebalance frequency (daily, weekly, monthly)`;

    // Generate response
    const result = await generateAIResponse(prompt, {
      ...options,
      responseFormat: 'json'
    });
    
    // Extract and process JSON
    let recommendationData = extractJSON(result.content);
    
    // Add total investment amount
    const totalApt = portfolioData.totalAptos || 0;
    const totalValueUSD = portfolioData.totalValueUSD || 0;
    
    recommendationData.totalInvestment = totalApt;
    recommendationData.totalValueUSD = totalValueUSD;
    recommendationData.lastUpdated = new Date().toISOString();
    recommendationData.walletAddress = walletAddress;
    recommendationData.riskProfile = riskProfile;
    
    // Add model/provider info
    recommendationData.generatedBy = {
      model: result.model,
      provider: result.provider
    };
    
    // Calculate amounts for each allocation
    if (recommendationData.allocation && Array.isArray(recommendationData.allocation)) {
      recommendationData.allocation.forEach(item => {
        if (!item.amount && item.percentage) {
          item.amount = ((parseFloat(item.percentage) / 100) * totalApt).toFixed(2);
        }
      });
    }
    
    // Add UI configuration
    recommendationData.ui = {
      animationDelay: 300,
      chartColors: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'],
      visualizationType: 'doughnut'
    };
    
    // Add execution capabilities
    recommendationData.agentCapabilities = {
      canExecuteTransactions: true,
      supportedOperations: generateSupportedOperations(recommendationData.allocation, stakingData, totalApt)
    };
    
    // Update cache
    aiResponseCache.personalizedRecommendations[cacheKey] = {
      data: recommendationData,
      timestamp: now
    };
    
    return recommendationData;
  } catch (error) {
    console.error('Error generating personalized recommendation:', error);
    throw error;
  }
}

/**
 * Generate protocol comparison analysis
 * @param {Object} protocols - Protocol data
 * @param {Object} options - Options for the request
 * @returns {Promise<Object>} Protocol comparison analysis
 */
async function generateProtocolComparison(protocols, options = {}) {
  try {
    const forceRefresh = options.forceRefresh || false;
    const now = Date.now();
    
    // Check cache
    if (!forceRefresh && 
        aiResponseCache.protocolComparison.data && 
        (now - aiResponseCache.protocolComparison.timestamp) < aiResponseCache.protocolComparison.ttl) {
      console.log('Using cached protocol comparison');
      return aiResponseCache.protocolComparison.data;
    }
    
    // Build prompt
    const prompt = `As an AI financial advisor specialized in Aptos DeFi, provide a detailed comparison of these protocols:
${JSON.stringify(protocols, null, 2)}

For each protocol, analyze:
1. Current yields and APR
2. Security features and audit status
3. Liquidity depth and token stability
4. Protocol-specific risks
5. Historical performance

Provide a JSON response with:
- summary: Overall comparison summary
- protocols: Array of detailed protocol analyses with strengths and weaknesses
- securityRankings: Protocol security rankings from most to least secure
- yieldRankings: Protocol yield rankings from highest to lowest
- riskAssessment: Risk assessment for each protocol (low, medium, high)
- recommendations: Specific recommendations based on different risk profiles`;

    // Generate response
    const result = await generateAIResponse(prompt, {
      ...options,
      responseFormat: 'json'
    });
    
    // Extract and process JSON
    let comparisonData = extractJSON(result.content);
    
    // Add timestamp and metadata
    comparisonData.lastUpdated = new Date().toISOString();
    comparisonData.generatedBy = {
      model: result.model,
      provider: result.provider
    };
    
    // Update cache
    aiResponseCache.protocolComparison = {
      data: comparisonData,
      timestamp: now,
      ttl: options.ttl || aiResponseCache.protocolComparison.ttl
    };
    
    return comparisonData;
  } catch (error) {
    console.error('Error generating protocol comparison:', error);
    throw error;
  }
}

/**
 * Generate recommendations for auto-rebalancing
 * @param {String} walletAddress - User wallet address
 * @param {Object} currentAllocation - Current portfolio allocation
 * @param {Object} stakingData - Current staking rates
 * @param {Object} userPreferences - User preferences
 * @param {Object} options - Options for the request
 * @returns {Promise<Object>} Rebalancing recommendation
 */
async function generateRebalanceRecommendation(walletAddress, currentAllocation, stakingData, userPreferences = {}, options = {}) {
  try {
    // Build prompt
    const prompt = `As an AI financial advisor, analyze this wallet's current allocation and recommend optimal rebalancing:
1. Wallet: ${walletAddress}
2. Current allocation: ${JSON.stringify(currentAllocation, null, 2)}
3. Current market rates: ${JSON.stringify(stakingData.protocols, null, 2)}
4. User preferences: ${JSON.stringify(userPreferences, null, 2)}

Provide a JSON response with:
- summary: Brief summary of recommended changes
- driftAnalysis: Analysis of current allocation vs optimal
- recommendations: Array of specific rebalance operations needed
- expectedImprovement: Expected APR increase after rebalancing
- minimalChanges: Suggested minimal changes if user wants to limit transactions`;

    // Generate response
    const result = await generateAIResponse(prompt, {
      ...options,
      responseFormat: 'json'
    });
    
    // Extract and process JSON
    let rebalanceData = extractJSON(result.content);
    
    // Add timestamp and metadata
    rebalanceData.lastUpdated = new Date().toISOString();
    rebalanceData.generatedBy = {
      model: result.model,
      provider: result.provider
    };
    
    return rebalanceData;
  } catch (error) {
    console.error('Error generating rebalance recommendation:', error);
    throw error;
  }
}

/**
 * Generate news analysis and impact on portfolio
 * @param {Array} newsItems - Recent news articles
 * @param {Object} portfolioData - User portfolio (optional)
 * @param {Object} options - Options for the request
 * @returns {Promise<Object>} News analysis
 */
async function generateNewsAnalysis(newsItems, portfolioData = null, options = {}) {
  try {
    // Build prompt
    let prompt = `As an AI financial advisor for Aptos DeFi, analyze these recent news items:
${JSON.stringify(newsItems, null, 2)}

`;

    if (portfolioData) {
      prompt += `Consider their impact on this portfolio:
${JSON.stringify(portfolioData, null, 2)}

`;
    }

    prompt += `Provide a JSON response with:
- summary: Brief summary of key news
- marketImpact: Analysis of news impact on the market
- sentimentScore: Overall market sentiment (-10 to +10)
- keyEvents: Array of most significant news events
- actionableInsights: Specific actions investors should consider
${portfolioData ? '- portfolioImpact: Specific impact on the user\'s portfolio' : ''}`;

    // Generate response
    const result = await generateAIResponse(prompt, {
      ...options,
      responseFormat: 'json'
    });
    
    // Extract and process JSON
    let newsAnalysis = extractJSON(result.content);
    
    // Add timestamp and metadata
    newsAnalysis.lastUpdated = new Date().toISOString();
    newsAnalysis.generatedBy = {
      model: result.model,
      provider: result.provider
    };
    
    return newsAnalysis;
  } catch (error) {
    console.error('Error generating news analysis:', error);
    throw error;
  }
}

/**
 * Clear AI cache
 * @param {String} cacheKey - Specific cache key to clear (optional)
 */
function clearAICache(cacheKey = null) {
  if (cacheKey) {
    if (cacheKey === 'personalizedRecommendations') {
      aiResponseCache.personalizedRecommendations = {};
    } else if (aiResponseCache[cacheKey]) {
      aiResponseCache[cacheKey] = { 
        data: null, 
        timestamp: 0, 
        ttl: aiResponseCache[cacheKey].ttl 
      };
    }
  } else {
    // Reset all caches except TTL values
    Object.keys(aiResponseCache).forEach(key => {
      if (key === 'personalizedRecommendations') {
        aiResponseCache[key] = {};
      } else {
        aiResponseCache[key] = { 
          data: null, 
          timestamp: 0, 
          ttl: aiResponseCache[key].ttl 
        };
      }
    });
  }
}

/**
 * Generate supported operations for a recommendation
 * @param {Array} allocation - Recommended allocation
 * @param {Object} stakingData - Staking data with contract addresses
 * @param {Number} totalAmount - Total APT amount
 * @returns {Array} Supported operations
 */
function generateSupportedOperations(allocation, stakingData, totalAmount) {
  if (!allocation || !Array.isArray(allocation)) return [];
  
  return allocation.map(item => {
    // Find contract address from staking data
    const protocolKey = item.protocol.toLowerCase();
    const contractAddress = stakingData.contracts ? 
                           stakingData.contracts[protocolKey] : 
                           (stakingData.protocols?.[protocolKey]?.contractAddress || null);
    
    return {
      protocol: item.protocol,
      operationType: determineOperationType(item.product),
      amount: item.amount || ((parseFloat(item.percentage) / 100) * totalAmount).toFixed(2),
      contractAddress: contractAddress || 'unknown',
      functionName: determineFunctionName(item.protocol, determineOperationType(item.product))
    };
  }).filter(op => op.contractAddress !== 'unknown');
}

/**
 * Determine operation type based on product description
 * @param {String} product - Product description
 * @returns {String} Operation type
 */
function determineOperationType(product) {
  if (!product) return 'stake';
  
  const productLower = product.toLowerCase();
  
  if (productLower.includes('stake') || productLower.includes('stapt') || productLower.includes('apt') && productLower.includes('st')) {
    return 'stake';
  }
  if (productLower.includes('lend') || productLower.includes('lending') || productLower.includes('supply') || productLower.includes('loan')) {
    return 'lend';
  }
  if (productLower.includes('liquidity') || productLower.includes('amm') || productLower.includes('pool') || productLower.includes('swap')) {
    return 'addLiquidity';
  }
  if (productLower.includes('yield') || productLower.includes('farm') || productLower.includes('vault')) {
    return 'deposit';
  }
  
  return 'stake'; // Default to staking
}

/**
 * Determine function name based on protocol and operation type
 * @param {String} protocol - Protocol name
 * @param {String} operationType - Operation type
 * @returns {String} Function name
 */
function determineFunctionName(protocol, operationType) {
  const functionMappings = {
    'amnis': { 
      'stake': '::staking::stake', 
      'unstake': '::staking::unstake', 
      'lend': '::lending::supply', 
      'withdraw': '::lending::withdraw', 
      'addLiquidity': '::router::add_liquidity', 
      'removeLiquidity': '::router::remove_liquidity',
      'swap': '::router::swap_exact_input'
    },
    'thala': { 
      'stake': '::staking::stake_apt', 
      'unstake': '::staking::unstake_apt', 
      'lend': '::lending::supply_apt', 
      'withdraw': '::lending::withdraw_apt', 
      'addLiquidity': '::router::add_liquidity', 
      'removeLiquidity': '::router::remove_liquidity',
      'swap': '::router::swap_exact_input'
    },
    'tortuga': { 
      'stake': '::staking::stake_apt', 
      'unstake': '::staking::unstake_apt' 
    },
    'echo': { 
      'lend': '::lending::supply',
      'withdraw': '::lending::withdraw' 
    },
    'ditto': { 
      'stake': '::staking::stake', 
      'unstake': '::staking::unstake' 
    },
    'aries': { 
      'lend': '::lending::supply', 
      'withdraw': '::lending::withdraw' 
    }
  };

  // Check for specific protocol function mapping
  if (functionMappings[protocol.toLowerCase()]?.[operationType.toLowerCase()]) {
    return functionMappings[protocol.toLowerCase()][operationType.toLowerCase()];
  }

  // Default function names by operation type
  switch (operationType.toLowerCase()) {
    case 'stake': return '::staking::stake';
    case 'unstake': return '::staking::unstake';
    case 'lend': return '::lending::supply';
    case 'withdraw': return '::lending::withdraw';
    case 'addliquidity': return '::router::add_liquidity';
    case 'removeliquidity': return '::router::remove_liquidity';
    case 'deposit': return '::yield::deposit';
    case 'swap': return '::router::swap_exact_input';
    default: return `::${operationType}::execute`;
  }
}

module.exports = {
  generateAIResponse,
  extractJSON,
  generateGeneralStrategy,
  generatePersonalizedRecommendation,
  generateProtocolComparison,
  generateRebalanceRecommendation,
  generateNewsAnalysis,
  clearAICache,
  AI_MODELS
};