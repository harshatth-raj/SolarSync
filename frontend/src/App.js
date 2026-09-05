import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import Login from "./components/Login";
import Register from "./components/Register";

import SolarSiteList from "./components/sites/SolarSiteList";
import SolarSiteDetails from "./components/sites/SolarSiteDetails";

import MaintenanceTicketList from "./components/tickets/MaintenanceTicketList";

import axios from "axios";

import "./App.css";


/* =========================================================
   PAGE LAYOUT
   ========================================================= */

function PageLayout({ children }) {
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "auth/logout" });

    localStorage.removeItem("token");
    localStorage.removeItem("jwt");
    localStorage.removeItem("accessToken");

    navigate("/login");
  };

  return (
    <div className="app">

      {/* ===================================================
          NAVBAR
          =================================================== */}

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
            Welcome back, {user?.username || "user"}
          </span>

          <button
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>


      {/* ===================================================
          PAGE CONTENT
          =================================================== */}

      <main className="dashboard-content">
        {children}
      </main>

    </div>
  );
}


/* =========================================================
   DASHBOARD
   ========================================================= */

export function Dashboard() {
  const user = useSelector((state) => state.auth.user);

  const [metrics, setMetrics] = useState({
    dailyEnergy: "101.30",
    maintenance: "3.00",
    efficiency: "97.1%",
    activeSites: "3",
    openTickets: "2",
  });

  useEffect(() => {

    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("jwt") ||
      localStorage.getItem("accessToken");

    const headers = token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {};

    const loadMetrics = async () => {

      try {

        const [
          dailyEnergyResponse,
          maintenanceResponse,
          efficiencyResponse,
          sitesResponse,
          ticketsResponse,
        ] = await Promise.allSettled([

          axios.get(
            "http://localhost:8081/api/metrics/daily-energy",
            { headers }
          ),

          axios.get(
            "http://localhost:8081/api/metrics/maintenance-cost",
            { headers }
          ),

          axios.get(
            "http://localhost:8081/api/metrics/efficiency",
            { headers }
          ),

          axios.get(
            "http://localhost:8081/api/sites",
            { headers }
          ),

          axios.get(
            "http://localhost:8081/api/tickets",
            { headers }
          ),

        ]);


        if (
          dailyEnergyResponse.status === "fulfilled"
        ) {

          setMetrics((current) => ({
            ...current,

            dailyEnergy:
              dailyEnergyResponse.value?.data ??
              current.dailyEnergy,
          }));

        }


        if (
          maintenanceResponse.status === "fulfilled"
        ) {

          setMetrics((current) => ({
            ...current,

            maintenance:
              maintenanceResponse.value?.data ??
              current.maintenance,
          }));

        }


        if (
          efficiencyResponse.status === "fulfilled"
        ) {

          setMetrics((current) => ({
            ...current,

            efficiency:
              efficiencyResponse.value?.data ??
              current.efficiency,
          }));

        }


        if (
          sitesResponse.status === "fulfilled" &&
          Array.isArray(sitesResponse.value?.data)
        ) {

          setMetrics((current) => ({
            ...current,

            activeSites:
              sitesResponse.value.data.length,
          }));

        }


        if (
          ticketsResponse.status === "fulfilled" &&
          Array.isArray(ticketsResponse.value?.data)
        ) {

          const openTickets =
            ticketsResponse.value.data.filter(
              (ticket) =>
                String(
                  ticket.status || ""
                ).toUpperCase() === "OPEN"
            ).length;

          setMetrics((current) => ({
            ...current,

            openTickets,
          }));

        }

      } catch (error) {

        console.error(
          "Dashboard metrics error:",
          error
        );

      }

    };

    loadMetrics();

  }, []);


  return (
    <PageLayout>

      <div className="dashboard-page">

        {/* =============================================
            WELCOME CARD
            ============================================= */}

        <section className="welcome-card">

          <div>

            <h1>
              Welcome back,{" "}
              {user?.username || "admin"}!
            </h1>

            <p>
              You are a{" "}
              {user?.role || "SYSTEM ADMINISTRATOR"}
            </p>

            <span>
              Systems are currently operating
              with optimal efficiency.
            </span>

          </div>

        </section>


        {/* =============================================
            METRIC CARDS
            ============================================= */}

        <section className="metric-grid">

          <div className="metric-card metric-blue">

            <span>
              DAILY ENERGY
            </span>

            <strong>
              {metrics.dailyEnergy}
            </strong>

          </div>


          <div className="metric-card metric-red">

            <span>
              MAINTENANCE COST
            </span>

            <strong>
              {metrics.maintenance}
            </strong>

          </div>


          <div className="metric-card metric-green">

            <span>
              SYSTEM EFFICIENCY
            </span>

            <strong>
              {metrics.efficiency}
            </strong>

          </div>


          <div className="metric-card metric-yellow">

            <span>
              ACTIVE SITES
            </span>

            <strong>
              {metrics.activeSites}
            </strong>

          </div>


          <div className="metric-card metric-purple">

            <span>
              OPEN TICKETS
            </span>

            <strong>
              {metrics.openTickets}
            </strong>

          </div>

        </section>


        {/* =============================================
            LOWER DASHBOARD
            ============================================= */}

        <section className="dashboard-lower">

          {/* Maintenance Distribution */}

          <div className="dashboard-panel">

            <h2>
              Maintenance Distribution
            </h2>

            <div className="donut-wrapper">

              <div className="donut-chart">
                <div className="donut-hole">
                  3
                </div>
              </div>

            </div>

            <div className="chart-legend">

              <div>
                <span className="legend-dot red-dot"></span>
                Open
              </div>

              <div>
                <span className="legend-dot green-dot"></span>
                Resolved
              </div>

              <div>
                <span className="legend-dot yellow-dot"></span>
                In Progress
              </div>

            </div>

          </div>


          {/* Recent Activity */}

          <div className="dashboard-panel">

            <h2>
              Recent Activity
            </h2>

            <div className="activity-list">

              <div className="activity-item">

                <div>
                  <small>
                    2026-08-25
                  </small>

                  <p>
                    Energy generated
                  </p>

                  <span className="positive">
                    ↑ 13.50 kWh
                  </span>

                  <span className="negative">
                    ↓ 1.90 kWh
                  </span>
                </div>

                <span className="activity-status">
                  Normal
                </span>

              </div>


              <div className="activity-item">

                <div>
                  <small>
                    2026-08-24
                  </small>

                  <p>
                    Energy generated
                  </p>

                  <span className="positive">
                    ↑ 42.50 kWh
                  </span>

                  <span className="negative">
                    ↓ 4.20 kWh
                  </span>
                </div>

                <span className="activity-status">
                  Normal
                </span>

              </div>


              <div className="activity-item">

                <div>
                  <small>
                    2026-08-23
                  </small>

                  <p>
                    Energy generated
                  </p>

                  <span className="positive">
                    ↑ 25.40 kWh
                  </span>

                  <span className="negative">
                    ↓ 2.10 kWh
                  </span>
                </div>

                <span className="activity-status">
                  Normal
                </span>

              </div>

            </div>

          </div>

        </section>

      </div>

    </PageLayout>
  );
}


/* =========================================================
   MAIN APP
   ========================================================= */

function App() {

  const user = useSelector(
    (state) => state.auth.user
  );

  return (
    <BrowserRouter>

      <Routes>

        {/* ===============================================
            LOGIN
            =============================================== */}

        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <Login />
            )
          }
        />


        {/* ===============================================
            REGISTER
            =============================================== */}

        <Route
          path="/register"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <Register />
            )
          }
        />


        {/* ===============================================
            DASHBOARD
            =============================================== */}

        <Route
          path="/"
          element={
            user ? (
              <Dashboard />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />


        {/* ===============================================
            SOLAR SITES
            =============================================== */}

        <Route
          path="/sites"
          element={
            user ? (
              <PageLayout>
                <SolarSiteList />
              </PageLayout>
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />


        {/* ===============================================
            SOLAR SITE DETAILS
            =============================================== */}

        <Route
          path="/sites/:id"
          element={
            user ? (
              <PageLayout>
                <SolarSiteDetails />
              </PageLayout>
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />


        {/* ===============================================
            TICKETS
            =============================================== */}

        <Route
          path="/tickets"
          element={
            user ? (
              <PageLayout>
                <div className="tickets-page">

                  <h1>
                    Maintenance Tickets
                  </h1>

                  <p className="tickets-subtitle">
                    View and manage your
                    maintenance issues.
                  </p>

                  <MaintenanceTicketList />

                </div>
              </PageLayout>
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />


        {/* ===============================================
            FALLBACK
            =============================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;