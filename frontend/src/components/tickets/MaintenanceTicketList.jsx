import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function MaintenanceTicketList() {
  const { user } = useSelector((s) => s.auth);
  const isOperator = user?.role === 'SOLAR_OPERATOR';
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    axios.get('/api/tickets').then((res) => setTickets(res.data)).catch(() => {});
  }, []);

  return (
    <div>
      {isOperator && <button>+ Report Issue</button>}
      {tickets.map((t) => (
        <div key={t.id}>
          <span>{t.issueDescription}</span>
          <span>{t.priority}</span>
          <span>{t.status}</span>
        </div>
      ))}
    </div>
  );
}