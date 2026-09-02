import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function MaintenanceTicketForm({ onClose }) {
  const [description, setDescription] = useState('');
  const [sites, setSites] = useState([]);

  useEffect(() => {
    axios.get('/api/sites').then((res) => setSites(res.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/tickets', { issueDescription: description });
      onClose();
    } catch {}
  };

  return (
    <div>
      <h2>Report Issue</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Describe the fault in detail"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Submit Ticket</button>
      </form>
    </div>
  );
}