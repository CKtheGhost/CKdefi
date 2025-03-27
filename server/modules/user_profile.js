/**
 * user_profile.js - User profile management for CompounDefi
 * 
 * Manages user profiles, preferences, and interaction history
 * to personalize experience and optimize recommendations.
 */

const mongoose = require('mongoose');
const User = mongoose.model('User');
const cache = require('../middleware/caching');
const { analyzePortfolioHistory } = require('./portfolio_tracker');

// Cache TTL settings
const CACHE_TTL = {
  USER_PROFILE: 15 * 60, // 15 minutes
  USER_PREFERENCES: 30 * 60, // 30 minutes
  USER_STATS: 10 * 60 // 10 minutes
};

/**
 * Get or create a user profile
 * @param {string} walletAddress - User wallet address
 * @returns {Promise<Object>} User profile data
 */
async function getUserProfile(walletAddress) {
  if (!walletAddress) {
    throw new Error('Wallet address is required');
  }

  // Check cache first
  const cacheKey = `user:profile:${walletAddress}`;
  const cachedProfile = await cache.get(cacheKey);
  if (cachedProfile) {
    return cachedProfile;
  }

  try {
    // Find or create user profile
    let user = await User.findOne({ walletAddress });
    
    if (!user) {
      // Create new user profile
      user = new User({
        walletAddress,
        createdAt: new Date(),
        lastSeen: new Date(),
        preferences: {
          riskProfile: 'balanced',
          theme: 'auto',
          notificationsEnabled: true,
          autoRebalance: false,
          autoRebalanceInterval: 24 * 60 * 60 * 1000, // 24 hours
          preserveStakedPositions: true
        },
        stats: {
          loginCount: 1,
          recommendationsViewed: 0,
          strategiesExecuted: 0,
          totalTransactions: 0,
          totalValueLocked: 0
        }
      });
      
      await user.save();
    } else {
      // Update last seen timestamp
      user.lastSeen = new Date();
      user.stats.loginCount = (user.stats.loginCount || 0) + 1;
      await user.save();
    }

    // Format response data
    const profileData = {
      walletAddress: user.walletAddress,
      createdAt: user.createdAt,
      lastSeen: user.lastSeen,
      preferences: user.preferences,
      stats: user.stats
    };

    // Cache profile
    await cache.set(cacheKey, profileData, CACHE_TTL.USER_PROFILE);

    return profileData;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
}

/**
 * Update user preferences
 * @param {string} walletAddress - User wallet address
 * @param {Object} preferences - User preferences to update
 * @returns {Promise<Object>} Updated preferences
 */
async function updateUserPreferences(walletAddress, preferences) {
  if (!walletAddress) {
    throw new Error('Wallet address is required');
  }

  if (!preferences || Object.keys(preferences).length === 0) {
    throw new Error('No preferences provided for update');
  }

  try {
    // Find user profile
    let user = await User.findOne({ walletAddress });
    
    if (!user) {
      // Create user profile if not exists
      return getUserProfile(walletAddress).then(() => 
        updateUserPreferences(walletAddress, preferences)
      );
    }

    // Update preferences
    const validPreferenceKeys = [
      'riskProfile', 
      'theme', 
      'notificationsEnabled', 
      'autoRebalance',
      'autoRebalanceInterval',
      'preserveStakedPositions',
      'dashboardLayout',
      'currency',
      'selectedProtocols'
    ];

    // Filter valid preference keys
    for (const [key, value] of Object.entries(preferences)) {
      if (validPreferenceKeys.includes(key)) {
        // Special handling for certain preferences
        if (key === 'riskProfile' && !['conservative', 'balanced', 'aggressive'].includes(value)) {
          continue;
        }
        if (key === 'theme' && !['light', 'dark', 'auto'].includes(value)) {
          continue;
        }
        
        // Set preference
        user.preferences[key] = value;
      }
    }

    // Save updated preferences
    user.lastUpdated = new Date();
    await user.save();

    // Update cache
    const cacheKey = `user:profile:${walletAddress}`;
    await cache.del(cacheKey);

    // Format response
    return {
      success: true,
      walletAddress,
      preferences: user.preferences,
      message: 'Preferences updated successfully'
    };
  } catch (error) {
    console.error('Error updating user preferences:', error);
    throw error;
  }
}

/**
 * Record user action (transaction, recommendation view, etc.)
 * @param {string} walletAddress - User wallet address
 * @param {Object} action - Action details
 * @returns {Promise<Object>} Updated user stats
 */
async function recordUserAction(walletAddress, action) {
  if (!walletAddress) {
    throw new Error('Wallet address is required');
  }

  if (!action || !action.type) {
    throw new Error('Invalid action data');
  }

  try {
    // Find user profile
    let user = await User.findOne({ walletAddress });
    
    if (!user) {
      // Create user profile if not exists
      return getUserProfile(walletAddress).then(() => 
        recordUserAction(walletAddress, action)
      );
    }

    // Process different action types
    const actionTime = new Date();
    
    // Create action record
    const actionRecord = {
      type: action.type,
      timestamp: actionTime,
      data: action.data || {}
    };

    // Add action to history
    if (!user.actionHistory) {
      user.actionHistory = [];
    }
    user.actionHistory.push(actionRecord);

    // Limit action history size
    if (user.actionHistory.length > 100) {
      user.actionHistory = user.actionHistory.slice(-100);
    }

    // Update stats based on action type
    if (!user.stats) {
      user.stats = {};
    }

    switch (action.type) {
      case 'view_recommendation':
        user.stats.recommendationsViewed = (user.stats.recommendationsViewed || 0) + 1;
        break;
      case 'execute_strategy':
        user.stats.strategiesExecuted = (user.stats.strategiesExecuted || 0) + 1;
        user.stats.totalTransactions = (user.stats.totalTransactions || 0) + 
          (action.data?.operationsCount || 1);
        break;
      case 'add_transaction':
        user.stats.totalTransactions = (user.stats.totalTransactions || 0) + 1;
        break;
      case 'toggle_rebalance':
        user.preferences.autoRebalance = !!action.data?.enabled;
        break;
      case 'portfolio_update':
        if (action.data?.totalValueLocked) {
          user.stats.totalValueLocked = action.data.totalValueLocked;
        }
        break;
    }

    // Save user with updated stats and history
    user.lastUpdated = actionTime;
    await user.save();

    // Update cache
    const cacheKey = `user:profile:${walletAddress}`;
    await cache.del(cacheKey);

    // Return updated stats
    return {
      success: true,
      walletAddress,
      stats: user.stats,
      lastUpdated: user.lastUpdated
    };
  } catch (error) {
    console.error('Error recording user action:', error);
    throw error;
  }
}

/**
 * Generate personalized insights based on user profile and history
 * @param {string} walletAddress - User wallet address
 * @returns {Promise<Object>} User insights
 */
async function generateUserInsights(walletAddress) {
  if (!walletAddress) {
    throw new Error('Wallet address is required');
  }

  try {
    // Get user profile
    const user = await User.findOne({ walletAddress }).lean();
    
    if (!user) {
      throw new Error('User profile not found');
    }

    // Get portfolio history for analysis
    const portfolioAnalysis = await analyzePortfolioHistory(walletAddress);

    // Generate insights
    const insights = {
      activityLevel: calculateActivityLevel(user),
      riskAppetite: analyzeRiskAppetite(user, portfolioAnalysis),
      preferredProtocols: identifyPreferredProtocols(user),
      profitableTrends: identifyProfitableTrends(portfolioAnalysis),
      suggestionAreas: identifySuggestionAreas(user, portfolioAnalysis)
    };

    // Cache insights
    const cacheKey = `user:insights:${walletAddress}`;
    await cache.set(cacheKey, insights, CACHE_TTL.USER_STATS);

    return insights;
  } catch (error) {
    console.error('Error generating user insights:', error);
    throw error;
  }
}

/**
 * Calculate user activity level based on login frequency and actions
 * @param {Object} user - User profile data
 * @returns {string} Activity level
 */
function calculateActivityLevel(user) {
  if (!user || !user.stats) {
    return 'new';
  }

  const loginCount = user.stats.loginCount || 0;
  const transactionCount = user.stats.totalTransactions || 0;
  const daysSinceCreation = Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24));
  
  if (daysSinceCreation < 7) {
    return 'new';
  }
  
  // Calculate activity score
  const activityScore = (loginCount / daysSinceCreation) * 5 + (transactionCount / daysSinceCreation) * 10;

  if (activityScore > 5) {
    return 'very_active';
  } else if (activityScore > 2) {
    return 'active';
  } else if (activityScore > 0.5) {
    return 'occasional';
  } else {
    return 'inactive';
  }
}

/**
 * Analyze user risk appetite based on preferences and portfolio
 * @param {Object} user - User profile data
 * @param {Object} portfolioAnalysis - Portfolio analysis data
 * @returns {Object} Risk appetite analysis
 */
function analyzeRiskAppetite(user, portfolioAnalysis) {
  if (!user || !user.preferences) {
    return { profile: 'unknown', confidence: 0 };
  }

  // Start with user's stated preference
  const statedRiskProfile = user.preferences.riskProfile || 'balanced';
  
  // Look for signs of actual behavior that differ from stated preference
  let behavioralEvidence = {};
  
  if (portfolioAnalysis && portfolioAnalysis.allocation) {
    // Check allocation to risky assets
    const riskyAssetPercentage = portfolioAnalysis.allocation.filter(
      a => a.riskLevel === 'high'
    ).reduce((sum, a) => sum + a.percentage, 0);
    
    // Check staking vs. liquidity provision ratio
    const lpPercentage = portfolioAnalysis.allocation.filter(
      a => a.type === 'liquidity'
    ).reduce((sum, a) => sum + a.percentage, 0);
    
    // Analyze transaction frequency
    const txFrequency = portfolioAnalysis.metrics?.transactionFrequency || 'low';
    
    // Evidence collection
    if (riskyAssetPercentage > 50 && statedRiskProfile !== 'aggressive') {
      behavioralEvidence.riskyAssets = { 
        observation: 'High allocation to risky assets', 
        suggests: 'aggressive' 
      };
    } else if (riskyAssetPercentage < 20 && statedRiskProfile !== 'conservative') {
      behavioralEvidence.riskyAssets = { 
        observation: 'Low allocation to risky assets', 
        suggests: 'conservative' 
      };
    }
    
    if (lpPercentage > 30 && statedRiskProfile !== 'aggressive') {
      behavioralEvidence.liquidityProvision = { 
        observation: 'High allocation to liquidity pools', 
        suggests: 'aggressive' 
      };
    }
    
    if (txFrequency === 'high' && statedRiskProfile !== 'aggressive') {
      behavioralEvidence.transactionFrequency = { 
        observation: 'High transaction frequency', 
        suggests: 'aggressive' 
      };
    } else if (txFrequency === 'low' && statedRiskProfile !== 'conservative') {
      behavioralEvidence.transactionFrequency = { 
        observation: 'Low transaction frequency', 
        suggests: 'conservative' 
      };
    }
  }
  
  // Calculate confidence in stated risk profile
  const evidenceCount = Object.keys(behavioralEvidence).length;
  const conflictingEvidenceCount = Object.values(behavioralEvidence)
    .filter(e => e.suggests !== statedRiskProfile)
    .length;
    
  // Determine confidence (0-100)
  let confidence = 100;
  if (evidenceCount > 0) {
    confidence = Math.max(0, 100 - (conflictingEvidenceCount / evidenceCount) * 100);
  }
  
  // Determine most likely actual risk profile
  let actualProfile = statedRiskProfile;
  if (conflictingEvidenceCount > evidenceCount / 2) {
    // Count suggestions for each profile
    const suggestions = Object.values(behavioralEvidence)
      .reduce((counts, e) => {
        counts[e.suggests] = (counts[e.suggests] || 0) + 1;
        return counts;
      }, {});
    
    // Find the most suggested profile
    const suggestedProfiles = Object.entries(suggestions)
      .sort((a, b) => b[1] - a[1]);
    
    if (suggestedProfiles.length > 0) {
      actualProfile = suggestedProfiles[0][0];
    }
  }
  
  return {
    profile: actualProfile,
    statedProfile: statedRiskProfile,
    confidence: Math.round(confidence),
    evidence: behavioralEvidence
  };
}

/**
 * Identify user's preferred protocols based on usage
 * @param {Object} user - User profile data
 * @returns {Array} Preferred protocols
 */
function identifyPreferredProtocols(user) {
  if (!user || !user.actionHistory) {
    return [];
  }

  // Count protocol interactions
  const protocolCounts = {};
  user.actionHistory.forEach(action => {
    if (action.data && action.data.protocol) {
      const protocol = action.data.protocol;
      protocolCounts[protocol] = (protocolCounts[protocol] || 0) + 1;
    }
  });

  // Sort by frequency
  const sortedProtocols = Object.entries(protocolCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([protocol, count]) => ({
      protocol,
      interactionCount: count,
      lastUsed: findLastUsage(user.actionHistory, protocol)
    }));

  return sortedProtocols;
}

/**
 * Find last usage timestamp for a protocol
 * @param {Array} history - User action history
 * @param {string} protocol - Protocol name
 * @returns {string} Last usage timestamp or null
 */
function findLastUsage(history, protocol) {
  if (!history || !protocol) {
    return null;
  }

  // Find actions related to this protocol
  const relevantActions = history.filter(
    action => action.data && action.data.protocol === protocol
  );

  if (relevantActions.length === 0) {
    return null;
  }

  // Sort by timestamp (descending)
  relevantActions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Return the most recent timestamp
  return relevantActions[0].timestamp;
}

/**
 * Identify profitable trends from portfolio analysis
 * @param {Object} portfolioAnalysis - Portfolio analysis data
 * @returns {Array} Profitable trends
 */
function identifyProfitableTrends(portfolioAnalysis) {
  if (!portfolioAnalysis || !portfolioAnalysis.performanceByProtocol) {
    return [];
  }

  // Extract performance data
  const performanceData = portfolioAnalysis.performanceByProtocol;

  // Calculate overall performance for each protocol
  const protocolPerformance = Object.entries(performanceData)
    .map(([protocol, data]) => {
      const latestValue = data.values[data.values.length - 1] || 0;
      const initialValue = data.values[0] || 0;
      
      // Avoid division by zero
      const percentageChange = initialValue > 0 
        ? ((latestValue - initialValue) / initialValue) * 100 
        : 0;
      
      return {
        protocol,
        percentageChange,
        rawChange: latestValue - initialValue
      };
    })
    .filter(item => !isNaN(item.percentageChange))
    .sort((a, b) => b.percentageChange - a.percentageChange);

  // Return top performers
  return protocolPerformance;
}

/**
 * Identify suggestion areas for improvement
 * @param {Object} user - User profile data
 * @param {Object} portfolioAnalysis - Portfolio analysis data
 * @returns {Array} Suggestion areas
 */
function identifySuggestionAreas(user, portfolioAnalysis) {
  const suggestions = [];

  // Check for portfolio diversification
  if (portfolioAnalysis && portfolioAnalysis.allocation) {
    const protocols = portfolioAnalysis.allocation.map(a => a.protocol);
    const uniqueProtocols = new Set(protocols);
    
    if (uniqueProtocols.size < 3) {
      suggestions.push({
        area: 'diversification',
        message: 'Consider diversifying your portfolio across more protocols',
        priority: 'high'
      });
    }
  }

  // Check for auto-rebalance usage
  if (user && user.preferences && !user.preferences.autoRebalance) {
    suggestions.push({
      area: 'automation',
      message: 'Enable auto-rebalancing to optimize your portfolio regularly',
      priority: 'medium'
    });
  }

  // Check for unused features
  if (user && user.stats) {
    if (!user.stats.recommendationsViewed || user.stats.recommendationsViewed < 3) {
      suggestions.push({
        area: 'ai_recommendations',
        message: 'Try our AI recommendations for personalized investment strategies',
        priority: 'medium'
      });
    }
  }

  // Check for portfolio monitoring
  const lastLogin = user && user.lastSeen ? new Date(user.lastSeen) : null;
  const now = new Date();
  if (lastLogin && ((now - lastLogin) / (1000 * 60 * 60 * 24)) > 14) {
    suggestions.push({
      area: 'monitoring',
      message: 'Check your portfolio more regularly to stay updated on performance',
      priority: 'high'
    });
  }

  return suggestions;
}

module.exports = {
  getUserProfile,
  updateUserPreferences,
  recordUserAction,
  generateUserInsights
};