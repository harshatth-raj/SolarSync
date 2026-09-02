import React from 'react';

export default function NotificationStack({ notifications = [] }) {
  return (
    <div>
      {notifications.map((n, i) => (
        <div key={i} className={`notification ${n.type}`}>{n.message}</div>
      ))}
    </div>
  );
}