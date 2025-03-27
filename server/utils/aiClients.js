// server/utils/aiClients.js
// AI client implementations for CompounDefi - handles connections to OpenAI and Anthropic APIs

require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');
const { OpenAI } = require('openai');
const logger = require('./logger');

// Initialize AI clients based on available API keys
let anthropicClient = null;
let openaiClient = null;

// Initialize Anthropic client if API key is available
if (process.env.ANTHROPIC_API_KEY) {
  try {
    anthropicClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
    logger.info('Anthropic API client initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize Anthropic API client:', error);
  }
}

// Initialize OpenAI client if API key is available
if (process.env.OPENAI_API_KEY) {
  try {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    logger.info('OpenAI API client initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize OpenAI API client:', error);
  }
}

/**
 * Generate AI recommendation for DeFi strategy
 * @param {Object} data - Input data for AI recommendation
 * @param {Object} options - Configuration options
 * @returns {Promise<Object>} - AI recommendation result
 */
async function generateRecommendation(data, options = {}) {
  const {
    amount = 100,
    riskProfile = 'balanced',
    portfolio = null,
    stakingData = {},
    tokenData = {},
    newsData = {},
    walletAddress = null,
    preserveStakedPositions = false
  } = data;

  const model = options.model || 'claude-3-5-sonnet';
  const format = options.format || 'json';
  const timeout = options.timeout || 30000;

  // Prepare system prompt that explains the task
  const systemPrompt = `You are an AI financial advisor specialized in Aptos DeFi. Your task is to provide a personalized staking and investment strategy based on:
- Amount to invest: ${amount} APT
- Risk profile: ${riskProfile}
- Wallet address: ${walletAddress || 'Not provided'}
- Preserve staked positions: ${preserveStakedPositions ? 'Yes' : 'No'}

Please analyze the current market data and provide a clear, actionable DeFi strategy that optimizes yield while respecting the user's risk profile.`;

  // Prepare user prompt with all the relevant data
  const prompt = `I need a personalized DeFi strategy for the Aptos blockchain. Here's the situation:

1. Amount to invest: ${amount} APT
2. Risk profile: ${riskProfile}
3. Current portfolio: ${portfolio ? JSON.stringify(portfolio, null, 2) : 'Not provided'}

Current staking rates:
${JSON.stringify(stakingData.protocols || {}, null, 2)}

Top tokens by movement:
${JSON.stringify(tokenData.coins?.slice(0, 5) || [], null, 2)}

Latest news affecting market:
${JSON.stringify(newsData.articles?.slice(0, 3) || [], null, 2)}

Provide a JSON response with:
{
  "title": "Recommendation title",
  "summary": "Brief summary of the strategy (2-3 sentences)",
  "totalApr": "Blended APR percentage as a number",
  "allocation": [
    {
      "protocol": "Protocol name",
      "product": "Specific product or pool",
      "percentage": "Percentage allocation as a number",
      "amount": "APT amount based on total investment",
      "expectedApr": "Expected APR percentage as a number"
    }
  ],
  "steps": ["Step 1 description", "Step 2 description", "..."],
  "risks": ["Risk 1", "Risk 2", "..."],
  "mitigations": ["Mitigation 1", "Mitigation 2", "..."],
  "additionalNotes": "Additional insights or recommendations"
}`;

  try {
    // First try with Anthropic Claude
    if (anthropicClient) {
      try {
        logger.info(`Generating recommendation with Anthropic Claude: ${model}`);
        
        const response = await anthropicClient.messages.create({
          model: model,
          max_tokens: 4000,
          temperature: 0.2,
          system: systemPrompt,
          messages: [
            { role: "user", content: prompt }
          ]
        });

        // Parse and return the JSON response
        const content = response.content[0].text;
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/{[\s\S]*}/);
        
        if (!jsonMatch) {
          throw new Error("Could not parse AI response as JSON");
        }
        
        const recommendation = JSON.parse(jsonMatch[1] || jsonMatch[0]);
        
        // Add execution metadata
        recommendation.meta = {
          timestamp: new Date().toISOString(),
          model: model,
          provider: 'anthropic',
          riskProfile: riskProfile,
          amount: amount
        };
        
        return recommendation;
      } catch (anthropicError) {
        logger.error('Anthropic API failed:', anthropicError.message);
        
        // Try OpenAI as fallback if Anthropic fails
        if (openaiClient) {
          throw anthropicError; // Will be caught by the outer try/catch and fallback to OpenAI
        } else {
          throw anthropicError; // No fallback available
        }
      }
    } 
    // Use OpenAI as primary or fallback
    else if (openaiClient) {
      logger.info(`Generating recommendation with OpenAI as ${anthropicClient ? 'fallback' : 'primary'}`);
      
      const openaiResponse = await openaiClient.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: 0.2,
        response_format: { type: "json_object" }
      });
      
      const recommendation = JSON.parse(openaiResponse.choices[0].message.content);
      
      // Add execution metadata
      recommendation.meta = {
        timestamp: new Date().toISOString(),
        model: "gpt-4o",
        provider: 'openai',
        riskProfile: riskProfile,
        amount: amount
      };
      
      return recommendation;
    } else {
      throw new Error('No AI provider available. Set ANTHROPIC_API_KEY or OPENAI_API_KEY in .env file.');
    }
  } catch (error) {
    logger.error('Error generating AI recommendation:', error);
    
    // Create a fallback recommendation if both API calls fail
    return generateFallbackRecommendation(data);
  }
}

/**
 * Generate fallback recommendation when AI services are unavailable
 * @param {Object} data - Input data for recommendation
 * @returns {Object} - Fallback recommendation
 */
function generateFallbackRecommendation(data) {
  const { amount = 100, riskProfile = 'balanced', stakingData = {} } = data;
  
  // Get top protocols from staking data or use defaults
  let topProtocols = [];
  
  try {
    if (stakingData.protocols && Object.keys(stakingData.protocols).length > 0) {
      topProtocols = Object.entries(stakingData.protocols)
        .filter(([_, protocol]) => protocol.staking && protocol.staking.apr)
        .sort((pairA, pairB) => parseFloat(pairB[1].staking.apr) - parseFloat(pairA[1].staking.apr))
        .slice(0, 4);
    }
  } catch (error) {
    logger.warn('Error processing staking data for fallback recommendation:', error);
  }
  
  // If no protocols found, use default templates
  if (topProtocols.length === 0) {
    topProtocols = [
      ['amnis', { staking: { apr: 7.8, product: 'Liquid Staking' } }],
      ['thala', { staking: { apr: 7.2, product: 'Liquid Staking' } }],
      ['tortuga', { staking: { apr: 6.9, product: 'Liquid Staking' } }],
      ['pancakeswap', { staking: { apr: 8.5, product: 'Liquidity Pool' } }]
    ];
  }
  
  // Create allocation based on risk profile
  let allocation = [];
  let totalApr = 0;
  
  if (riskProfile === 'conservative') {
    // Conservative: Focus on liquid staking (70%) and some lending (30%)
    allocation = [
      {
        protocol: topProtocols[0][0],
        product: topProtocols[0][1].staking.product,
        percentage: 70,
        amount: (amount * 0.7).toFixed(2),
        expectedApr: parseFloat(topProtocols[0][1].staking.apr)
      },
      {
        protocol: "echo",
        product: "Lending",
        percentage: 30,
        amount: (amount * 0.3).toFixed(2),
        expectedApr: 5.2
      }
    ];
    
    totalApr = (allocation[0].expectedApr * 0.7 + allocation[1].expectedApr * 0.3).toFixed(2);
  } 
  else if (riskProfile === 'aggressive') {
    // Aggressive: Higher allocation to liquidity pools and yield farming
    allocation = [
      {
        protocol: topProtocols[0][0],
        product: topProtocols[0][1].staking.product,
        percentage: 30,
        amount: (amount * 0.3).toFixed(2),
        expectedApr: parseFloat(topProtocols[0][1].staking.apr)
      },
      {
        protocol: "pancakeswap",
        product: "APT-USDC Liquidity Pool",
        percentage: 40,
        amount: (amount * 0.4).toFixed(2),
        expectedApr: 12.5
      },
      {
        protocol: "thala",
        product: "APT-stAPT Liquidity Pool",
        percentage: 30,
        amount: (amount * 0.3).toFixed(2),
        expectedApr: 14.2
      }
    ];
    
    totalApr = (allocation[0].expectedApr * 0.3 + allocation[1].expectedApr * 0.4 + allocation[2].expectedApr * 0.3).toFixed(2);
  }
  else {
    // Balanced: Mix of liquid staking and some AMM exposure
    allocation = [
      {
        protocol: topProtocols[0][0],
        product: topProtocols[0][1].staking.product,
        percentage: 50,
        amount: (amount * 0.5).toFixed(2),
        expectedApr: parseFloat(topProtocols[0][1].staking.apr)
      },
      {
        protocol: topProtocols[1][0],
        product: topProtocols[1][1].staking.product,
        percentage: 20,
        amount: (amount * 0.2).toFixed(2),
        expectedApr: parseFloat(topProtocols[1][1].staking.apr)
      },
      {
        protocol: "pancakeswap",
        product: "APT-USDC Liquidity Pool",
        percentage: 30,
        amount: (amount * 0.3).toFixed(2),
        expectedApr: 10.5
      }
    ];
    
    totalApr = (allocation[0].expectedApr * 0.5 + allocation[1].expectedApr * 0.2 + allocation[2].expectedApr * 0.3).toFixed(2);
  }
  
  // Create fallback recommendation
  return {
    title: `${riskProfile.charAt(0).toUpperCase() + riskProfile.slice(1)} Investment Strategy for ${amount} APT`,
    summary: `This ${riskProfile} strategy focuses on ${riskProfile === 'conservative' ? 'safer liquid staking options' : riskProfile === 'aggressive' ? 'higher yield opportunities with increased risk' : 'a balanced approach between yield and security'}. It allocates your funds across multiple protocols to optimize returns while maintaining appropriate risk levels.`,
    totalApr: parseFloat(totalApr),
    allocation: allocation,
    steps: [
      "Connect your wallet to access the Aptos DeFi ecosystem",
      "Execute the recommended allocation strategy using the one-click feature",
      "Monitor your positions periodically to ensure they perform as expected",
      "Consider rebalancing your portfolio if market conditions change significantly"
    ],
    risks: [
      "Smart contract vulnerabilities could potentially impact invested funds",
      "APR rates fluctuate based on market conditions and are not guaranteed",
      "Liquidity pools may experience impermanent loss during volatile markets"
    ],
    mitigations: [
      "Assets are distributed across multiple protocols to reduce risk exposure",
      "Liquid staking tokens can be quickly unwrapped if needed",
      "Use auto-compound features where available to maximize returns"
    ],
    additionalNotes: "This recommendation is generated based on current market conditions and historical performance. Regular rebalancing is recommended as market conditions evolve.",
    meta: {
      timestamp: new Date().toISOString(),
      model: "fallback",
      provider: 'local',
      riskProfile: riskProfile,
      amount: amount,
      fallback: true
    }
  };
}

/**
 * Generate portfolio rebalancing strategy
 * @param {Object} data - Current portfolio and market data
 * @param {Object} options - Configuration options
 * @returns {Promise<Object>} - Rebalancing recommendations
 */
async function generateRebalanceStrategy(data, options = {}) {
  const {
    portfolio,
    recommendation,
    threshold = 5.0,
    preserveStakedPositions = true
  } = data;
  
  try {
    // Generate a specialized prompt for portfolio rebalancing
    const prompt = `I need to rebalance a DeFi portfolio on Aptos blockchain.

Current Portfolio:
${JSON.stringify(portfolio, null, 2)}

Target Allocation from Previous Recommendation:
${JSON.stringify(recommendation.allocation, null, 2)}

Rebalancing parameters:
- Minimum drift threshold: ${threshold}%
- Preserve staked positions: ${preserveStakedPositions ? 'Yes' : 'No'}

Please provide a rebalancing strategy that minimizes gas costs and transaction count. 
Return a JSON object with:
{
  "rebalanceNeeded": true/false,
  "totalDrift": "percentage as number",
  "driftByAsset": [
    {
      "asset": "Asset name",
      "currentAllocation": "percentage as number",
      "targetAllocation": "percentage as number",
      "drift": "percentage as number",
      "action": "increase/decrease/maintain"
    }
  ],
  "operations": [
    {
      "type": "stake/unstake/swap/addLiquidity/removeLiquidity",
      "protocol": "Protocol name",
      "asset": "Asset name",
      "amount": "amount as number",
      "priority": "priority as number (1 highest)"
    }
  ],
  "expectedAPRAfter": "new blended APR percentage as number",
  "executionOrder": ["operation 1", "operation 2", "..."]
}`;

    // Try with Anthropic Claude first
    if (anthropicClient) {
      try {
        logger.info('Generating rebalance strategy with Anthropic Claude');
        
        const response = await anthropicClient.messages.create({
          model: options.model || "claude-3-5-sonnet",
          max_tokens: 4000,
          temperature: 0.1,
          messages: [
            { role: "user", content: prompt }
          ]
        });
        
        // Parse and return the JSON response
        const content = response.content[0].text;
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/{[\s\S]*}/);
        
        if (!jsonMatch) {
          throw new Error("Could not parse AI response as JSON");
        }
        
        const rebalanceStrategy = JSON.parse(jsonMatch[1] || jsonMatch[0]);
        
        // Add execution metadata
        rebalanceStrategy.meta = {
          timestamp: new Date().toISOString(),
          model: options.model || "claude-3-5-sonnet",
          provider: 'anthropic'
        };
        
        return rebalanceStrategy;
      } catch (anthropicError) {
        logger.error('Anthropic API failed for rebalance strategy:', anthropicError.message);
        
        // Fall back to OpenAI if Anthropic fails
        if (openaiClient) {
          throw anthropicError; // Will be caught by outer try/catch and fallback to OpenAI
        } else {
          throw anthropicError; // No fallback available
        }
      }
    }
    // Use OpenAI as primary or fallback
    else if (openaiClient) {
      logger.info(`Generating rebalance strategy with OpenAI as ${anthropicClient ? 'fallback' : 'primary'}`);
      
      const openaiResponse = await openaiClient.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "user", content: prompt }
        ],
        temperature: 0.1,
        response_format: { type: "json_object" }
      });
      
      const rebalanceStrategy = JSON.parse(openaiResponse.choices[0].message.content);
      
      // Add execution metadata
      rebalanceStrategy.meta = {
        timestamp: new Date().toISOString(),
        model: "gpt-4o",
        provider: 'openai'
      };
      
      return rebalanceStrategy;
    } else {
      throw new Error('No AI provider available. Set ANTHROPIC_API_KEY or OPENAI_API_KEY in .env file.');
    }
  } catch (error) {
    logger.error('Error generating rebalance strategy:', error);
    
    // Return a simplified rebalance strategy based on basic calculations
    return calculateSimpleRebalanceStrategy(data);
  }
}

/**
 * Calculate a simple rebalance strategy without using AI
 * @param {Object} data - Portfolio and recommendation data
 * @returns {Object} - Simple rebalance strategy
 */
function calculateSimpleRebalanceStrategy(data) {
  const { portfolio, recommendation, threshold = 5.0 } = data;
  
  // Extract current allocations
  const totalValue = portfolio.totalValueUSD || 0;
  if (totalValue <= 0) {
    return {
      rebalanceNeeded: false,
      totalDrift: 0,
      driftByAsset: [],
      operations: [],
      expectedAPRAfter: recommendation.totalApr || 0,
      meta: {
        timestamp: new Date().toISOString(),
        provider: 'local',
        fallback: true
      }
    };
  }
  
  // Calculate current allocation percentages
  const currentAllocation = [];
  
  // Add native APT
  if (portfolio.apt && parseFloat(portfolio.apt.amount) > 0) {
    currentAllocation.push({
      asset: 'APT',
      protocol: 'native',
      currentAllocation: (portfolio.apt.valueUSD / totalValue * 100),
      amount: parseFloat(portfolio.apt.amount)
    });
  }
  
  // Add staked assets
  const stakedTokens = {
    'stAPT': { protocol: 'amnis', name: 'stAPT' },
    'sthAPT': { protocol: 'thala', name: 'sthAPT' },
    'tAPT': { protocol: 'tortuga', name: 'tAPT' },
    'dAPT': { protocol: 'ditto', name: 'dAPT' }
  };
  
  Object.entries(stakedTokens).forEach(([key, info]) => {
    if (portfolio[key] && parseFloat(portfolio[key].amount) > 0) {
      currentAllocation.push({
        asset: info.name,
        protocol: info.protocol,
        currentAllocation: (portfolio[key].valueUSD / totalValue * 100),
        amount: parseFloat(portfolio[key].amount)
      });
    }
  });
  
  // Process target allocation from recommendation
  const targetAllocation = {};
  recommendation.allocation.forEach(item => {
    targetAllocation[item.protocol.toLowerCase()] = {
      percentage: parseFloat(item.percentage),
      expectedApr: parseFloat(item.expectedApr || 0)
    };
  });
  
  // Calculate drift for each asset
  const driftByAsset = [];
  let totalDrift = 0;
  
  currentAllocation.forEach(current => {
    const target = targetAllocation[current.protocol.toLowerCase()];
    const targetPercentage = target ? target.percentage : 0;
    const drift = Math.abs(current.currentAllocation - targetPercentage);
    
    driftByAsset.push({
      asset: current.asset,
      protocol: current.protocol,
      currentAllocation: current.currentAllocation,
      targetAllocation: targetPercentage,
      drift: drift,
      action: current.currentAllocation > targetPercentage ? 'decrease' : 
              current.currentAllocation < targetPercentage ? 'increase' : 'maintain'
    });
    
    totalDrift += drift;
  });
  
  // Add targets that aren't in the current portfolio
  Object.entries(targetAllocation).forEach(([protocol, target]) => {
    const exists = currentAllocation.some(item => item.protocol.toLowerCase() === protocol);
    if (!exists) {
      driftByAsset.push({
        asset: protocol.charAt(0).toUpperCase() + protocol.slice(1),
        protocol: protocol,
        currentAllocation: 0,
        targetAllocation: target.percentage,
        drift: target.percentage,
        action: 'increase'
      });
      
      totalDrift += target.percentage;
    }
  });
  
  // Sort by drift (highest first)
  driftByAsset.sort((a, b) => b.drift - a.drift);
  
  // Determine if rebalance is needed
  const rebalanceNeeded = driftByAsset.some(item => item.drift >= threshold);
  const averageDrift = driftByAsset.length > 0 ? totalDrift / driftByAsset.length : 0;
  
  // Generate operations if rebalance is needed
  const operations = [];
  
  if (rebalanceNeeded) {
    let priority = 1;
    
    // First add all operations that reduce positions (unstake, remove liquidity)
    driftByAsset.filter(item => item.action === 'decrease' && item.drift >= threshold)
      .forEach(item => {
        const amountToReduce = item.amount * (item.drift / item.currentAllocation);
        
        operations.push({
          type: item.protocol === 'native' ? 'transfer' : 
                ['amnis', 'thala', 'tortuga', 'ditto'].includes(item.protocol) ? 'unstake' : 'removeLiquidity',
          protocol: item.protocol,
          asset: item.asset,
          amount: amountToReduce.toFixed(4),
          priority: priority++
        });
      });
    
    // Then add operations to increase positions
    driftByAsset.filter(item => item.action === 'increase' && item.drift >= threshold)
      .forEach(item => {
        const targetAmount = (item.targetAllocation / 100) * totalValue / 10; // Assuming APT price of ~$10
        const amountToAdd = targetAmount - (item.amount || 0);
        
        if (amountToAdd > 0) {
          operations.push({
            type: ['amnis', 'thala', 'tortuga', 'ditto'].includes(item.protocol) ? 'stake' : 
                  ['echo', 'aries'].includes(item.protocol) ? 'lend' : 'addLiquidity',
            protocol: item.protocol,
            asset: item.asset,
            amount: amountToAdd.toFixed(4),
            priority: priority++
          });
        }
      });
  }
  
  // Generate a simple execution order
  const executionOrder = operations.map(op => 
    `${op.type} ${op.amount} APT with ${op.protocol}`
  );
  
  return {
    rebalanceNeeded,
    totalDrift: averageDrift,
    driftByAsset,
    operations,
    expectedAPRAfter: recommendation.totalApr || 0,
    executionOrder,
    meta: {
      timestamp: new Date().toISOString(),
      provider: 'local',
      fallback: true
    }
  };
}

module.exports = {
  generateRecommendation,
  generateRebalanceStrategy,
  generateFallbackRecommendation,
  hasAnthropicSupport: !!anthropicClient,
  hasOpenAISupport: !!openaiClient
};