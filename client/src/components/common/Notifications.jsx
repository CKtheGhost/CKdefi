// Notifications.jsx
import React, { useState, useEffect } from 'react';
import { useNotification } from '../../hooks/useNotification';
import { XMarkIcon, BellIcon } from '@heroicons/react/24/outline';

const Notifications = () => {
  const [visible, setVisible] = useState(false);
  const { notifications, markAsRead, clearAll } = useNotification();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setUnreadCount(notifications.filter(notif => !notif.read).length);
  }, [notifications]);

  const toggleVisibility = () => setVisible(!visible);

  return (
    <div className="relative">
      <button onClick={toggleVisibility} className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
        <BellIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>
      
      {visible && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-medium">Notifications</h3>
            <div className="flex gap-2">
              <button 
                onClick={clearAll} 
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Clear all
              </button>
              <button onClick={toggleVisibility}>
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {notifications.length === 0 ? (
              <p className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                No notifications
              </p>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{notification.title}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(notification.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {notification.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;