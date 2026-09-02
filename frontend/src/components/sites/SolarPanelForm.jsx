import React, { useState } from 'react';
import axios from 'axios';

export default function SolarPanelForm({ onClose, siteId, panelToEdit }) {
  const [serialNumber, setSerialNumber] = useState(panelToEdit?.serialNumber || '');
  const [modelType, setModelType] = useState(panelToEdit?.modelType || '');
  const [installationDate, setInstallationDate] = useState(panelToEdit?.installationDate || '');
  const [status, setStatus] = useState(panelToEdit?.status || 'ACTIVE');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (panelToEdit) {
        await axios.put(`/api/panels/${panelToEdit.id}`, { serialNumber, modelType, installationDate, status });
      } else {
        await axios.post(`/api/sites/${siteId}/panels`, { serialNumber, modelType, installationDate, status });
      }
      onClose();
    } catch {}
  };

  return (
    <div>
      <h2>{panelToEdit ? 'Edit Panel' : 'Add Panel'}</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="e.g. SN-12345" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} />
        <input placeholder="Model Type" value={modelType} onChange={(e) => setModelType(e.target.value)} />
        <input type="date" value={installationDate} onChange={(e) => setInstallationDate(e.target.value)} />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
          <option value="MAINTENANCE">MAINTENANCE</option>
        </select>
        <button type="submit">Save Panel</button>
      </form>
    </div>
  );
}