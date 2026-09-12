import React from 'react';

export default function EmptyState({
  title = 'No items yet',
  message = 'There is no data to display. Add a site or panel to begin monitoring performance.',
  actionLabel = 'Add item',
  onAction
}) {
  return (
    <div className="empty-state">
      <h3 className="empty-title">{title}</h3>
      <p className="empty-message">{message}</p>
      {onAction && (
        <button className="empty-action" onClick={onAction} aria-label={actionLabel}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}