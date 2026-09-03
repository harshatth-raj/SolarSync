import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Login from './components/Login';

export function Dashboard() {
  const user = useSelector((s) => s.auth.user);

  const [stats, setStats] = useState({
    openTickets: 0,
    resolvedTickets: 0,
    inProgressTickets: 0
  });

  useEffect(() => {
    axios.get('/api/dashboard/stats')
      .then((res) => setStats(res.data))
      .catch(() => {});
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Welcome back, {user?.username}!</h1>

      <p>Role: {user?.role}</p>

      <p>Open Tickets: {stats.openTickets}</p>

      <p>Resolved: {stats.resolvedTickets}</p>

      <p>In Progress: {stats.inProgressTickets}</p>
    </div>
  );
}

function AppContent() {
  const user = useSelector((s) => s.auth.user);

  return user ? <Dashboard /> : <Login />;
}

export default function App() {
  return <AppContent />;
}