// src/services/socialService.js
import api from './api';

/**
 * Service for handling social media integration for CompounDefi
 */
class SocialService {
  /**
   * Connect a social media account
   * @param {string} platform - 'twitter', 'discord', or 'telegram'
   * @param {string} wallet - User's wallet address
   * @returns {Promise<Object>} Connection result
   */
  async connectAccount(platform, wallet) {
    try {
      // Validate inputs
      if (!platform || !wallet) {
        throw new Error('Platform and wallet address are required');
      }
      
      if (!['twitter', 'discord', 'telegram'].includes(platform)) {
        throw new Error('Invalid platform. Supported platforms: twitter, discord, telegram');
      }
      
      // Initialize connection window
      const authWindow = this.openAuthWindow(platform);
      
      // Track connection status
      const result = await this.trackAuthWindow(authWindow, platform, wallet);
      
      // Save connection status to local storage
      this.saveConnectionStatus(platform, result.connected, wallet);
      
      return result;
    } catch (error) {
      console.error(`Social media connection error (${platform}):`, error);
      return { 
        connected: false, 
        platform, 
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
  
  /**
   * Disconnect a social media account
   * @param {string} platform - 'twitter', 'discord', or 'telegram'
   * @param {string} wallet - User's wallet address
   * @returns {Promise<Object>} Disconnection result
   */
  async disconnectAccount(platform, wallet) {
    try {
      // Send disconnect request to the backend
      const response = await api.post('/api/social/disconnect', { platform, wallet });
      
      // Remove from local storage
      this.removeConnectionStatus(platform, wallet);
      
      return {
        disconnected: true,
        platform,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Social media disconnection error (${platform}):`, error);
      return { 
        disconnected: false, 
        platform,
        error: error.message,
        timestamp: new Date().toISOString() 
      };
    }
  }
  
  /**
   * Check if a social account is connected
   * @param {string} platform - 'twitter', 'discord', or 'telegram'
   * @param {string} wallet - User's wallet address
   * @returns {boolean} Connection status
   */
  isConnected(platform, wallet) {
    if (!platform || !wallet) return false;
    
    const key = `social_${platform}_${wallet}`;
    const status = localStorage.getItem(key);
    return status === 'true';
  }
  
  /**
   * Get all connected social accounts for a wallet
   * @param {string} wallet - User's wallet address
   * @returns {Object} Connected accounts
   */
  getConnectedAccounts(wallet) {
    if (!wallet) return {};
    
    return {
      twitter: this.isConnected('twitter', wallet),
      discord: this.isConnected('discord', wallet),
      telegram: this.isConnected('telegram', wallet)
    };
  }
  
  /**
   * Open authentication window for a platform
   * @param {string} platform - Social platform
   * @returns {Window} Auth window
   * @private
   */
  openAuthWindow(platform) {
    const width = 600;
    const height = 700;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;
    
    const url = `/api/social/auth/${platform}`;
    
    return window.open(
      url,
      `Connect ${platform}`,
      `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
    );
  }
  
  /**
   * Track authentication window and wait for completion
   * @param {Window} authWindow - Authentication window
   * @param {string} platform - Social platform
   * @param {string} wallet - User's wallet address
   * @returns {Promise<Object>} Connection result
   * @private
   */
  trackAuthWindow(authWindow, platform, wallet) {
    return new Promise((resolve) => {
      // Polling for closed window
      const checkClosed = setInterval(() => {
        if (authWindow.closed) {
          clearInterval(checkClosed);
          
          // Check connection status from the backend
          api.get(`/api/social/status/${platform}/${wallet}`)
            .then(response => {
              resolve({
                connected: response.data.connected,
                platform,
                userName: response.data.userName,
                avatar: response.data.avatar,
                timestamp: new Date().toISOString()
              });
            })
            .catch(error => {
              resolve({
                connected: false,
                platform,
                error: error.message,
                timestamp: new Date().toISOString()
              });
            });
        }
      }, 500);
      
      // Safety timeout after 5 minutes
      setTimeout(() => {
        if (!authWindow.closed) {
          authWindow.close();
          clearInterval(checkClosed);
          resolve({
            connected: false,
            platform,
            error: 'Authentication timeout',
            timestamp: new Date().toISOString()
          });
        }
      }, 5 * 60 * 1000);
    });
  }
  
  /**
   * Save connection status to local storage
   * @param {string} platform - Social platform
   * @param {boolean} connected - Connection status
   * @param {string} wallet - User's wallet address
   * @private
   */
  saveConnectionStatus(platform, connected, wallet) {
    if (!platform || !wallet) return;
    
    const key = `social_${platform}_${wallet}`;
    localStorage.setItem(key, connected.toString());
  }
  
  /**
   * Remove connection status from local storage
   * @param {string} platform - Social platform
   * @param {string} wallet - User's wallet address
   * @private
   */
  removeConnectionStatus(platform, wallet) {
    if (!platform || !wallet) return;
    
    const key = `social_${platform}_${wallet}`;
    localStorage.removeItem(key);
  }
  
  /**
   * Fetch user's social feed
   * @param {string} wallet - User's wallet address
   * @returns {Promise<Object>} Social feed data
   */
  async getSocialFeed(wallet) {
    try {
      const response = await api.get(`/api/social/feed/${wallet}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching social feed:', error);
      return {
        posts: [],
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
  
  /**
   * Get social connection stats
   * @returns {Promise<Object>} Social stats
   */
  async getSocialStats() {
    try {
      const response = await api.get('/api/social/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching social stats:', error);
      return {
        connectedUsers: 0,
        twitterUsers: 0,
        discordUsers: 0,
        telegramUsers: 0,
        error: error.message
      };
    }
  }
}

// Create and export instance
const socialService = new SocialService();
export default socialService;