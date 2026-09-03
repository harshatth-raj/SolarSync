import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate
} from 'react-router-dom';
import axios from 'axios';

import Login from './components/Login';
import Register from './components/Register';

import StatCards from './components/dashboard/StatCards';
import StatusDonut from './components/dashboard/StatusDonut';
import RecentActivity from './components/dashboard/RecentActivity';

export function Dashboard() {

  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

    axios
      .get('http://localhost:8081/api/metrics/analytics')
      .then((res) => {
        setStats(res.data || {});
      })
      .catch(() => {});

    axios
      .get('http://localhost:8081/api/metrics/recent')
      .then((res) => {
        setMetrics(
          Array.isArray(res.data)
            ? res.data
            : []
        );
      })
      .catch(() => {});

  }, []);

  const handleLogout = () => {
    dispatch({
      type: 'auth/logout'
    });

    navigate('/login');
  };

  const donutData = [
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

      {/* ================= NAVBAR ================= */}

      <nav className="dashboard-navbar">

        <div className="dashboard-logo">
          SolarSync
        </div>

        <div className="dashboard-nav-links">

          <Link to="/">
            Home
          </Link>

          <Link to="/sites">
            Sites
          </Link>

          <Link to="/tickets">
            Tickets
          </Link>

        </div>

        <div className="dashboard-user">

          <span>
            Welcome back, {user?.username}
          </span>

          <button onClick={handleLogout}>
            Logout
          </button>

        </div>

      </nav>


      {/* ================= MAIN CONTENT ================= */}

      <main className="dashboard-content">


        {/* ================= WELCOME ================= */}

        <section className="dashboard-welcome">

          <div>

            <h1>
              Welcome back, {user?.username}!
            </h1>

            <p className="dashboard-role">
              You are {user?.role}
            </p>

            <p className="dashboard-status">
              System is currently operating at optimal efficiency.
            </p>

          </div>

        </section>


        {/* ================= STAT CARDS ================= */}

        <StatCards stats={stats} />


        {/* ================= LOWER GRID ================= */}

        <div className="dashboard-lower-grid">

          {/* MAINTENANCE DISTRIBUTION */}

          <StatusDonut data={donutData} />


          {/* RECENT ACTIVITY */}

          <section className="recent-activity-panel">

            <h3>
              Recent Activity
            </h3>

            <RecentActivity
              metrics={metrics}
            />

          </section>

        </div>

      </main>

    </div>
  );
}


function AppContent() {

  const user = useSelector(
    (s) => s.auth.user
  );

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