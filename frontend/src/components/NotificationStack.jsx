import React from 'react';

export default function NotificationStack({ notifications = [] }) {
  return (
    <div>
      {notifications.map((notification, index) => (
        <div key={index}>
          {notification.message}
        </div>
      ))}
    </div>
  );
}