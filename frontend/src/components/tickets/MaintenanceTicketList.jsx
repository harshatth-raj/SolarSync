import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function MaintenanceTicketList() {
  const { user } = useSelector((s) => s.auth);

  const isOperator =
    user?.role === 'SOLAR_OPERATOR';

  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    axios.get('/api/tickets')
      .then((res) => {
        setTickets(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => {
        setTickets([]);
      });
  }, []);

  return (
    <div className="ticket-list">

      {isOperator && (
        <button>
          + Report Issue
        </button>
      )}

      {tickets.map((t) => (
        <div className="ticket-card" key={t.id}>

          <span>{t.issueDescription}</span>

          <span>{t.priority}</span>

          <span>{t.status}</span>

          {t.site && (
            <span>{t.site.siteName}</span>
          )}

          {t.panel && (
            <span>Panel #{t.panel.id}</span>
          )}

          {t.technician && (
            <span>{t.technician.username}</span>
          )}

        </div>
      ))}

    </div>
  );
}