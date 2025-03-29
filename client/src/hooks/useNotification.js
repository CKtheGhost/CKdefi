// src/hooks/useNotification.js
import { useState, useEffect, useContext, useCallback } from 'react';
import { NotificationContext } from '../context/NotificationContext';
import { UserContext } from '../context/UserContext';
import api from '../utils/api';

/**
 * Hook for managing notifications
 * Handles fetching, displaying, and interacting with notifications
 */
const useNotification = () => {
  const { 
    notifications, 
    setNotifications,
    unreadCount,
    setUnreadCount,
    addNotification
  } = useContext(NotificationContext);
  
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Notification type constants
  const NOTIFICATION_TYPES = {
    TRANSACTION: 'transaction',
    PORTFOLIO: 'portfolio',
    PRICE_ALERT: 'price_alert',
    SECURITY: 'security',
    SYSTEM: 'system',
    RECOMMENDATION: 'recommendation',
    REBALANCE: 'rebalance',
    REWARDS: 'rewards',
    SOCIAL: 'social'
  };

  // Priority levels
  const PRIORITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent'
  };

  /**
   * Fetch user notifications from the server
   * @param {Object} options - Options for fetching notifications
   */
  const fetchNotifications = useCallback(async (options = {}) => {
    if (!user || !user.walletAddress) return;
    
    const { 
      limit = 20, 
      unreadOnly = false, 
      types = null 
    } = options;
    
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      params.append('limit', limit);
      params.append('unreadOnly', unreadOnly);
      
      if (types && Array.isArray(types)) {
        types.forEach(type => params.append('types[]', type));
      }
      
      const response = await api.get(`/api/notifications?${params.toString()}`);
      
      if (response.data) {
        setNotifications(response.data.notifications || []);
        setUnreadCount(response.data.unreadCount || 0);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [user, setNotifications, setUnreadCount]);

  /**
   * Mark notifications as read
   * @param {Array} notificationIds - IDs of notifications to mark as read
   */
  const markAsRead = useCallback(async (notificationIds = []) => {
    if (!user || !user.walletAddress) return;
    
    try {
      setLoading(true);
      
      const response = await api.post('/api/notifications/mark-read', {
        notificationIds: notificationIds
      });
      
      if (response.data && response.data.success) {
        // Update local state
        setNotifications(prevNotifications => 
          prevNotifications.map(notification => {
            if (!notificationIds.length || notificationIds.includes(notification.id)) {
              return { ...notification, read: true };
            }
            return notification;
          })
        );
        
        // Update unread count
        if (response.data.unreadCount !== undefined) {
          setUnreadCount(response.data.unreadCount);
        } else {
          setUnreadCount(prev => Math.max(0, prev - notificationIds.length));
        }
      }
      
      setError(null);
    } catch (err) {
      console.error('Error marking notifications as read:', err);
      setError('Failed to update notifications. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [user, setNotifications, setUnreadCount]);

  /**
   * Clear all notifications
   */
  const clearAllNotifications = useCallback(async () => {
    if (!user || !user.walletAddress) return;
    
    try {
      setLoading(true);
      
      const response = await api.delete('/api/notifications');
      
      if (response.data && response.data.success) {
        // Clear notifications in state
        setNotifications([]);
        setUnreadCount(0);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error clearing notifications:', err);
      setError('Failed to clear notifications. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [user, setNotifications, setUnreadCount]);

  /**
   * Filter notifications by type
   * @param {string} type - Notification type
   * @returns {Array} Filtered notifications
   */
  const filterByType = useCallback((type) => {
    if (!notifications) return [];
    
    return notifications.filter(notification => notification.type === type);
  }, [notifications]);

  /**
   * Filter notifications by priority
   * @param {string} priority - Notification priority
   * @returns {Array} Filtered notifications
   */
  const filterByPriority = useCallback((priority) => {
    if (!notifications) return [];
    
    return notifications.filter(notification => notification.priority === priority);
  }, [notifications]);

  /**
   * Get high priority notifications
   * @returns {Array} High priority notifications
   */
  const getHighPriorityNotifications = useCallback(() => {
    if (!notifications) return [];
    
    return notifications.filter(notification => 
      notification.priority === PRIORITY.HIGH || 
      notification.priority === PRIORITY.URGENT
    );
  }, [notifications, PRIORITY.HIGH, PRIORITY.URGENT]);

  /**
   * Create a transaction notification
   * @param {Object} params - Transaction parameters
   */
  const createTransactionNotification = useCallback((params) => {
    const { txHash, status, operation, protocol, amount } = params;
    
    let title, message, priority;
    
    switch (status) {
      case 'pending':
        title = 'Transaction Submitted';
        message = `Your ${operation} of ${amount} APT on ${protocol} has been submitted.`;
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
    
    addNotification({
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
      },
      timestamp: new Date().toISOString(),
      read: false
    });
  }, [addNotification, NOTIFICATION_TYPES.TRANSACTION, PRIORITY.MEDIUM, PRIORITY.HIGH]);

  /**
   * Create a portfolio notification
   * @param {Object} params - Portfolio parameters
   */
  const createPortfolioNotification = useCallback((params) => {
    const { changeType, valueChange, percentChange, protocol } = params;
    
    let title, message, priority;
    
    if (changeType === 'increase') {
      title = 'Portfolio Value Increased';
      message = protocol 
        ? `Your position in ${protocol} has increased by ${percentChange.toFixed(2)}%`
        : `Your portfolio value has increased by ${percentChange.toFixed(2)}%`;
      priority = PRIORITY.LOW;
    } else {
      title = 'Portfolio Value Decreased';
      message = protocol 
        ? `Your position in ${protocol} has decreased by ${Math.abs(percentChange).toFixed(2)}%`
        : `Your portfolio value has decreased by ${Math.abs(percentChange).toFixed(2)}%`;
      priority = percentChange < -10 ? PRIORITY.HIGH : PRIORITY.MEDIUM;
    }
    
    addNotification({
      type: NOTIFICATION_TYPES.PORTFOLIO,
      title,
      message,
      priority,
      data: {
        changeType,
        valueChange,
        percentChange,
        protocol
      },
      timestamp: new Date().toISOString(),
      read: false
    });
  }, [addNotification, NOTIFICATION_TYPES.PORTFOLIO, PRIORITY.LOW, PRIORITY.MEDIUM, PRIORITY.HIGH]);

  /**
   * Create a recommendation notification
   * @param {Object} params - Recommendation parameters
   */
  const createRecommendationNotification = useCallback((params) => {
    const { title, summary, totalApr, type } = params;
    
    addNotification({
      type: NOTIFICATION_TYPES.RECOMMENDATION,
      title: title || 'New Investment Recommendation',
      message: summary || `We've found a new investment strategy with an expected APR of ${totalApr}%`,
      priority: PRIORITY.MEDIUM,
      data: params,
      timestamp: new Date().toISOString(),
      read: false
    });
  }, [addNotification, NOTIFICATION_TYPES.RECOMMENDATION, PRIORITY.MEDIUM]);

  /**
   * Create a rebalance notification
   * @param {Object} params - Rebalance parameters
   */
  const createRebalanceNotification = useCallback((params) => {
    const { status, operationsCount, failedOperations } = params;
    
    let title, message, priority;
    
    switch (status) {
      case 'scheduled':
        title = 'Portfolio Rebalance Scheduled';
        message = 'Your portfolio will be automatically rebalanced in the next 24 hours.';
        priority = PRIORITY.LOW;
        break;
      case 'started':
        title = 'Portfolio Rebalance Started';
        message = 'Automatic portfolio rebalancing has started. We\'ll notify you when complete.';
        priority = PRIORITY.MEDIUM;
        break;
      case 'completed':
        title = 'Portfolio Rebalance Completed';
        message = `Your portfolio has been rebalanced with ${operationsCount} operations.`;
        priority = PRIORITY.MEDIUM;
        break;
      case 'partial':
        title = 'Portfolio Partially Rebalanced';
        message = `${operationsCount - failedOperations} of ${operationsCount} rebalance operations were successful.`;
        priority = PRIORITY.HIGH;
        break;
      case 'failed':
        title = 'Portfolio Rebalance Failed';
        message = 'Automatic portfolio rebalancing failed. Please try manual rebalancing.';
        priority = PRIORITY.HIGH;
        break;
      default:
        title = 'Rebalance Update';
        message = `Portfolio rebalance status: ${status}`;
        priority = PRIORITY.MEDIUM;
    }
    
    addNotification({
      type: NOTIFICATION_TYPES.REBALANCE,
      title,
      message,
      priority,
      data: params,
      timestamp: new Date().toISOString(),
      read: false
    });
  }, [addNotification, NOTIFICATION_TYPES.REBALANCE, PRIORITY.LOW, PRIORITY.MEDIUM, PRIORITY.HIGH]);

  /**
   * Create a price alert notification
   * @param {Object} params - Price alert parameters
   */
  const createPriceAlertNotification = useCallback((params) => {
    const { token, price, changePercent, alertType } = params;
    
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
    
    addNotification({
      type: NOTIFICATION_TYPES.PRICE_ALERT,
      title,
      message,
      priority,
      data: {
        token,
        price,
        changePercent
      },
      timestamp: new Date().toISOString(),
      read: false
    });
  }, [addNotification, NOTIFICATION_TYPES.PRICE_ALERT, PRIORITY.MEDIUM, PRIORITY.HIGH]);

  // Fetch notifications when user changes
  useEffect(() => {
    if (user && user.walletAddress) {
      fetchNotifications();
    }
  }, [user, fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    clearAllNotifications,
    filterByType,
    filterByPriority,
    getHighPriorityNotifications,
    createTransactionNotification,
    createPortfolioNotification,
    createRecommendationNotification,
    createRebalanceNotification,
    createPriceAlertNotification,
    NOTIFICATION_TYPES,
    PRIORITY
  };
};

export default useNotification;