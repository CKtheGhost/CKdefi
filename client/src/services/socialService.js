// client/src/services/socialService.js
// Service for handling social media integrations and interactions with social_integrations backend module

import api from './api';

/**
 * Service for social media connections and interactions
 */
const socialService = {
  /**
   * Get social media authentication URL
   * @param {string} platform - Social platform (twitter, discord, telegram)
   * @param {string} walletAddress - User's wallet address
   * @returns {Promise<Object>} Authentication URL and state
   */
  async getAuthUrl(platform, walletAddress) {
    try {
      const response = await api.post('/auth/social-connect/url', {
        platform,
        walletAddress
      });
      return response.data;
    } catch (error) {
      console.error(`Error getting ${platform} auth URL:`, error);
      throw error;
    }
  },

  /**
   * Get connected social accounts for a user
   * @param {string} walletAddress - User's wallet address
   * @returns {Promise<Object>} Connected accounts
   */
  async getConnectedAccounts(walletAddress) {
    try {
      const response = await api.get(`/user/social-connections?walletAddress=${walletAddress}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching connected social accounts:', error);
      return { connections: {} };
    }
  },

  /**
   * Disconnect a social platform from a user's account
   * @param {string} platform - Social platform to disconnect
   * @param {string} walletAddress - User's wallet address
   * @returns {Promise<Object>} Disconnection result
   */
  async disconnectSocialAccount(platform, walletAddress) {
    try {
      const response = await api.post('/user/social-disconnect', {
        platform,
        walletAddress
      });
      return response.data;
    } catch (error) {
      console.error(`Error disconnecting ${platform} account:`, error);
      throw error;
    }
  },

  /**
   * Share investment achievement on social media
   * @param {string} walletAddress - User's wallet address
   * @param {string} platform - Social platform (twitter, discord, telegram)
   * @param {Object} achievement - Achievement details to share
   * @returns {Promise<Object>} Sharing result
   */
  async shareAchievement(walletAddress, platform, achievement) {
    try {
      const response = await api.post('/user/social-share', {
        walletAddress,
        platform,
        achievement
      });
      return response.data;
    } catch (error) {
      console.error(`Error sharing to ${platform}:`, error);
      throw error;
    }
  },

  /**
   * Create achievement object for sharing
   * @param {string} type - Achievement type
   * @param {Object} data - Achievement data
   * @returns {Object} Formatted achievement for sharing
   */
  createAchievement(type, data) {
    const achievements = {
      strategy_execution: {
        title: 'Strategy Executed!',
        description: `I just executed a ${data.riskProfile || 'balanced'} strategy on CompounDefi with an expected APR of ${data.expectedApr || 0}%!`,
        action: 'executed',
        expectedApr: data.expectedApr || 0,
        strategy: data.title || 'AI-Optimized Strategy'
      },
      portfolio_milestone: {
        title: 'Portfolio Milestone Reached!',
        description: `My portfolio has ${data.change > 0 ? 'grown' : 'changed'} by ${Math.abs(data.change).toFixed(2)}% using CompounDefi AI optimization!`,
        action: data.change > 0 ? 'grown' : 'changed',
        percentage: Math.abs(data.change).toFixed(2),
        strategy: 'AI Portfolio Optimization'
      },
      auto_optimization: {
        title: 'Auto-Optimization Complete!',
        description: 'My CompounDefi auto-optimizer just rebalanced my portfolio for optimal yield!',
        action: 'rebalanced',
        expectedApr: data.newApr || 0,
        improvedBy: data.improvement || 0
      },
      recommendation: {
        title: 'New AI Strategy!',
        description: `Just received a new AI-powered investment strategy with a projected ${data.expectedApr || 0}% APR on CompounDefi!`,
        action: 'received',
        expectedApr: data.expectedApr || 0,
        strategy: data.title || 'AI-Optimized Strategy'
      }
    };

    return {
      type,
      ...achievements[type],
      timestamp: new Date().toISOString()
    };
  },

  /**
   * Handle social authentication callback
   * @param {string} platform - Social platform
   * @param {string} code - Authorization code
   * @param {string} state - State parameter
   * @returns {Promise<Object>} Authentication result
   */
  async handleAuthCallback(platform, code, state) {
    try {
      const response = await api.post('/auth/social-connect/callback', {
        platform,
        code,
        state
      });
      return response.data;
    } catch (error) {
      console.error(`Error processing ${platform} callback:`, error);
      throw error;
    }
  },

  /**
   * Generate referral code for a user
   * @param {string} walletAddress - User's wallet address
   * @returns {Promise<string>} Referral code
   */
  async generateReferralCode(walletAddress) {
    try {
      const response = await api.post('/user/referral-code', {
        walletAddress
      });
      return response.data.referralCode;
    } catch (error) {
      console.error('Error generating referral code:', error);
      throw error;
    }
  },

  /**
   * Get referral statistics
   * @param {string} walletAddress - User's wallet address
   * @returns {Promise<Object>} Referral statistics
   */
  async getReferralStats(walletAddress) {
    try {
      const response = await api.get(`/user/referral-stats?walletAddress=${walletAddress}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching referral stats:', error);
      return {
        referrals: 0,
        rewards: 0,
        referralCode: null
      };
    }
  },

  /**
   * Get recent community activity
   * @returns {Promise<Array>} Recent community activity
   */
  async getCommunityActivity() {
    try {
      const response = await api.get('/social/activity');
      return response.data.activities;
    } catch (error) {
      console.error('Error fetching community activity:', error);
      return [];
    }
  }
};

export default socialService;