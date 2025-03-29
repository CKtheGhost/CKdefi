/// src/utils/analyticsUtils.js
// Analytics tracking utilities for CompounDefi frontend

/**
 * Analytics utilities for tracking user behavior and performance metrics
 * Compatible with multiple analytics providers (Google Analytics, Mixpanel, custom backend)
 */

// Configuration
const ANALYTICS_ENABLED = process.env.REACT_APP_ANALYTICS_ENABLED === 'true';
const ANALYTICS_DEBUG = process.env.NODE_ENV === 'development';
const ANALYTICS_ENDPOINT = process.env.REACT_APP_ANALYTICS_ENDPOINT || '/api/analytics';

// Event categories
export const EVENT_CATEGORIES = {
  PORTFOLIO: 'portfolio',
  RECOMMENDATION: 'recommendation',
  TRANSACTION: 'transaction',
  REBALANCE: 'rebalance',
  USER: 'user',
  WALLET: 'wallet',
  SOCIAL: 'social',
  UI: 'ui'
};

// Initialize analytics trackers
let analyticsInitialized = false;
let anonymousId = null;

/**
 * Initialize analytics with user info
 * @param {Object} options - Configuration options
 */
export const initializeAnalytics = (options = {}) => {
  if (!ANALYTICS_ENABLED) return;
  
  try {
    // Generate or retrieve anonymous ID
    anonymousId = localStorage.getItem('analyticsId') || generateRandomId();
    localStorage.setItem('analyticsId', anonymousId);
    
    // Initialize tracking services if present in window
    if (window.gtag) {
      window.gtag('config', process.env.REACT_APP_GA_MEASUREMENT_ID, {
        send_page_view: false // We'll track page views manually
      });
    }
    
    if (window.mixpanel) {
      window.mixpanel.init(process.env.REACT_APP_MIXPANEL_TOKEN, {
        debug: ANALYTICS_DEBUG
      });
    }
    
    // Set user identity if available
    if (options.walletAddress) {
      identifyUser(options.walletAddress);
    }
    
    analyticsInitialized = true;
    log('Analytics initialized successfully');
  } catch (error) {
    console.error('Failed to initialize analytics:', error);
  }
};

/**
 * Track page view event
 * @param {string} pageName - Name of the page 
 * @param {Object} properties - Additional properties
 */
export const trackPageView = (pageName, properties = {}) => {
  if (!ensureInitialized()) return;
  
  try {
    // Google Analytics
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: pageName,
        page_location: window.location.href,
        page_path: window.location.pathname,
        ...properties
      });
    }
    
    // Mixpanel
    if (window.mixpanel) {
      window.mixpanel.track('Page Viewed', {
        page: pageName,
        url: window.location.href,
        ...properties
      });
    }
    
    // Send to backend
    sendToBackend('pageview', {
      page: pageName,
      url: window.location.href,
      ...properties
    });
    
    log(`Page view: ${pageName}`);
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};

/**
 * Track custom event
 * @param {string} eventName - Name of the event
 * @param {string} category - Event category
 * @param {Object} properties - Additional properties
 */
export const trackEvent = (eventName, category, properties = {}) => {
  if (!ensureInitialized()) return;
  
  try {
    // Google Analytics
    if (window.gtag) {
      window.gtag('event', eventName, {
        event_category: category,
        ...properties
      });
    }
    
    // Mixpanel
    if (window.mixpanel) {
      window.mixpanel.track(eventName, {
        category,
        ...properties
      });
    }
    
    // Send to backend
    sendToBackend('event', {
      name: eventName,
      category,
      ...properties
    });
    
    log(`Event: ${eventName} (${category})`, properties);
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

/**
 * Track portfolio interaction events
 * @param {string} action - Action performed
 * @param {Object} details - Action details
 */
export const trackPortfolioAction = (action, details = {}) => {
  trackEvent(`portfolio_${action}`, EVENT_CATEGORIES.PORTFOLIO, details);
};

/**
 * Track recommendation interaction events
 * @param {string} action - Action performed
 * @param {Object} details - Action details
 */
export const trackRecommendationAction = (action, details = {}) => {
  trackEvent(`recommendation_${action}`, EVENT_CATEGORIES.RECOMMENDATION, details);
};

/**
 * Track transaction events
 * @param {string} action - Transaction action
 * @param {Object} details - Transaction details
 */
export const trackTransaction = (action, details = {}) => {
  trackEvent(`transaction_${action}`, EVENT_CATEGORIES.TRANSACTION, details);
};

/**
 * Track rebalancing events
 * @param {string} action - Rebalance action
 * @param {Object} details - Rebalance details
 */
export const trackRebalance = (action, details = {}) => {
  trackEvent(`rebalance_${action}`, EVENT_CATEGORIES.REBALANCE, details);
};

/**
 * Track user actions
 * @param {string} action - User action
 * @param {Object} details - Action details
 */
export const trackUserAction = (action, details = {}) => {
  trackEvent(`user_${action}`, EVENT_CATEGORIES.USER, details);
};

/**
 * Track wallet interactions
 * @param {string} action - Wallet action
 * @param {Object} details - Action details
 */
export const trackWalletAction = (action, details = {}) => {
  trackEvent(`wallet_${action}`, EVENT_CATEGORIES.WALLET, details);
};

/**
 * Track social media interactions
 * @param {string} action - Social action
 * @param {Object} details - Action details
 */
export const trackSocialAction = (action, details = {}) => {
  trackEvent(`social_${action}`, EVENT_CATEGORIES.SOCIAL, details);
};

/**
 * Track UI interactions
 * @param {string} element - UI element
 * @param {string} action - Action performed
 * @param {Object} details - Additional details
 */
export const trackUIInteraction = (element, action, details = {}) => {
  trackEvent(`ui_${element}_${action}`, EVENT_CATEGORIES.UI, details);
};

/**
 * Track timing events (performance metrics)
 * @param {string} category - Timing category
 * @param {string} variable - What is being timed
 * @param {number} time - Time in milliseconds
 * @param {Object} properties - Additional properties
 */
export const trackTiming = (category, variable, time, properties = {}) => {
  if (!ensureInitialized()) return;
  
  try {
    // Google Analytics
    if (window.gtag) {
      window.gtag('event', 'timing_complete', {
        name: variable,
        value: time,
        event_category: category,
        ...properties
      });
    }
    
    // Mixpanel
    if (window.mixpanel) {
      window.mixpanel.track('Timing', {
        category,
        variable,
        time,
        ...properties
      });
    }
    
    // Send to backend
    sendToBackend('timing', {
      category,
      variable,
      time,
      ...properties
    });
    
    log(`Timing: ${category} - ${variable} = ${time}ms`);
  } catch (error) {
    console.error('Error tracking timing:', error);
  }
};

/**
 * Identify user for analytics
 * @param {string} walletAddress - User's wallet address
 * @param {Object} traits - Additional user traits
 */
export const identifyUser = (walletAddress, traits = {}) => {
  if (!ANALYTICS_ENABLED) return;
  
  try {
    // Create anonymized ID from wallet address
    const userId = walletAddress ? 
      `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}` : 
      anonymousId;
    
    // Set user ID in Google Analytics
    if (window.gtag) {
      window.gtag('set', 'user_properties', {
        user_id: userId,
        wallet_address_masked: userId,
        ...traits
      });
    }
    
    // Set user ID in Mixpanel
    if (window.mixpanel) {
      window.mixpanel.identify(userId);
      if (Object.keys(traits).length > 0) {
        window.mixpanel.people.set({
          wallet_address_masked: userId,
          ...traits
        });
      }
    }
    
    // Send to backend
    sendToBackend('identify', {
      userId,
      traits: {
        wallet_address_masked: userId,
        ...traits
      }
    });
    
    log(`User identified: ${userId}`);
  } catch (error) {
    console.error('Error identifying user:', error);
  }
};

/**
 * Track error events
 * @param {string} source - Error source
 * @param {string} message - Error message
 * @param {Object} details - Error details
 */
export const trackError = (source, message, details = {}) => {
  if (!ANALYTICS_ENABLED) return;
  
  try {
    // Google Analytics
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: `${source}: ${message}`,
        fatal: details.fatal || false
      });
    }
    
    // Mixpanel
    if (window.mixpanel) {
      window.mixpanel.track('Error', {
        source,
        message,
        ...details
      });
    }
    
    // Send to backend
    sendToBackend('error', {
      source,
      message,
      ...details
    });
    
    log(`Error tracked: ${source} - ${message}`, details);
  } catch (error) {
    console.error('Error tracking error event:', error);
  }
};

// Helper functions

/**
 * Send analytics event to backend
 * @param {string} type - Event type
 * @param {Object} data - Event data
 */
const sendToBackend = async (type, data) => {
  // Skip if no endpoint or in testing mode
  if (!ANALYTICS_ENDPOINT || process.env.NODE_ENV === 'test') return;
  
  try {
    // Send event data to backend
    await fetch(ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type,
        data,
        timestamp: new Date().toISOString(),
        anonymousId,
        page: window.location.pathname,
        url: window.location.href
      }),
      // Use keepalive to ensure the request is sent even if the page is being unloaded
      keepalive: true
    });
  } catch (error) {
    // Silent fail for analytics
    if (ANALYTICS_DEBUG) {
      console.error('Failed to send analytics to backend:', error);
    }
  }
};

/**
 * Ensure analytics is initialized
 * @returns {boolean} Whether analytics is ready
 */
const ensureInitialized = () => {
  if (!ANALYTICS_ENABLED) return false;
  
  if (!analyticsInitialized) {
    initializeAnalytics();
  }
  
  return analyticsInitialized;
};

/**
 * Generate random ID for anonymous tracking
 * @returns {string} Random ID
 */
const generateRandomId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Log analytics events in debug mode
 * @param {string} message - Log message
 * @param {Object} data - Additional data
 */
const log = (message, data = {}) => {
  if (ANALYTICS_DEBUG) {
    console.log(`📊 Analytics: ${message}`, data);
  }
};

/**
 * Get session duration
 * @returns {number} Session duration in seconds
 */
export const getSessionDuration = () => {
  const sessionStart = localStorage.getItem('sessionStart');
  if (!sessionStart) {
    localStorage.setItem('sessionStart', Date.now().toString());
    return 0;
  }
  
  return Math.floor((Date.now() - parseInt(sessionStart)) / 1000);
};

/**
 * Track feature usage
 * @param {string} feature - Feature name
 * @param {Object} properties - Usage properties
 */
export const trackFeatureUsage = (feature, properties = {}) => {
  trackEvent(`feature_${feature}`, 'feature_usage', properties);
};

/**
 * Performance tracking utility
 * @param {string} metricName - Metric name
 * @returns {Function} Function to end timing and record
 */
export const startPerformanceTracking = (metricName) => {
  const startTime = performance.now();
  
  return () => {
    const duration = performance.now() - startTime;
    trackTiming('performance', metricName, Math.round(duration));
    return duration;
  };
};

export default {
  initializeAnalytics,
  trackPageView,
  trackEvent,
  trackPortfolioAction,
  trackRecommendationAction,
  trackTransaction,
  trackRebalance,
  trackUserAction,
  trackWalletAction,
  trackSocialAction,
  trackUIInteraction,
  trackTiming,
  trackError,
  trackFeatureUsage,
  startPerformanceTracking,
  identifyUser,
  getSessionDuration,
  EVENT_CATEGORIES
};