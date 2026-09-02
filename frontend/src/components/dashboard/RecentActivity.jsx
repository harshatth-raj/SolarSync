import React from 'react';

export default function RecentActivity({ metrics = [] }) {
  return (
    <div>
      {metrics.map((m) => (
        <div key={m.id}>
          <span>Panel #{m.panel.id}</span>
          <span>{parseFloat(m.generationKwh).toFixed(2)} KWh</span>
        </div>
      ))}
    </div>
  );
}