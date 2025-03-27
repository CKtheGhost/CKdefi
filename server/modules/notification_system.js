/**
 * notification_system.js - Advanced notification system for CompounDefi
 * Provides real-time alerts, transaction updates, and portfolio performance notifications
 */

const axios = require('axios');
const { EventEmitter } = require('events');
const cacheManager = require('../middleware/caching');
const logger = require('../middleware/logging');
const { getUserPreferences } = require('./user_profile');

// Notification event emitter
const notificationEvents = new EventEmitter();

// Notification categories
const NOTIFICATION_TYPES = {
  TRANSACTION: 'transaction', // Transaction updates
  PORTFOLIO: 'portfolio',     // Portfolio changes
  PRICE_ALERT: 'price_alert', // Price movements
  SECURITY: 'security',       // Security alerts
  SYSTEM: 'system',           // System notifications
  RECOMMENDATION: 'recommendation', // AI recommendations
  REBALANCE: 'rebalance',     // Auto-rebalance notifications
  REWARDS: 'rewards',         // Staking/yield rewards
  SOCIAL: 'social'            // Social/community updates
};

// Priority levels for notifications
const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

// Notification channels
const CHANNELS = {
  APP: 'app',
  EMAIL: 'email',
  PUSH: 'push',
  DISCORD: 'discord',
  TELEGRAM: 'telegram'
};

// In-memory store for recent notifications
let notificationStore = {
  recent: [],
  unread: {},
  stats: {
    totalSent: 0,
    byType: {},
    byPriority: {}
  }
};

// Maximum number of notifications to store per user
const MAX_NOTIFICATIONS_PER_USER = 50;

/**
 * Create and send a notification
 * @param {Object} notification - Notification object
 * @param {string} notification.userId - User ID (optional for system-wide)
 * @param {string} notification.type - Notification type from NOTIFICATION_TYPES
 * @param {string} notification.title - Notification title
 * @param {string} notification.message - Notification message
 * @param {string} notification.priority - Priority level from PRIORITY
 * @param {Array} notification.channels - Array of channels from CHANNELS
 * @param {Object} notification.data - Additional data for the notification
 * @returns {Promise<Object>} Created notification
 */
async function createNotification(notification) {
  try {
    // Validate required fields
    if (!notification.type || !notification.message) {
      throw new Error('Notification type and message are required');
    }

    // Set defaults for optional fields
    const fullNotification = {
      id: generateNotificationId(),
      timestamp: new Date().toISOString(),
      read: false,
      priority: PRIORITY.MEDIUM,
      channels: [CHANNELS.APP],
      ...notification
    };

    // Log notification creation
    logger.info(`Creating ${fullNotification.priority} priority notification: ${fullNotification.type}`, {
      notificationId: fullNotification.id,
      userId: fullNotification.userId || 'system'
    });

    // Store notification
    await storeNotification(fullNotification);

    // Send through appropriate channels
    await sendThroughChannels(fullNotification);

    // Emit event for real-time updates
    notificationEvents.emit('new-notification', fullNotification);

    // Update statistics
    updateStats(fullNotification);

    return fullNotification;
  } catch (error) {
    logger.error('Failed to create notification', error);
    throw error;
  }
}

/**
 * Store notification in database and in-memory cache
 * @param {Object} notification - Notification object
 */
async function storeNotification(notification) {
  // Add to in-memory store for recent notifications
  notificationStore.recent.unshift(notification);
  notificationStore.recent = notificationStore.recent.slice(0, 100); // Keep last 100 system-wide

  // Track unread notifications per user
  if (notification.userId) {
    if (!notificationStore.unread[notification.userId]) {
      notificationStore.unread[notification.userId] = [];
    }
    notificationStore.unread[notification.userId].unshift(notification);
    
    // Limit per-user notifications
    if (notificationStore.unread[notification.userId].length > MAX_NOTIFICATIONS_PER_USER) {
      notificationStore.unread[notification.userId] = 
        notificationStore.unread[notification.userId].slice(0, MAX_NOTIFICATIONS_PER_USER);
    }
  }

  // For persistent storage, we would save to database here
  // This is simplified for the current implementation
  try {
    // Save to database if userId is provided
    if (notification.userId && process.env.ENABLE_DB_NOTIFICATIONS === 'true') {
      // Database implementation would go here
      logger.debug(`Notification ${notification.id} stored in database for user ${notification.userId}`);
    }
  } catch (dbError) {
    logger.error('Error storing notification in database', dbError);
    // Continue execution since we have in-memory storage as fallback
  }
}

/**
 * Send notification through configured channels
 * @param {Object} notification - Notification object
 */
async function sendThroughChannels(notification) {
  try {
    const channelPromises = notification.channels.map(channel => {
      switch (channel) {
        case CHANNELS.APP:
          // No additional action needed for in-app, already stored
          return Promise.resolve();
        case CHANNELS.EMAIL:
          return sendEmailNotification(notification);
        case CHANNELS.PUSH:
          return sendPushNotification(notification);
        case CHANNELS.DISCORD:
          return sendDiscordNotification(notification);
        case CHANNELS.TELEGRAM:
          return sendTelegramNotification(notification);
        default:
          logger.warn(`Unknown notification channel: ${channel}`);
          return Promise.resolve();
      }
    });

    await Promise.allSettled(channelPromises);
    logger.debug(`Notification ${notification.id} sent through channels: ${notification.channels.join(', ')}`);
  } catch (error) {
    logger.error('Error sending notification through channels', error);
  }
}

/**
 * Send email notification
 * @param {Object} notification - Notification object
 */
async function sendEmailNotification(notification) {
  if (!notification.userId) {
    logger.warn('Cannot send email notification without userId');
    return;
  }

  try {
    // Get user email from preferences
    const userPreferences = await getUserPreferences(notification.userId);
    if (!userPreferences?.email || !userPreferences.emailNotificationsEnabled) {
      logger.debug(`Email notifications disabled for user ${notification.userId}`);
      return;
    }

    // In a production environment, this would send an actual email
    // For now, we'll just log it
    logger.info(`[EMAIL] To: ${userPreferences.email}, Subject: ${notification.title || 'CompounDefi Notification'}, Message: ${notification.message}`);

    // Email service implementation would go here
    // e.g. await emailService.send({ to: userPreferences.email, subject: notification.title, ... })
  } catch (error) {
    logger.error('Failed to send email notification', error);
  }
}

/**
 * Send push notification
 * @param {Object} notification - Notification object
 */
async function sendPushNotification(notification) {
  if (!notification.userId) {
    logger.warn('Cannot send push notification without userId');
    return;
  }

  try {
    // Get user push tokens from preferences
    const userPreferences = await getUserPreferences(notification.userId);
    if (!userPreferences?.pushToken || !userPreferences.pushNotificationsEnabled) {
      logger.debug(`Push notifications disabled for user ${notification.userId}`);
      return;
    }

    // Simple placeholder for actual push notification service
    logger.info(`[PUSH] To: ${notification.userId}, Title: ${notification.title || 'CompounDefi'}, Message: ${notification.message}`);

    // Push notification service would go here
    // e.g. await pushService.send({ token: userPreferences.pushToken, title: notification.title, ... })
  } catch (error) {
    logger.error('Failed to send push notification', error);
  }
}

/**
 * Send Discord notification
 * @param {Object} notification - Notification object 
 */
async function sendDiscordNotification(notification) {
  try {
    // Check if Discord webhook is configured
    if (!process.env.DISCORD_WEBHOOK_URL) {
      logger.debug('Discord webhook URL not configured');
      return;
    }

    // Get user Discord settings from preferences if user-specific
    let webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (notification.userId) {
      const userPreferences = await getUserPreferences(notification.userId);
      if (!userPreferences?.discordWebhook || !userPreferences.discordNotificationsEnabled) {
        logger.debug(`Discord notifications disabled for user ${notification.userId}`);
        return;
      }
      webhookUrl = userPreferences.discordWebhook;
    }

    // Prepare Discord message
    const color = getColorForPriority(notification.priority);
    const message = {
      embeds: [{
        title: notification.title || 'CompounDefi Notification',
        description: notification.message,
        color: color,
        timestamp: notification.timestamp,
        footer: {
          text: `CompounDefi • ${notification.type}`
        },
        fields: []
      }]
    };

    // Add additional data as fields if present
    if (notification.data) {
      for (const [key, value] of Object.entries(notification.data)) {
        if (typeof value !== 'object') {
          message.embeds[0].fields.push({
            name: key,
            value: String(value),
            inline: true
          });
        }
      }
    }

    // Log the Discord notification
    logger.info(`[DISCORD] Sending notification to webhook: Type: ${notification.type}, Message: ${notification.message}`);

    // Send to Discord
    // In production, uncomment the below code
    /*
    await axios.post(webhookUrl, message, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    */
  } catch (error) {
    logger.error('Failed to send Discord notification', error);
  }
}

/**
 * Send Telegram notification
 * @param {Object} notification - Notification object
 */
async function sendTelegramNotification(notification) {
  try {
    // Check if Telegram API token is configured
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      logger.debug('Telegram bot token not configured');
      return;
    }

    // Get user Telegram settings from preferences if user-specific
    let chatId;
    if (notification.userId) {
      const userPreferences = await getUserPreferences(notification.userId);
      if (!userPreferences?.telegramChatId || !userPreferences.telegramNotificationsEnabled) {
        logger.debug(`Telegram notifications disabled for user ${notification.userId}`);
        return;
      }
      chatId = userPreferences.telegramChatId;
    } else {
      chatId = process.env.TELEGRAM_CHAT_ID;
    }

    if (!chatId) {
      logger.debug('No Telegram chat ID available');
      return;
    }

    // Prepare Telegram message
    const message = `*${notification.title || 'CompounDefi Notification'}*\n\n${notification.message}`;

    // Log the Telegram notification
    logger.info(`[TELEGRAM] Sending notification to chat ${chatId}: Type: ${notification.type}, Message: ${notification.message}`);

    // Send to Telegram
    // In production, uncomment the below code
    /*
    await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown'
    });
    */
  } catch (error) {
    logger.error('Failed to send Telegram notification', error);
  }
}

/**
 * Get notifications for a user
 * @param {string} userId - User ID
 * @param {Object} options - Filter options
 * @param {number} options.limit - Maximum number of notifications to return
 * @param {boolean} options.unreadOnly - Get only unread notifications
 * @param {Array} options.types - Filter by notification types
 * @returns {Array} List of notifications
 */
async function getUserNotifications(userId, options = {}) {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Set defaults
    const limit = options.limit || 20;
    const unreadOnly = options.unreadOnly || false;
    const types = options.types || Object.values(NOTIFICATION_TYPES);

    // Get from in-memory store
    let notifications = notificationStore.unread[userId] || [];

    // Apply filters
    notifications = notifications.filter(notification => {
      const typeMatch = types.includes(notification.type);
      const readMatch = unreadOnly ? !notification.read : true;
      return typeMatch && readMatch;
    });

    // Apply limit
    notifications = notifications.slice(0, limit);

    // For persistent storage, we would query the database here
    // This is simplified for the current implementation

    return notifications;
  } catch (error) {
    logger.error('Failed to get user notifications', error);
    throw error;
  }
}

/**
 * Mark notifications as read
 * @param {string} userId - User ID
 * @param {Array} notificationIds - Array of notification IDs to mark as read
 * @returns {number} Number of notifications marked as read
 */
async function markNotificationsAsRead(userId, notificationIds) {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    if (!notificationStore.unread[userId]) {
      return 0;
    }

    let count = 0;
    
    // If no specific IDs, mark all as read
    if (!notificationIds || notificationIds.length === 0) {
      count = notificationStore.unread[userId].filter(n => !n.read).length;
      notificationStore.unread[userId].forEach(n => { n.read = true; });
    } else {
      // Mark specific notifications as read
      notificationStore.unread[userId].forEach(n => {
        if (notificationIds.includes(n.id) && !n.read) {
          n.read = true;
          count++;
        }
      });
    }

    // Also update in recent notifications
    if (count > 0) {
      notificationStore.recent.forEach(n => {
        if (n.userId === userId && (!notificationIds || notificationIds.length === 0 || notificationIds.includes(n.id))) {
          n.read = true;
        }
      });
    }

    // For persistent storage, we would update the database here
    // This is simplified for the current implementation

    return count;
  } catch (error) {
    logger.error('Failed to mark notifications as read', error);
    throw error;
  }
}

/**
 * Get notification statistics
 * @returns {Object} Notification statistics
 */
function getNotificationStats() {
  return { ...notificationStore.stats };
}

/**
 * Update notification statistics
 * @param {Object} notification - Notification object
 */
function updateStats(notification) {
  // Update total count
  notificationStore.stats.totalSent++;

  // Update by type
  if (!notificationStore.stats.byType[notification.type]) {
    notificationStore.stats.byType[notification.type] = 0;
  }
  notificationStore.stats.byType[notification.type]++;

  // Update by priority
  if (!notificationStore.stats.byPriority[notification.priority]) {
    notificationStore.stats.byPriority[notification.priority] = 0;
  }
  notificationStore.stats.byPriority[notification.priority]++;
}

/**
 * Generate unique notification ID
 * @returns {string} Unique ID
 */
function generateNotificationId() {
  return `n-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Get color code for notification priority
 * @param {string} priority - Priority level
 * @returns {number} Discord color code
 */
function getColorForPriority(priority) {
  switch (priority) {
    case PRIORITY.LOW:
      return 0x3498db; // Blue
    case PRIORITY.MEDIUM:
      return 0x2ecc71; // Green
    case PRIORITY.HIGH:
      return 0xf39c12; // Orange
    case PRIORITY.URGENT:
      return 0xe74c3c; // Red
    default:
      return 0x95a5a6; // Grey
  }
}

/**
 * Create a transaction notification
 * @param {Object} params - Transaction parameters
 * @returns {Promise<Object>} Created notification
 */
async function createTransactionNotification(params) {
  const { userId, txHash, status, operation, protocol, amount } = params;
  
  let title, message, priority;
  
  switch (status) {
    case 'pending':
      title = 'Transaction Submitted';
      message = `Your ${operation} of ${amount} APT on ${protocol} has been submitted. Transaction hash: ${txHash}`;
      priority = PRIORITY.MEDIUM;
      break;
    case 'success':
      title = 'Transaction Successful';
      message = `Your ${operation} of ${amount} APT on ${protocol} was successful!`;
      priority = PRIORITY.MEDIUM;
      break;
    case 'failed':
      title = 'Transaction Failed';
      message = `Your ${operation} of ${amount} APT on ${protocol} failed. Please try again.`;
      priority = PRIORITY.HIGH;
      break;
    default:
      title = 'Transaction Update';
      message = `Your ${operation} transaction status: ${status}`;
      priority = PRIORITY.MEDIUM;
  }
  
  return createNotification({
    userId,
    type: NOTIFICATION_TYPES.TRANSACTION,
    title,
    message,
    priority,
    data: {
      txHash,
      status,
      operation,
      protocol,
      amount
    }
  });
}

/**
 * Create a price alert notification
 * @param {Object} params - Price alert parameters
 * @returns {Promise<Object>} Created notification
 */
async function createPriceAlertNotification(params) {
  const { userId, token, price, changePercent, alertType } = params;
  
  let title, message, priority;
  
  if (alertType === 'threshold') {
    title = `${token} Price Alert`;
    message = `${token} has ${changePercent > 0 ? 'reached' : 'fallen below'} your price threshold of $${price}`;
    priority = PRIORITY.MEDIUM;
  } else {
    title = `${token} Price Movement`;
    message = `${token} has ${changePercent > 0 ? 'increased' : 'decreased'} by ${Math.abs(changePercent).toFixed(2)}% in the last 24 hours.`;
    priority = Math.abs(changePercent) > 10 ? PRIORITY.HIGH : PRIORITY.MEDIUM;
  }
  
  return createNotification({
    userId,
    type: NOTIFICATION_TYPES.PRICE_ALERT,
    title,
    message,
    priority,
    data: {
      token,
      price,
      changePercent
    }
  });
}

/**
 * Create a recommendation notification
 * @param {Object} params - Recommendation parameters
 * @returns {Promise<Object>} Created notification
 */
async function createRecommendationNotification(params) {
  const { userId, recommendationType, strategy, expectedApr } = params;
  
  let title, message;
  
  switch (recommendationType) {
    case 'new':
      title = 'New AI Strategy Recommendation';
      message = `We've generated a new ${strategy.riskProfile} strategy for you with an expected APR of ${expectedApr}%`;
      break;
    case 'improved':
      title = 'Improved Strategy Available';
      message = `We've found a better strategy that could increase your APR to ${expectedApr}%`;
      break;
    case 'risk':
      title = 'Risk Alert for Current Strategy';
      message = `Market conditions have changed. We recommend adjusting your strategy to reduce risk.`;
      break;
    default:
      title = 'Strategy Recommendation';
      message = `New ${strategy.riskProfile} strategy available with ${expectedApr}% APR`;
  }
  
  return createNotification({
    userId,
    type: NOTIFICATION_TYPES.RECOMMENDATION,
    title,
    message,
    priority: PRIORITY.MEDIUM,
    data: {
      recommendationType,
      strategyName: strategy.name,
      riskProfile: strategy.riskProfile,
      expectedApr
    }
  });
}

/**
 * Create a rebalance notification
 * @param {Object} params - Rebalance parameters
 * @returns {Promise<Object>} Created notification
 */
async function createRebalanceNotification(params) {
  const { userId, status, operationsCount, failedOperations, startApr, endApr } = params;
  
  let title, message, priority;
  
  switch (status) {
    case 'scheduled':
      title = 'Portfolio Rebalance Scheduled';
      message = `Your portfolio will be automatically rebalanced in the next 24 hours.`;
      priority = PRIORITY.LOW;
      break;
    case 'started':
      title = 'Portfolio Rebalance Started';
      message = `Automatic portfolio rebalancing has started. We'll notify you when complete.`;
      priority = PRIORITY.MEDIUM;
      break;
    case 'completed':
      title = 'Portfolio Rebalance Completed';
      message = `Your portfolio has been rebalanced with ${operationsCount} operations${endApr > startApr ? `, increasing your APR from ${startApr}% to ${endApr}%` : ``}.`;
      priority = PRIORITY.MEDIUM;
      break;
    case 'partial':
      title = 'Portfolio Partially Rebalanced';
      message = `${operationsCount - failedOperations} of ${operationsCount} rebalance operations were successful.`;
      priority = PRIORITY.HIGH;
      break;
    case 'failed':
      title = 'Portfolio Rebalance Failed';
      message = `Automatic portfolio rebalancing failed. Please try manual rebalancing.`;
      priority = PRIORITY.HIGH;
      break;
    default:
      title = 'Rebalance Update';
      message = `Portfolio rebalance status: ${status}`;
      priority = PRIORITY.MEDIUM;
  }
  
  return createNotification({
    userId,
    type: NOTIFICATION_TYPES.REBALANCE,
    title,
    message,
    priority,
    data: {
      status,
      operationsCount: operationsCount || 0,
      failedOperations: failedOperations || 0,
      aprChange: endApr && startApr ? (endApr - startApr).toFixed(2) : null
    }
  });
}

/**
 * Create a security notification
 * @param {Object} params - Security parameters
 * @returns {Promise<Object>} Created notification
 */
async function createSecurityNotification(params) {
  const { userId, alertType, details } = params;
  
  let title, message, priority;
  
  switch (alertType) {
    case 'login':
      title = 'New Login Detected';
      message = `New login detected from ${details.location} using ${details.device}.`;
      priority = PRIORITY.HIGH;
      break;
    case 'walletChange':
      title = 'Wallet Configuration Changed';
      message = `Your wallet settings were updated. If this wasn't you, please secure your account.`;
      priority = PRIORITY.HIGH;
      break;
    case 'largeTransaction':
      title = 'Large Transaction Alert';
      message = `A transaction of ${details.amount} APT was initiated. Please verify this was you.`;
      priority = PRIORITY.URGENT;
      break;
    case 'protocolRisk':
      title = 'Protocol Risk Alert';
      message = `Increased risk detected for ${details.protocol}. Consider reducing your exposure.`;
      priority = PRIORITY.HIGH;
      break;
    default:
      title = 'Security Alert';
      message = `Security alert: ${alertType}`;
      priority = PRIORITY.HIGH;
  }
  
  return createNotification({
    userId,
    type: NOTIFICATION_TYPES.SECURITY,
    title,
    message,
    priority,
    channels: [CHANNELS.APP, CHANNELS.EMAIL, CHANNELS.PUSH], // Always use multiple channels for security
    data: details
  });
}

/**
 * Subscribe to notification events
 * @param {string} event - Event name
 * @param {Function} callback - Callback function
 */
function subscribeToNotifications(event, callback) {
  notificationEvents.on(event, callback);
  return () => {
    notificationEvents.off(event, callback);
  };
}

/**
 * Clear notifications for a user
 * @param {string} userId - User ID
 * @param {Object} options - Clear options
 * @returns {number} Number of notifications cleared
 */
async function clearNotifications(userId, options = {}) {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    if (!notificationStore.unread[userId]) {
      return 0;
    }

    const oldCount = notificationStore.unread[userId].length;
    
    // Apply filters
    if (options.types && options.types.length > 0) {
      notificationStore.unread[userId] = notificationStore.unread[userId].filter(
        n => !options.types.includes(n.type)
      );
    } else if (options.olderThan) {
      const cutoffDate = new Date(options.olderThan).getTime();
      notificationStore.unread[userId] = notificationStore.unread[userId].filter(
        n => new Date(n.timestamp).getTime() >= cutoffDate
      );
    } else {
      // Clear all
      notificationStore.unread[userId] = [];
    }

    // Also update in recent notifications
    if (options.types && options.types.length > 0) {
      notificationStore.recent = notificationStore.recent.filter(
        n => n.userId !== userId || !options.types.includes(n.type)
      );
    } else if (options.olderThan) {
      const cutoffDate = new Date(options.olderThan).getTime();
      notificationStore.recent = notificationStore.recent.filter(
        n => n.userId !== userId || new Date(n.timestamp).getTime() >= cutoffDate
      );
    } else {
      notificationStore.recent = notificationStore.recent.filter(
        n => n.userId !== userId
      );
    }

    // For persistent storage, we would update the database here
    // This is simplified for the current implementation

    return oldCount - notificationStore.unread[userId].length;
  } catch (error) {
    logger.error('Failed to clear notifications', error);
    throw error;
  }
}

/**
 * Get unread notification count for a user
 * @param {string} userId - User ID
 * @param {Array} types - Filter by notification types
 * @returns {number} Number of unread notifications
 */
function getUnreadCount(userId, types = null) {
  if (!userId || !notificationStore.unread[userId]) {
    return 0;
  }

  if (!types) {
    return notificationStore.unread[userId].filter(n => !n.read).length;
  }

  return notificationStore.unread[userId].filter(
    n => !n.read && types.includes(n.type)
  ).length;
}

/**
 * Send system notification to all users or specific users
 * @param {Object} params - System notification parameters
 * @returns {Promise<Object>} Created notification
 */
async function sendSystemNotification(params) {
  const { title, message, priority = PRIORITY.MEDIUM, userIds = null } = params;
  
  if (userIds && Array.isArray(userIds)) {
    // Send to specific users
    const notifications = [];
    for (const userId of userIds) {
      const notification = await createNotification({
        userId,
        type: NOTIFICATION_TYPES.SYSTEM,
        title,
        message,
        priority
      });
      notifications.push(notification);
    }
    return { count: notifications.length, notifications };
  } else {
    // Broadcast to all (no userId specified)
    return createNotification({
      type: NOTIFICATION_TYPES.SYSTEM,
      title,
      message,
      priority
    });
  }
}

module.exports = {
  // Core notification functions
  createNotification,
  getUserNotifications,
  markNotificationsAsRead,
  clearNotifications,
  getUnreadCount,
  getNotificationStats,
  subscribeToNotifications,
  
  // Specialized notification creators
  createTransactionNotification,
  createPriceAlertNotification,
  createRecommendationNotification,
  createRebalanceNotification,
  createSecurityNotification,
  sendSystemNotification,
  
  // Constants
  NOTIFICATION_TYPES,
  PRIORITY,
  CHANNELS
};