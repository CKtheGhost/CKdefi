import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';

/**
 * Custom hook for accessing notification functions
 * @returns {Object} Notification context functions
 */
export const useNotification = () => {
  const context = useContext(NotificationContext);
  
  if (!context) {
    // Return a default implementation to avoid errors if used outside context
    console.warn('useNotification hook used outside NotificationProvider');
    return {
      showNotification: (message, type = 'info') => {
        console.log(`Notification (${type}): ${message}`);
      },
      success: (message) => {
        console.log(`Success: ${message}`);
      },
      error: (message) => {
        console.error(`Error: ${message}`);
      },
      warning: (message) => {
        console.warn(`Warning: ${message}`);
      },
      info: (message) => {
        console.info(`Info: ${message}`);
      }
    };
  }
  
  return context;
};