import React from 'react';

export default function NotificationStack({ notifications = [] }) {
  const renderPrefix = (type) => {
    switch ((type || '').toLowerCase()) {
      case 'success':
        return 'Success:';
      case 'error':
        return 'Error:';
      default:
        return 'Info:';
    }
  };

  return (
    <div className="notification-stack" aria-live="polite">
      {notifications.map((notification, index) => (
        <div className={`notification ${notification.type || 'info'}`} key={index}>
          <strong className="notification-prefix">{renderPrefix(notification.type)}</strong>{' '}
          <span className="notification-message">{notification.message}</span>
          {notification.timestamp && (
            <small className="notification-time">{new Date(notification.timestamp).toLocaleTimeString()}</small>
          )}
        </div>
      ))}
    </div>
  );
}