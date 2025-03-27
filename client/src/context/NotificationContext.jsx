import React, { createContext, useState, useCallback, useContext } from 'react';

// Create the context
export const NotificationContext = createContext();

// Create the provider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback((notification) => {
    const id = Date.now();
    const newNotification = {
      id,
      ...notification,
      createdAt: new Date()
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-dismiss after timeout
    const timeout = notification.timeout || 5000;
    if (timeout > 0) {
      setTimeout(() => {
        dismissNotification(id);
      }, timeout);
    }
    
    return id;
  }, []);

  const dismissNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const value = {
    notifications,
    showNotification,
    dismissNotification,
    clearAllNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook for easy context use
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationProvider;