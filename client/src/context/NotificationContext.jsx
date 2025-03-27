import React, { createContext, useState, useEffect, useCallback } from 'react';

// Define notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error'
};

// Create the context
export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  // State to store notifications
  const [notifications, setNotifications] = useState([]);
  
  // Auto-dismiss notifications
  useEffect(() => {
    // Check if there are notifications to auto-dismiss
    if (notifications.length === 0) return;
    
    // Setup timers for each notification that has an autoDismiss duration
    const timers = notifications
      .filter(n => n.autoDismiss && n.autoDismiss > 0)
      .map(notification => {
        return setTimeout(() => {
          dismissNotification(notification.id);
        }, notification.autoDismiss);
      });
    
    // Cleanup timers on unmount or when notifications change
    return () => {
      timers.forEach(timerId => clearTimeout(timerId));
    };
  }, [notifications]);

  // Add a new notification
  const addNotification = useCallback((notification) => {
    // Generate a unique ID if not provided
    const id = notification.id || `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Create notification object with defaults
    const newNotification = {
      id,
      type: notification.type || NOTIFICATION_TYPES.INFO,
      title: notification.title || '',
      message: notification.message || '',
      autoDismiss: notification.autoDismiss !== undefined ? notification.autoDismiss : 5000, // Default 5 seconds
      timestamp: Date.now(),
      ...notification
    };
    
    // Add notification to the state
    setNotifications(prev => [newNotification, ...prev]);
    
    // Return the notification ID for reference
    return id;
  }, []);

  // Convenience methods for different notification types
  const success = useCallback((message, options = {}) => {
    return addNotification({
      type: NOTIFICATION_TYPES.SUCCESS,
      message,
      ...options
    });
  }, [addNotification]);
  
  const info = useCallback((message, options = {}) => {
    return addNotification({
      type: NOTIFICATION_TYPES.INFO,
      message,
      ...options
    });
  }, [addNotification]);
  
  const warning = useCallback((message, options = {}) => {
    return addNotification({
      type: NOTIFICATION_TYPES.WARNING,
      message,
      ...options
    });
  }, [addNotification]);
  
  const error = useCallback((message, options = {}) => {
    return addNotification({
      type: NOTIFICATION_TYPES.ERROR,
      message,
      autoDismiss: 0, // Errors don't auto-dismiss by default
      ...options
    });
  }, [addNotification]);

  // Dismiss a notification by ID
  const dismissNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Dismiss all notifications
  const dismissAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Context value
  const value = {
    notifications,
    addNotification,
    dismissNotification,
    dismissAll,
    success,
    info,
    warning,
    error
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use the notification context
export const useNotification = () => {
  const context = React.useContext(NotificationContext);
  if (context === null) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};