import React from 'react';

export default function CapacityBar({ current, total }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div>
      <div style={{ width: `${pct}%`, background: 'green', height: 10 }} />
      <span>{pct}%</span>
      <span>{current.toFixed(1)} / {total.toFixed(1)} KW</span>
    </div>
  );
}