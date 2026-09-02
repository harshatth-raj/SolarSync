import React from 'react';

export default function EmptyState({ message, onAction }) {
  return (
    <div>
      <p>{message}</p>
      <button onClick={onAction}>Take Action</button>
    </div>
  );
}