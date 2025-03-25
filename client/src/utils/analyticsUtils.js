// analyticsUtils.js - Analytics utilities for CompounDefi

/**
 * Utility functions for tracking user behavior, portfolio performance metrics,
 * and application events to improve user experience and product features.
 */

/**
 * Track a user event in the application
 * @param {string} eventName - Name of the event to track
 * @param {Object} parameters - Additional parameters for the event
 */
export const trackEvent = (eventName, parameters = {}) => {
  try {
    // Add timestamp to all events
    const eventData = {
      ...parameters,
      timestamp: new Date().toISOString(),
    };
    
    // Log event to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Event Tracked] ${eventName}:`, eventData);
    }
    
    // Send to analytics service if API key is configured
    if (process.env.REACT_APP_ANALYTICS_KEY) {
      // This would be replaced with actual analytics service integration
      // Example: mixpanel.track(eventName, eventData);
    }
    
    // Store in local event queue for batch processing
    const storedEvents = JSON.parse(localStorage.getItem('analyticsEvents') || '[]');
    storedEvents.push({ eventName, ...eventData });
    
    // Limit stored events to prevent localStorage overflow
    const limitedEvents = storedEvents.slice(-100);
    localStorage.setItem('analyticsEvents', JSON.stringify(limitedEvents));
    
    // Trigger batch send if enough events have accumulated
    if (limitedEvents.length >= 20) {
      sendBatchEvents(limitedEvents);
    }
  } catch (error) {
    console.error('Failed to track event:', error);
  }
};

/**
 * Send a batch of events to the analytics service
 * @param {Array} events - Array of events to send
 */
const sendBatchEvents = async (events) => {
  try {
    // Skip if no analytics key is configured
    if (!process.env.REACT_APP_ANALYTICS_KEY) return;
    
    // In a production environment, this would send events to your analytics service
    // Example:
    // const response = await fetch('/api/analytics/batch', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ events })
    // });
    
    // Clear stored events on successful send
    // if (response.ok) {
    //   localStorage.setItem('analyticsEvents', '[]');
    // }
    
    // For now, just clear the events in localStorage
    localStorage.setItem('analyticsEvents', '[]');
  } catch (error) {
    console.error('Failed to send batch events:', error);
  }
};

/**
 * Track page view in the application
 * @param {string} pageName - Name of the page being viewed
 * @param {Object} additionalData - Additional data about the page view
 */
export const trackPageView = (pageName, additionalData = {}) => {
  trackEvent('page_view', { 
    pageName,
    path: window.location.pathname,
    ...additionalData
  });
};

/**
 * Track wallet connection events
 * @param {string} walletAddress - Connected wallet address
 * @param {string} walletProvider - Wallet provider name (e.g., 'petra', 'martian')
 * @param {boolean} success - Whether connection was successful
 * @param {string} errorMessage - Error message if connection failed
 */
export const trackWalletConnection = (walletAddress, walletProvider, success, errorMessage = null) => {
  trackEvent('wallet_connection', {
    walletAddress: walletAddress ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}` : null,
    walletProvider,
    success,
    errorMessage
  });
};

/**
 * Track transaction execution
 * @param {string} type - Transaction type (e.g., 'stake', 'unstake', 'swap')
 * @param {string} protocol - Protocol name (e.g., 'amnis', 'thala')
 * @param {string} amount - Transaction amount
 * @param {boolean} success - Whether transaction was successful
 * @param {string} errorMessage - Error message if transaction failed
 */
export const trackTransaction = (type, protocol, amount, success, errorMessage = null) => {
  trackEvent('transaction', {
    type,
    protocol,
    amount,
    success,
    errorMessage
  });
};

/**
 * Track AI recommendation generation
 * @param {string} riskProfile - User risk profile
 * @param {number} amount - Investment amount
 * @param {boolean} success - Whether recommendation was successfully generated
 */
export const trackRecommendation = (riskProfile, amount, success) => {
  trackEvent('ai_recommendation', {
    riskProfile,
    amount,
    success
  });
};

/**
 * Track portfolio performance metrics
 * @param {Object} portfolioData - Portfolio data object
 */
export const trackPortfolioMetrics = (portfolioData) => {
  if (!portfolioData) return;
  
  // Extract key metrics while anonymizing the data
  const metrics = {
    totalValue: portfolioData.totalValueUSD || 0,
    aptPercentage: calculatePercentage(portfolioData.apt?.valueUSD, portfolioData.totalValueUSD),
    stakedPercentage: calculatePercentage(
      (portfolioData.stAPT?.valueUSD || 0) + 
      (portfolioData.sthAPT?.valueUSD || 0) + 
      (portfolioData.tAPT?.valueUSD || 0), 
      portfolioData.totalValueUSD
    ),
    ammPercentage: calculatePercentage(portfolioData.ammLiquidity?.estimatedValueUSD, portfolioData.totalValueUSD),
    hasActiveStaking: Boolean(
      parseFloat(portfolioData.stAPT?.amount || 0) > 0 || 
      parseFloat(portfolioData.sthAPT?.amount || 0) > 0 || 
      parseFloat(portfolioData.tAPT?.amount || 0) > 0
    ),
    hasAmmLiquidity: Boolean(portfolioData.ammLiquidity?.hasLiquidity)
  };
  
  trackEvent('portfolio_metrics', metrics);
};

/**
 * Calculate percentage safely
 * @param {number} value - The value to calculate percentage for
 * @param {number} total - The total value
 * @returns {number} The percentage
 */
const calculatePercentage = (value, total) => {
  if (!value || !total || total === 0) return 0;
  return (value / total * 100).toFixed(2);
};

/**
 * Generate an anonymized user fingerprint for analytics
 * This helps track unique users without storing personal data
 * @returns {string} Anonymized user identifier
 */
export const generateUserFingerprint = () => {
  // Get or create a unique user ID
  let userId = localStorage.getItem('anonymous_user_id');
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('anonymous_user_id', userId);
  }
  return userId;
};

/**
 * Track social media connections
 * @param {string} platform - Platform name (twitter, discord, telegram)
 * @param {boolean} success - Whether connection was successful
 */
export const trackSocialConnection = (platform, success) => {
  trackEvent('social_connection', {
    platform,
    success
  });
};

/**
 * Track auto-optimizer events
 * @param {string} action - Action type (enable, disable, execute)
 * @param {boolean} success - Whether action was successful
 * @param {Object} settings - Optimizer settings
 */
export const trackAutoOptimizer = (action, success, settings = {}) => {
  trackEvent('auto_optimizer', {
    action,
    success,
    ...settings
  });
};

/**
 * Calculate and track strategy performance
 * @param {Object} strategy - Strategy details
 * @param {Object} portfolioData - User portfolio data
 */
export const trackStrategyPerformance = (strategy, portfolioData) => {
  if (!strategy || !portfolioData) return;
  
  // Calculate performance metrics
  const expectedApr = parseFloat(strategy.apr || 0);
  const totalValue = parseFloat(portfolioData.totalValueUSD || 0);
  const projectedAnnualYield = totalValue * (expectedApr / 100);
  
  trackEvent('strategy_performance', {
    expectedApr,
    projectedAnnualYield: projectedAnnualYield.toFixed(2),
    riskProfile: strategy.riskLevel || 'unknown',
    protocolCount: strategy.allocation?.length || 0
  });
};

export default {
  trackEvent,
  trackPageView,
  trackWalletConnection,
  trackTransaction,
  trackRecommendation,
  trackPortfolioMetrics,
  trackSocialConnection,
  trackAutoOptimizer,
  trackStrategyPerformance,
  generateUserFingerprint
};