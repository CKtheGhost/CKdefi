// src/utils/analyticsUtils.js
// Analytics utility functions for tracking user actions and application performance

// Mock implementation for analytics tracking
// In production, this would be replaced with a real analytics provider like Google Analytics, Mixpanel, etc.
const analyticsEndpoint = process.env.REACT_APP_ANALYTICS_ENDPOINT || '/api/analytics';
const analyticsEnabled = process.env.REACT_APP_ANALYTICS_ENABLED !== 'false';
const debugMode = process.env.NODE_ENV === 'development';

/**
 * Initialize analytics
 * @param {Object} options - Configuration options
 */
export const initAnalytics = (options = {}) => {
  if (!analyticsEnabled) return;
  
  const { userId, walletAddress, referrer } = options;
  
  try {
    // Log initialization
    if (debugMode) {
      console.log('Analytics initialized:', { userId, walletAddress, referrer });
    }
    
    // Send initialization event
    sendAnalyticsEvent('init', {
      timestamp: Date.now(),
      userId,
      walletAddress,
      referrer: referrer || document.referrer,
      url: window.location.href,
      userAgent: navigator.userAgent,
      screenSize: `${window.innerWidth}x${window.innerHeight}`
    });
    
    // Set up page view tracking
    trackPageViews();
  } catch (error) {
    console.error('Analytics initialization error:', error);
  }
};

/**
 * Track wallet connection/disconnection events
 * @param {string} address - Wallet address
 * @param {string} provider - Wallet provider name
 * @param {boolean} success - Whether operation was successful
 * @param {string} error - Error message if failed
 */
export const trackWalletConnection = (address, provider, success, error = null) => {
  if (!analyticsEnabled) return;
  
  const eventName = success ? 'wallet_connected' : 'wallet_connection_failed';
  
  const eventData = {
    timestamp: Date.now(),
    address: address ? maskAddress(address) : null,
    provider,
    success
  };
  
  if (error) {
    eventData.error = error;
  }
  
  sendAnalyticsEvent(eventName, eventData);
};

/**
 * Track a blockchain transaction
 * @param {string} type - Transaction type
 * @param {string} protocol - Protocol name
 * @param {string|number} amount - Transaction amount
 * @param {boolean} success - Whether transaction was successful
 * @param {string} error - Error message if failed
 */
export const trackTransaction = (type, protocol, amount, success, error = null) => {
  if (!analyticsEnabled) return;
  
  const eventName = success ? 'transaction_success' : 'transaction_failed';
  
  const eventData = {
    timestamp: Date.now(),
    type,
    protocol,
    amount: parseFloat(amount),
    success
  };
  
  if (error) {
    eventData.error = error;
  }
  
  sendAnalyticsEvent(eventName, eventData);
};

/**
 * Track AI recommendation generation
 * @param {string} riskProfile - User risk profile
 * @param {string|number} amount - Investment amount
 * @param {boolean} success - Whether generation was successful
 * @param {string} error - Error message if failed
 */
export const trackRecommendation = (riskProfile, amount, success, error = null) => {
  if (!analyticsEnabled) return;
  
  const eventName = success ? 'recommendation_generated' : 'recommendation_failed';
  
  const eventData = {
    timestamp: Date.now(),
    riskProfile,
    amount: parseFloat(amount),
    success
  };
  
  if (error) {
    eventData.error = error;
  }
  
  sendAnalyticsEvent(eventName, eventData);
};

/**
 * Track auto-optimizer events
 * @param {string} action - Action (enable, disable, rebalance)
 * @param {Object} settings - Optimizer settings
 * @param {boolean} success - Whether action was successful
 */
export const trackOptimizer = (action, settings, success = true) => {
  if (!analyticsEnabled) return;
  
  const eventName = `optimizer_${action}`;
  
  const eventData = {
    timestamp: Date.now(),
    action,
    settings,
    success
  };
  
  sendAnalyticsEvent(eventName, eventData);
};

/**
 * Track user engagement with specific features
 * @param {string} feature - Feature name
 * @param {string} action - Action taken
 * @param {Object} metadata - Additional metadata
 */
export const trackEngagement = (feature, action, metadata = {}) => {
  if (!analyticsEnabled) return;
  
  const eventName = 'feature_engagement';
  
  const eventData = {
    timestamp: Date.now(),
    feature,
    action,
    ...metadata
  };
  
  sendAnalyticsEvent(eventName, eventData);
};

/**
 * Track page views
 */
export const trackPageViews = () => {
  if (!analyticsEnabled) return;
  
  // Track initial page view
  const currentPage = window.location.pathname;
  trackPageView(currentPage);
  
  // Set up history change listener for SPAs
  const originalPushState = window.history.pushState;
  window.history.pushState = function() {
    originalPushState.apply(this, arguments);
    trackPageView(window.location.pathname);
  };
  
  // Handle back/forward navigation
  window.addEventListener('popstate', () => {
    trackPageView(window.location.pathname);
  });
};

/**
 * Track individual page view
 * @param {string} path - Page path
 */
export const trackPageView = (path) => {
  if (!analyticsEnabled) return;
  
  const eventData = {
    timestamp: Date.now(),
    path,
    title: document.title,
    referrer: document.referrer
  };
  
  sendAnalyticsEvent('page_view', eventData);
};

/**
 * Track application performance metrics
 * @param {string} metric - Metric name
 * @param {number} value - Metric value
 * @param {Object} metadata - Additional metadata
 */
export const trackPerformance = (metric, value, metadata = {}) => {
  if (!analyticsEnabled) return;
  
  const eventData = {
    timestamp: Date.now(),
    metric,
    value,
    ...metadata
  };
  
  sendAnalyticsEvent('performance', eventData);
};

/**
 * Track errors
 * @param {string} context - Error context
 * @param {string} message - Error message
 * @param {Object} metadata - Additional metadata
 */
export const trackError = (context, message, metadata = {}) => {
  if (!analyticsEnabled) return;
  
  const eventData = {
    timestamp: Date.now(),
    context,
    message,
    url: window.location.href,
    ...metadata
  };
  
  sendAnalyticsEvent('error', eventData);
};

/**
 * Send analytics event to server
 * @param {string} eventName - Event name
 * @param {Object} eventData - Event data
 */
const sendAnalyticsEvent = async (eventName, eventData) => {
  try {
    if (debugMode) {
      console.log(`Analytics event: ${eventName}`, eventData);
    }
    
    if (!analyticsEnabled) return;
    
    // For development or when endpoint is not available, just log
    if (process.env.NODE_ENV === 'development' || !analyticsEndpoint) {
      return;
    }
    
    // Use Beacon API if available for non-blocking analytics
    if (navigator.sendBeacon) {
      const blob = new Blob(
        [JSON.stringify({ event: eventName, data: eventData })], 
        { type: 'application/json' }
      );
      navigator.sendBeacon(analyticsEndpoint, blob);
      return;
    }
    
    // Fallback to fetch API
    fetch(analyticsEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event: eventName,
        data: eventData
      }),
      // Use keepalive to ensure the request completes even if page is unloaded
      keepalive: true
    }).catch(error => {
      console.error('Analytics send error:', error);
    });
  } catch (error) {
    console.error('Analytics error:', error);
  }
};

/**
 * Mask sensitive data like wallet addresses
 * @param {string} address - Full wallet address
 * @returns {string} Masked address (e.g., 0x1234...5678)
 */
const maskAddress = (address) => {
  if (!address || typeof address !== 'string') return null;
  
  if (address.length <= 10) return address;
  
  const prefix = address.substring(0, 6);
  const suffix = address.substring(address.length - 4);
  
  return `${prefix}...${suffix}`;
};

export default {
  initAnalytics,
  trackWalletConnection,
  trackTransaction,
  trackRecommendation,
  trackOptimizer,
  trackEngagement,
  trackPageView,
  trackPerformance,
  trackError
};