// Nexus-level NotificationContext.jsx
// Maintains the original notification system, with robust logging and fallback checks.

import React, { createContext, useState, useCallback, useContext } from 'react';

// Create the context
export const NotificationContext = createContext();

// Provider with advanced dismissal logic
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const dismissNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const showNotification = useCallback(
    (notification) => {
      // If no message provided, fallback
      if (!notification?.message) {
        console.warn('[NotificationProvider] Attempted to show notification without message.');
        return null;
      }

      const id = Date.now();
      const newNotification = {
        id,
        ...notification,
        createdAt: new Date(),
      };

      setNotifications((prev) => [...prev, newNotification]);

      const timeout = notification.timeout ?? 5000;
      if (timeout > 0) {
        setTimeout(() => {
          dismissNotification(id);
        }, timeout);
      }
      return id;
    },
    [dismissNotification]
  );

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const value = {
    notifications,
    showNotification,
    dismissNotification,
    clearAllNotifications,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

// Custom hook for usage
export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('[useNotification] must be used within a NotificationProvider.');
  }
  return ctx;
};

export default NotificationProvider;
