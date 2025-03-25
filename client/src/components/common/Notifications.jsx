import React, { useEffect, useState } from 'react';

/**
 * Notification component for displaying toast messages
 * @param {Object} props - Component props
 * @param {Array} props.notifications - Array of notification objects
 * @param {Function} props.removeNotification - Function to remove a notification
 */
const Notifications = ({ 
  notifications = [], 
  removeNotification 
}) => {
  if (!notifications.length) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          notification={notification}
          onDismiss={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

/**
 * Individual notification component
 */
const Notification = ({ notification, onDismiss }) => {
  const [isLeaving, setIsLeaving] = useState(false);
  
  // Auto-dismiss notification after timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLeaving(true);
      // Wait for animation to complete
      setTimeout(onDismiss, 300);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onDismiss]);
  
  // Determine notification color based on type
  const getNotificationClasses = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'info':
      default:
        return 'bg-blue-500 text-white';
    }
  };
  
  // Get appropriate icon for the notification type
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };
  
  return (
    <div 
      className={`
        notification-toast rounded-lg shadow-lg p-4 max-w-md
        ${getNotificationClasses()}
        transition-all duration-300 transform
        ${isLeaving ? 'opacity-0 translate-x-2' : 'opacity-100'}
      `}
      role="alert"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {getIcon()}
          <span>{notification.message}</span>
        </div>
        <button 
          onClick={() => {
            setIsLeaving(true);
            setTimeout(onDismiss, 300);
          }}
          className="ml-4 text-white opacity-70 hover:opacity-100 focus:outline-none"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Notifications;