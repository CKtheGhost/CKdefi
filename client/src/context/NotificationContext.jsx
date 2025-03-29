import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

// Create notification context
const NotificationContext = createContext();

// Notification types matching server-side enum
export const NOTIFICATION_TYPES = {
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

// Notification priority levels
export const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch notifications on initial load or when triggered
  const fetchNotifications = useCallback(async () => {
    if (!localStorage.getItem('walletAddress')) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/api/notifications');
      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.unreadCount || 0);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    if (!notificationId) return;
    
    try {
      await api.put(`/api/notifications/${notificationId}/read`);
      
      // Update local state
      setNotifications(prev => prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      ));
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await api.put('/api/notifications/read-all');
      
      // Update local state
      setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  }, []);

  // Clear notifications
  const clearNotifications = useCallback(async (type = null) => {
    try {
      if (type) {
        await api.delete(`/api/notifications?type=${type}`);
        setNotifications(prev => prev.filter(notification => notification.type !== type));
      } else {
        await api.delete('/api/notifications');
        setNotifications([]);
      }
      
      // Update unread count
      await fetchNotifications();
    } catch (err) {
      console.error('Error clearing notifications:', err);
    }
  }, [fetchNotifications]);

  // Create a custom transaction notification
  const createTransactionNotification = useCallback(async (transactionData) => {
    try {
      await api.post('/api/notifications', {
        type: NOTIFICATION_TYPES.TRANSACTION,
        title: `Transaction ${transactionData.status}`,
        message: `Your ${transactionData.type} transaction of ${transactionData.amount} APT ${
          transactionData.status === 'confirmed' ? 'was successful' : 
          transactionData.status === 'failed' ? 'failed' : 'is pending'
        }`,
        priority: transactionData.status === 'failed' ? PRIORITY.HIGH : PRIORITY.MEDIUM,
        data: transactionData
      });

      // Refresh notifications
      await fetchNotifications();
    } catch (err) {
      console.error('Error creating transaction notification:', err);
    }
  }, [fetchNotifications]);

  // Set up WebSocket or polling for real-time notifications
  useEffect(() => {
    const walletAddress = localStorage.getItem('walletAddress');
    if (!walletAddress) return;
    
    // Initial fetch
    fetchNotifications();
    
    // Set up polling for new notifications
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000); // Poll every 30 seconds
    
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Context value
  const value = {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    createTransactionNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use the notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;