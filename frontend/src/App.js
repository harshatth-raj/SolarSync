import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import axios from 'axios';

import Login from './components/Login';
import Register from './components/Register';

import StatCards from './components/dashboard/StatCards';
import StatusDonut from './components/dashboard/StatusDonut';
import RecentActivity from './components/dashboard/RecentActivity';

export function Dashboard() {
  const user = useSelector((s) => s.auth.user);

  const [stats, setStats] = useState({
    totalGeneration: 0,
    totalConsumption: 0,
    efficiencyRatio: 0,
    totalActivePanels: 0,
    openTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0
  });

  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    // Dashboard analytics
    axios
      .get('http://localhost:8081/api/metrics/analytics')
      .then((res) => {
        setStats(res.data || {});
      })
      .catch(() => {});

    // Recent energy activity
    axios
      .get('http://localhost:8081/api/metrics/recent')
      .then((res) => {
        setMetrics(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => {});
  }, []);

  const statusData = [
    {
      label: 'Open',
      value: stats.openTickets || 0,
      color: '#ef4444'
    },
    {
      label: 'In Progress',
      value: stats.inProgressTickets || 0,
      color: '#f59e0b'
    },
    {
      label: 'Resolved',
      value: stats.resolvedTickets || 0,
      color: '#22c55e'
    }
  ];

  return (
    <div className="dashboard-page">

      {/* HEADER */}

      <div className="dashboard-header">

        <div>
          <h1>Welcome back, {user?.username}!</h1>

          <p>
            Monitor your SolarSync energy system
          </p>
        </div>

        <div className="dashboard-role">
          {user?.role}
        </div>

      </div>


      {/* STATISTICS */}

      <StatCards stats={stats} />


      {/* DASHBOARD MIDDLE SECTION */}

      <div className="dashboard-grid">

        <StatusDonut data={statusData} />

        <div className="dashboard-panel">

          <h3>Ticket Summary</h3>

          <div className="ticket-summary">

            <div>
              <strong>{stats.openTickets || 0}</strong>
              <span>Open</span>
            </div>

            <div>
              <strong>{stats.inProgressTickets || 0}</strong>
              <span>In Progress</span>
            </div>

            <div>
              <strong>{stats.resolvedTickets || 0}</strong>
              <span>Resolved</span>
            </div>

          </div>

        </div>

      </div>


      {/* RECENT ACTIVITY */}

      <div className="dashboard-panel recent-panel">

        <h3>Recent Activity</h3>

        <RecentActivity metrics={metrics} />

      </div>

    </div>
  );
}


function AppContent() {
  const user = useSelector((s) => s.auth.user);

  return (
    <Routes>

      <Route
        path="/login"
        element={
          user
            ? <Navigate to="/" />
            : <Login />
        }
      />

      <Route
        path="/register"
        element={
          user
            ? <Navigate to="/" />
            : <Register />
        }
      />

      <Route
        path="/"
        element={
          user
            ? <Dashboard />
            : <Navigate to="/login" />
        }
      />

    </Routes>
  );
}


export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}