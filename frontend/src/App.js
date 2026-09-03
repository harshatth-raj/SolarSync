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

import SolarSiteList from './components/sites/SolarSiteList';
import MaintenanceTicketList from './components/tickets/MaintenanceTicketList';


/* =========================================================
   DASHBOARD
   ========================================================= */

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


  /* =========================================================
     LOAD DASHBOARD DATA
     ========================================================= */

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


  /* =========================================================
     TICKET DATA FOR DONUT
     ========================================================= */

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


  /* =========================================================
     LOGOUT
     ========================================================= */

  const handleLogout = () => {

    dispatch({
      type: 'auth/logout'
    });

    navigate('/login');

  };


  return (

    <div className="dashboard-page">


      {/* =====================================================
          NAVBAR
          ===================================================== */}

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
            {user?.username}
          </span>

          <button onClick={handleLogout}>
            Logout
          </button>

        </div>

      </nav>


      {/* =====================================================
          MAIN CONTENT
          ===================================================== */}

      <main className="dashboard-content">


        {/* ===================================================
            WELCOME
            =================================================== */}

        <section className="dashboard-welcome">

          <div>

            <h1>
              Welcome back, {user?.username}!
            </h1>

            <p className="dashboard-role">
              Role: {user?.role}
            </p>

            <p className="dashboard-status">
              Monitor your solar energy system and
              maintenance activity.
            </p>

          </div>

        </section>


        {/* ===================================================
            STATISTICS
            =================================================== */}

        <StatCards
          stats={stats}
        />


        {/* ===================================================
            DASHBOARD LOWER SECTION
            =================================================== */}

        <div className="dashboard-lower-grid">


          {/* MAINTENANCE DISTRIBUTION */}

          <StatusDonut
            data={donutData}
          />


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


        {/* ===================================================
            QUICK ACCESS
            =================================================== */}

        <section className="dashboard-quick-access">

          <h2>
            Quick Access
          </h2>

          <div className="quick-access-grid">


            {/* SITES */}

            <Link
              to="/sites"
              className="quick-access-card"
            >

              <div className="quick-access-icon">
                ☀️
              </div>

              <div>

                <h3>
                  Solar Sites
                </h3>

                <p>
                  View and manage your solar sites,
                  panels and site information.
                </p>

              </div>

              <span className="quick-access-arrow">
                →
              </span>

            </Link>


            {/* TICKETS */}

            <Link
              to="/tickets"
              className="quick-access-card"
            >

              <div className="quick-access-icon">
                🔧
              </div>

              <div>

                <h3>
                  Maintenance Tickets
                </h3>

                <p>
                  View maintenance issues,
                  ticket status and priorities.
                </p>

              </div>

              <span className="quick-access-arrow">
                →
              </span>

            </Link>


          </div>

        </section>


      </main>

    </div>

  );
}


/* =========================================================
   APP CONTENT / ROUTES
   ========================================================= */

function AppContent() {

  const user = useSelector(
    (s) => s.auth.user
  );


  return (

    <Routes>


      {/* =====================================================
          LOGIN
          ===================================================== */}

      <Route
        path="/login"
        element={
          user
            ? <Navigate to="/" />
            : <Login />
        }
      />


      {/* =====================================================
          REGISTER
          ===================================================== */}

      <Route
        path="/register"
        element={
          user
            ? <Navigate to="/" />
            : <Register />
        }
      />


      {/* =====================================================
          DASHBOARD
          ===================================================== */}

      <Route
        path="/"
        element={
          user
            ? <Dashboard />
            : <Navigate to="/login" />
        }
      />


      {/* =====================================================
          SOLAR SITES
          ===================================================== */}

      <Route
        path="/sites"
        element={
          user
            ? <SolarSiteList />
            : <Navigate to="/login" />
        }
      />


      {/* =====================================================
          MAINTENANCE TICKETS
          ===================================================== */}

      <Route
        path="/tickets"
        element={
          user
            ? <MaintenanceTicketList />
            : <Navigate to="/login" />
        }
      />


      {/* =====================================================
          UNKNOWN URL
          ===================================================== */}

      <Route
        path="*"
        element={
          <Navigate to="/" />
        }
      />

    </Routes>

  );
}


/* =========================================================
   APP
   ========================================================= */

export default function App() {

  return (

    <BrowserRouter>

      <AppContent />

    </BrowserRouter>

  );

}