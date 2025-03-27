/**
 * social_integrations.js - Social media integration for CompounDefi
 * 
 * Handles social media sharing, community features, and notifications
 * for performance milestones and strategy achievements.
 */

const axios = require('axios');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/user');
const cache = require('../middleware/caching');

// Default social platforms configuration
const PLATFORMS = {
  TWITTER: {
    enabled: process.env.TWITTER_ENABLED === 'true',
    apiKey: process.env.TWITTER_API_KEY,
    apiSecret: process.env.TWITTER_API_SECRET,
    redirectUri: process.env.TWITTER_REDIRECT_URI || 'https://compoundefi.io/auth/twitter/callback',
    baseUrl: 'https://api.twitter.com/2'
  },
  DISCORD: {
    enabled: process.env.DISCORD_ENABLED === 'true',
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    botToken: process.env.DISCORD_BOT_TOKEN,
    redirectUri: process.env.DISCORD_REDIRECT_URI || 'https://compoundefi.io/auth/discord/callback',
    serverChannels: {
      announcements: process.env.DISCORD_CHANNEL_ANNOUNCEMENTS,
      general: process.env.DISCORD_CHANNEL_GENERAL,
      strategies: process.env.DISCORD_CHANNEL_STRATEGIES
    }
  },
  TELEGRAM: {
    enabled: process.env.TELEGRAM_ENABLED === 'true',
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    channelId: process.env.TELEGRAM_CHANNEL_ID
  }
};

// Cache TTL settings
const CACHE_TTL = {
  AUTH_STATE: 15 * 60, // 15 minutes
  USER_CONNECTIONS: 30 * 60, // 30 minutes
  SHARE_COUNTER: 24 * 60 * 60 // 24 hours
};

/**
 * Get authentication URL for a social platform
 * @param {string} platform - Social platform (twitter, discord, telegram)
 * @param {string} walletAddress - User wallet address
 * @returns {Promise<Object>} Authentication URL and state
 */
async function getAuthUrl(platform, walletAddress) {
  if (!walletAddress) {
    throw new Error('Wallet address is required');
  }
  
  const state = crypto.randomBytes(16).toString('hex');
  await cache.set(`auth:state:${state}`, { 
    walletAddress, 
    platform,
    timestamp: Date.now()
  }, CACHE_TTL.AUTH_STATE);
  
  let authUrl;
  switch (platform.toLowerCase()) {
    case 'twitter':
      if (!PLATFORMS.TWITTER.enabled) throw new Error('Twitter integration is not enabled');
      const twitterScope = 'tweet.read tweet.write users.read offline.access';
      const twitterUrl = new URL('https://twitter.com/i/oauth2/authorize');
      twitterUrl.searchParams.append('response_type', 'code');
      twitterUrl.searchParams.append('client_id', PLATFORMS.TWITTER.apiKey);
      twitterUrl.searchParams.append('redirect_uri', PLATFORMS.TWITTER.redirectUri);
      twitterUrl.searchParams.append('scope', twitterScope);
      twitterUrl.searchParams.append('state', state);
      twitterUrl.searchParams.append('code_challenge', 'challenge');
      twitterUrl.searchParams.append('code_challenge_method', 'plain');
      authUrl = twitterUrl.toString();
      break;
    case 'discord':
      if (!PLATFORMS.DISCORD.enabled) throw new Error('Discord integration is not enabled');
      const discordScope = 'identify email connections guilds.join';
      const discordUrl = new URL('https://discord.com/api/oauth2/authorize');
      discordUrl.searchParams.append('response_type', 'code');
      discordUrl.searchParams.append('client_id', PLATFORMS.DISCORD.clientId);
      discordUrl.searchParams.append('redirect_uri', PLATFORMS.DISCORD.redirectUri);
      discordUrl.searchParams.append('scope', discordScope);
      discordUrl.searchParams.append('state', state);
      authUrl = discordUrl.toString();
      break;
    case 'telegram':
      if (!PLATFORMS.TELEGRAM.enabled) throw new Error('Telegram integration is not enabled');
      authUrl = `https://oauth.telegram.org/auth?bot_id=${PLATFORMS.TELEGRAM.botToken.split(':')[0]}&origin=https://compoundefi.io&return_to=/auth/telegram/callback&state=${state}`;
      break;
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
  
  return { authUrl, state, platform, walletAddress };
}

/**
 * Handle OAuth callback and connect social account to wallet
 * @param {string} platform - Social platform
 * @param {string} code - Authorization code
 * @param {string} state - State parameter for verification
 * @returns {Promise<Object>} Connection result
 */
async function handleAuthCallback(platform, code, state) {
  const cachedState = await cache.get(`auth:state:${state}`);
  if (!cachedState) throw new Error('Invalid or expired authentication state');
  const { walletAddress } = cachedState;
  await cache.del(`auth:state:${state}`);
  
  let userData, accessToken, refreshToken, platformUserId, platformUsername;
  
  switch (platform.toLowerCase()) {
    case 'twitter':
      const twitterTokenResponse = await axios.post(
        'https://api.twitter.com/2/oauth2/token',
        new URLSearchParams({
          code,
          grant_type: 'authorization_code',
          client_id: PLATFORMS.TWITTER.apiKey,
          redirect_uri: PLATFORMS.TWITTER.redirectUri,
          code_verifier: 'challenge'
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          auth: { username: PLATFORMS.TWITTER.apiKey, password: PLATFORMS.TWITTER.apiSecret }
        }
      );
      accessToken = twitterTokenResponse.data.access_token;
      refreshToken = twitterTokenResponse.data.refresh_token;
      const twitterUserResponse = await axios.get(
        `${PLATFORMS.TWITTER.baseUrl}/users/me`,
        {
          headers: { 'Authorization': `Bearer ${accessToken}` },
          params: { 'user.fields': 'id,name,username,profile_image_url' }
        }
      );
      userData = twitterUserResponse.data.data;
      platformUserId = userData.id;
      platformUsername = userData.username;
      break;
    case 'discord':
      const discordTokenResponse = await axios.post(
        'https://discord.com/api/oauth2/token',
        new URLSearchParams({
          code,
          grant_type: 'authorization_code',
          client_id: PLATFORMS.DISCORD.clientId,
          client_secret: PLATFORMS.DISCORD.clientSecret,
          redirect_uri: PLATFORMS.DISCORD.redirectUri
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      accessToken = discordTokenResponse.data.access_token;
      refreshToken = discordTokenResponse.data.refresh_token;
      const discordUserResponse = await axios.get(
        'https://discord.com/api/users/@me',
        { headers: { 'Authorization': `Bearer ${accessToken}` } }
      );
      userData = discordUserResponse.data;
      platformUserId = userData.id;
      platformUsername = userData.username;
      break;
    case 'telegram':
      if (!code || typeof code !== 'object') throw new Error('Invalid Telegram authentication data');
      const telegramData = { ...code };
      const hash = telegramData.hash;
      delete telegramData.hash;
      const dataCheckString = Object.keys(telegramData).sort().map(key => `${key}=${telegramData[key]}`).join('\n');
      const secretKey = crypto.createHash('sha256').update(PLATFORMS.TELEGRAM.botToken).digest();
      const computedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
      if (computedHash !== hash) throw new Error('Invalid Telegram authentication data');
      userData = telegramData;
      platformUserId = telegramData.id.toString();
      platformUsername = telegramData.username;
      accessToken = null;
      refreshToken = null;
      break;
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
  
  const user = await User.findOne({ walletAddress });
  if (!user) throw new Error('User not found');
  if (!user.socialConnections) user.socialConnections = {};
  
  user.socialConnections[platform.toLowerCase()] = {
    connected: true,
    platformUserId,
    username: platformUsername,
    connectedAt: new Date(),
    lastTokenRefresh: new Date(),
    metadata: {
      profileImage: userData.profile_image_url || userData.avatar || telegramData?.photo_url,
      displayName: userData.name || userData.global_name || telegramData?.first_name,
      email: userData.email
    },
    tokens: {
      access: accessToken,
      refresh: refreshToken,
      expiresAt: accessToken ? new Date(Date.now() + 7200000) : null
    }
  };
  await user.save();
  await cache.del(`user:connections:${walletAddress}`);
  
  return { success: true, platform, username: platformUsername, platformUserId };
}

/**
 * Share an investment achievement or recommendation to social media
 * @param {string} walletAddress - User wallet address
 * @param {string} platform - Social platform to share to
 * @param {Object} achievement - Achievement or recommendation to share
 * @returns {Promise<Object>} Sharing result
 */
async function shareAchievement(walletAddress, platform, achievement) {
  if (!walletAddress || !platform || !achievement) throw new Error('Missing required parameters');
  const user = await User.findOne({ walletAddress });
  if (!user || !user.socialConnections || !user.socialConnections[platform.toLowerCase()]) {
    throw new Error(`User not connected to ${platform}`);
  }
  
  let connection = user.socialConnections[platform.toLowerCase()];
  if (connection.tokens?.access && connection.tokens?.expiresAt && new Date(connection.tokens.expiresAt) < new Date()) {
    await refreshSocialToken(walletAddress, platform);
    const updatedUser = await User.findOne({ walletAddress });
    connection = updatedUser.socialConnections[platform.toLowerCase()];
  }
  
  const content = prepareShareContent(platform, achievement, user);
  let shareResult;
  
  switch (platform.toLowerCase()) {
    case 'twitter':
      shareResult = await axios.post(
        `${PLATFORMS.TWITTER.baseUrl}/tweets`,
        { text: content.text },
        { headers: { 'Authorization': `Bearer ${connection.tokens.access}`, 'Content-Type': 'application/json' } }
      );
      return {
        success: true,
        platform,
        postId: shareResult.data.data.id,
        url: `https://twitter.com/${connection.username}/status/${shareResult.data.data.id}`
      };
    case 'discord':
      const channelId = PLATFORMS.DISCORD.serverChannels.strategies;
      if (!channelId) throw new Error('Discord channel not configured');
      shareResult = await axios.post(
        `https://discord.com/api/channels/${channelId}/messages`,
        content.discord,
        { headers: { 'Authorization': `Bot ${PLATFORMS.DISCORD.botToken}`, 'Content-Type': 'application/json' } }
      );
      return { success: true, platform, messageId: shareResult.data.id, channelId };
    case 'telegram':
      const chatId = PLATFORMS.TELEGRAM.channelId || connection.platformUserId;
      shareResult = await axios.post(
        `https://api.telegram.org/bot${PLATFORMS.TELEGRAM.botToken}/sendMessage`,
        { chat_id: chatId, text: content.text, parse_mode: 'HTML' }
      );
      return { success: true, platform, messageId: shareResult.data.result.message_id, chatId };
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}

/**
 * Prepare content for sharing based on platform and achievement type
 * @param {string} platform - Social platform
 * @param {Object} achievement - Achievement or recommendation data
 * @param {Object} user - User data
 * @returns {Object} Formatted content for the platform
 */
function prepareShareContent(platform, achievement, user) {
  const appUrl = process.env.APP_URL || 'https://compoundefi.io';
  const truncatedWallet = user.walletAddress.substring(0, 6) + '...' + user.walletAddress.substring(user.walletAddress.length - 4);
  
  let shareText = '';
  switch (achievement.type) {
    case 'strategy_execution':
      shareText = `🚀 I just executed a new AI-powered investment strategy on CompounDefi with an expected APR of ${achievement.expectedApr}%!`;
      break;
    case 'portfolio_milestone':
      shareText = `🎯 Just hit a portfolio milestone on CompounDefi! My portfolio has ${achievement.action} by ${achievement.percentage}%.`;
      break;
    case 'auto_optimization':
      shareText = `⚡ My CompounDefi auto-optimizer just rebalanced my portfolio for optimal yield. Set it and forget it!`;
      break;
    case 'recommendation':
    default:
      shareText = `💡 Got a new AI-powered investment recommendation on CompounDefi with a projected ${achievement.expectedApr || '10'}% APR!`;
  }
  
  const hashtags = '#CompounDefi #Aptos #DeFi #YieldFarming #CryptoYield';
  const referralLink = `${appUrl}/join?ref=${user.referralCode || truncatedWallet}`;
  
  switch (platform.toLowerCase()) {
    case 'twitter':
      return { text: `${shareText}\n\n${hashtags}\n\nJoin me: ${referralLink}` };
    case 'discord':
      return {
        discord: {
          content: shareText,
          embeds: [{
            title: achievement.title || 'CompounDefi Achievement',
            description: achievement.description || `Check out my latest achievement on CompounDefi!`,
            color: 0x3b82f6,
            thumbnail: { url: 'https://compoundefi.io/assets/logo.png' },
            fields: [
              { name: 'Expected APR', value: `${achievement.expectedApr || 'Optimized'}%`, inline: true },
              { name: 'Strategy Type', value: achievement.strategy || 'AI-Optimized', inline: true }
            ],
            footer: { text: `Join CompounDefi: ${referralLink}` }
          }]
        }
      };
    case 'telegram':
      return { text: `<b>${achievement.title || 'CompounDefi Achievement'}</b>\n\n${shareText}\n\n${hashtags}\n\nJoin me: ${referralLink}` };
    default:
      return { text: shareText };
  }
}

/**
 * Refresh access token for a social platform
 * @param {string} walletAddress - User wallet address
 * @param {string} platform - Social platform
 * @returns {Promise<Object>} Result with new tokens
 */
async function refreshSocialToken(walletAddress, platform) {
  const user = await User.findOne({ walletAddress });
  if (!user || !user.socialConnections || !user.socialConnections[platform.toLowerCase()]) {
    throw new Error(`User not connected to ${platform}`);
  }
  
  const connection = user.socialConnections[platform.toLowerCase()];
  if (!connection.tokens?.refresh) throw new Error(`No refresh token available for ${platform}`);
  
  let response, newAccessToken, newRefreshToken, expiresIn;
  switch (platform.toLowerCase()) {
    case 'twitter':
      response = await axios.post(
        'https://api.twitter.com/2/oauth2/token',
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: connection.tokens.refresh,
          client_id: PLATFORMS.TWITTER.apiKey
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          auth: { username: PLATFORMS.TWITTER.apiKey, password: PLATFORMS.TWITTER.apiSecret }
        }
      );
      newAccessToken = response.data.access_token;
      newRefreshToken = response.data.refresh_token;
      expiresIn = response.data.expires_in || 7200;
      break;
    case 'discord':
      response = await axios.post(
        'https://discord.com/api/oauth2/token',
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: connection.tokens.refresh,
          client_id: PLATFORMS.DISCORD.clientId,
          client_secret: PLATFORMS.DISCORD.clientSecret
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      newAccessToken = response.data.access_token;
      newRefreshToken = response.data.refresh_token;
      expiresIn = response.data.expires_in || 604800;
      break;
    case 'telegram':
      throw new Error('Token refresh not applicable for Telegram');
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
  
  connection.tokens.access = newAccessToken;
  connection.tokens.refresh = newRefreshToken || connection.tokens.refresh;
  connection.tokens.expiresAt = new Date(Date.now() + expiresIn * 1000);
  connection.lastTokenRefresh = new Date();
  await user.save();
  await cache.del(`user:connections:${walletAddress}`);
  
  return { success: true, platform, expiresAt: connection.tokens.expiresAt };
}

/**
 * Get all social connections for a user
 * @param {string} walletAddress - User wallet address
 * @returns {Promise<Object>} User's social connections
 */
async function getUserConnections(walletAddress) {
  const cachedConnections = await cache.get(`user:connections:${walletAddress}`);
  if (cachedConnections) return cachedConnections;
  
  const user = await User.findOne({ walletAddress });
  if (!user) throw new Error('User not found');
  
  const connections = {};
  if (user.socialConnections) {
    for (const [platform, connection] of Object.entries(user.socialConnections)) {
      connections[platform] = {
        connected: connection.connected,
        username: connection.username,
        platformUserId: connection.platformUserId,
        connectedAt: connection.connectedAt,
        metadata: {
          profileImage: connection.metadata?.profileImage,
          displayName: connection.metadata?.displayName
        }
      };
    }
  }
  
  await cache.set(`user:connections:${walletAddress}`, connections, CACHE_TTL.USER_CONNECTIONS);
  return connections;
}

/**
 * Disconnect a social platform from a user
 * @param {string} walletAddress - User wallet address
 * @param {string} platform - Social platform to disconnect
 * @returns {Promise<Object>} Disconnection result
 */
async function disconnectSocial(walletAddress, platform) {
  const user = await User.findOne({ walletAddress });
  if (!user) throw new Error('User not found');
  if (!user.socialConnections || !user.socialConnections[platform.toLowerCase()]) {
    throw new Error(`User not connected to ${platform}`);
  }
  
  const connection = user.socialConnections[platform.toLowerCase()];
  if (connection.tokens?.access) {
    try {
      switch (platform.toLowerCase()) {
        case 'twitter':
          await axios.post(
            'https://api.twitter.com/2/oauth2/revoke',
            new URLSearchParams({
              token: connection.tokens.access,
              token_type_hint: 'access_token',
              client_id: PLATFORMS.TWITTER.apiKey
            }),
            {
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              auth: { username: PLATFORMS.TWITTER.apiKey, password: PLATFORMS.TWITTER.apiSecret }
            }
          );
          break;
        case 'discord':
          await axios.post(
            'https://discord.com/api/oauth2/token/revoke',
            new URLSearchParams({
              token: connection.tokens.access,
              token_type_hint: 'access_token',
              client_id: PLATFORMS.DISCORD.clientId,
              client_secret: PLATFORMS.DISCORD.clientSecret
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
          );
          break;
      }
    } catch (error) {
      console.error(`Error revoking ${platform} token:`, error);
    }
  }
  
  delete user.socialConnections[platform.toLowerCase()];
  await user.save();
  await cache.del(`user:connections:${walletAddress}`);
  
  return { success: true, platform, message: `Disconnected from ${platform}` };
}

/**
 * Post a notification to community channels
 * @param {string} type - Notification type (announcement, strategy, update)
 * @param {Object} content - Notification content
 * @returns {Promise<Object>} Notification result
 */
async function sendCommunityNotification(type, content) {
  if (!type || !content) throw new Error('Type and content are required');
  
  let channelId;
  switch (type.toLowerCase()) {
    case 'announcement': channelId = PLATFORMS.DISCORD.serverChannels.announcements; break;
    case 'strategy': channelId = PLATFORMS.DISCORD.serverChannels.strategies; break;
    case 'update':
    case 'general':
    default: channelId = PLATFORMS.DISCORD.serverChannels.general;
  }
  
  const notificationContent = formatCommunityNotification(type, content);
  
  if (PLATFORMS.DISCORD.enabled && channelId) {
    try {
      await axios.post(
        `https://discord.com/api/channels/${channelId}/messages`,
        notificationContent.discord,
        { headers: { 'Authorization': `Bot ${PLATFORMS.DISCORD.botToken}`, 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error('Error sending Discord notification:', error);
    }
  }
  
  if (PLATFORMS.TELEGRAM.enabled && PLATFORMS.TELEGRAM.channelId) {
    try {
      await axios.post(
        `https://api.telegram.org/bot${PLATFORMS.TELEGRAM.botToken}/sendMessage`,
        { chat_id: PLATFORMS.TELEGRAM.channelId, text: notificationContent.text, parse_mode: 'HTML' }
      );
    } catch (error) {
      console.error('Error sending Telegram notification:', error);
    }
  }
  
  await incrementShareCounter(type);
  return { success: true, type, sentTo: { discord: PLATFORMS.DISCORD.enabled, telegram: PLATFORMS.TELEGRAM.enabled } };
}

/**
 * Format notification content for community channels
 * @param {string} type - Notification type
 * @param {Object} content - Notification data
 * @returns {Object} Formatted content for each platform
 */
function formatCommunityNotification(type, content) {
  const appUrl = process.env.APP_URL || 'https://compoundefi.io';
  let title, text, color;
  
  switch (type.toLowerCase()) {
    case 'announcement':
      title = '📢 ' + (content.title || 'Important Announcement');
      text = content.message || 'No message provided';
      color = 0xff0000;
      break;
    case 'strategy':
      title = '🚀 ' + (content.title || 'New Strategy Available');
      text = `A new strategy with ${content.apr || 'optimized'}% APR is now available! ${content.description || ''}`;
      color = 0x00ff00;
      break;
    case 'update':
      title = '🔄 ' + (content.title || 'Platform Update');
      text = `CompounDefi has been updated! ${content.version ? `Version ${content.version}` : ''} ${content.description || ''}`;
      color = 0x0000ff;
      break;
    default:
      title = content.title || 'CompounDefi Notification';
      text = content.message || 'New notification from CompounDefi';
      color = 0x3b82f6;
  }
  
  return {
    text: `<b>${title}</b>\n\n${text}\n\n<a href="${appUrl}">Visit CompounDefi</a>`,
    discord: {
      content: content.shortText || `New ${type} from CompounDefi`,
      embeds: [{
        title: title,
        description: text,
        color: color,
        thumbnail: { url: 'https://compoundefi.io/assets/logo.png' },
        fields: content.fields || [],
        url: content.url || appUrl,
        footer: { text: content.footer || 'CompounDefi - AI-Powered Yield Optimization' },
        timestamp: new Date().toISOString()
      }]
    }
  };
}

/**
 * Increment share counter for metrics tracking
 * @param {string} type - Counter type
 * @returns {Promise<number>} New counter value
 */
async function incrementShareCounter(type) {
  const counterKey = `metrics:shares:${type.toLowerCase()}`;
  const currentValue = await cache.get(counterKey) || 0;
  const newValue = parseInt(currentValue) + 1;
  await cache.set(counterKey, newValue, CACHE_TTL.SHARE_COUNTER);
  return newValue;
}

/**
 * Generate referral code for a user
 * @param {string} walletAddress - User wallet address
 * @returns {Promise<string>} Generated referral code
 */
async function generateReferralCode(walletAddress) {
  if (!walletAddress) {
    throw new Error('Wallet address is required');
  }
  
  const user = await User.findOne({ walletAddress });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Return existing referral code if it exists
  if (user.referralCode) {
    return user.referralCode;
  }
  
  // Generate a new referral code (first 8 characters of a UUID)
  const referralCode = uuidv4().slice(0, 8);
  user.referralCode = referralCode;
  await user.save();
  
  return referralCode;
}

// Export all functions
module.exports = {
  getAuthUrl,
  handleAuthCallback,
  shareAchievement,
  prepareShareContent,
  refreshSocialToken,
  getUserConnections,
  disconnectSocial,
  sendCommunityNotification,
  formatCommunityNotification,
  incrementShareCounter,
  generateReferralCode
};