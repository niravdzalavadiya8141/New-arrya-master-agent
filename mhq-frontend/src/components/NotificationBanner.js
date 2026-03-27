import React, { useEffect } from 'react';
import { Bell } from 'lucide-react';

const NotificationBanner = ({ notifications }) => {
  const [visibleNotifications, setVisibleNotifications] = useEffect(() => {
    return notifications.slice(0, 3);
  }, [notifications]);

  if (notifications.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center mb-3">
        <Bell className="w-5 h-5 text-yellow-400 mr-2" />
        <h2 className="text-xl font-semibold text-white">Live Updates</h2>
      </div>
      
      <div className="space-y-2">
        {notifications.map((notification, index) => (
          <div 
            key={index}
            className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-3 text-sm text-yellow-200"
          >
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse" />
              <span>{notification.message}</span>
            </div>
            <div className="text-xs text-yellow-400 mt-1">
              {notification.timestamp}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationBanner;