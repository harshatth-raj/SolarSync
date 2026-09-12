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

import api from "./services/api";

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
    dailyEnergy: "0",
    maintenance: "0",
    efficiency: "0%",
    activeSites: 0,
    openTickets: 0,
  });

  const [ticketDistribution, setTicketDistribution] = useState({
    open: 0,
    resolved: 0,
    inProgress: 0,
    total: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);

  const [calculating, setCalculating] = useState(false);

  /* =====================================================
     AUTH CONFIG
     ===================================================== */

  const getAuthConfig = () => {

    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("jwt") ||
      localStorage.getItem("accessToken");

    return token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : {};
  };

  /* =====================================================
     LOAD RECENT ACTIVITY
     ===================================================== */

  const loadRecentActivity = async () => {

    try {

      const config = getAuthConfig();

      const response =
        await api.get(
          "/api/metrics/recent",
          config
        );

      const data =
        Array.isArray(response.data)
          ? response.data
          : [];

      /*
       * Show the latest 3 readings.
       * Backend already returns recent metrics,
       * but sorting here ensures newest readings
       * appear first.
       */

      const sorted =
        [...data].sort(
          (a, b) =>
            new Date(
              b?.readingTimestamp || 0
            ) -
            new Date(
              a?.readingTimestamp || 0
            )
        );

      setRecentActivity(
        sorted.slice(0, 3)
      );

    } catch (error) {

      console.error(
        "Failed to load recent activity:",
        error
      );

      setRecentActivity([]);

    }

  };

  /* =====================================================
     LOAD SITES + TICKETS + RECENT ACTIVITY
     ===================================================== */

  useEffect(() => {

    const loadDashboardData = async () => {

      const config = getAuthConfig();

      try {

        const [
          sitesResponse,
          ticketsResponse,
        ] = await Promise.allSettled([

          api.get(
            "/api/sites",
            config
          ),

          api.get(
            "/api/tickets",
            config
          ),

        ]);

        /* =============================================
           ACTIVE SITES
           ============================================= */

        if (
          sitesResponse.status === "fulfilled" &&
          Array.isArray(
            sitesResponse.value?.data
          )
        ) {

          const siteCount =
            sitesResponse.value.data.length;

          setMetrics((current) => ({
            ...current,

            activeSites: siteCount,
          }));

        }

        /* =============================================
           TICKET DATA
           ============================================= */

        if (
          ticketsResponse.status === "fulfilled" &&
          Array.isArray(
            ticketsResponse.value?.data
          )
        ) {

          const tickets =
            ticketsResponse.value.data;

          /* -----------------------------------------
             OPEN
             ----------------------------------------- */

          const open =
            tickets.filter(
              (ticket) =>
                String(
                  ticket?.status || ""
                ).toUpperCase() === "OPEN"
            ).length;

          /* -----------------------------------------
             RESOLVED / CLOSED
             ----------------------------------------- */

          const resolved =
            tickets.filter(
              (ticket) => {

                const status =
                  String(
                    ticket?.status || ""
                  ).toUpperCase();

                return (
                  status === "RESOLVED" ||
                  status === "CLOSED"
                );

              }
            ).length;

          /* -----------------------------------------
             IN PROGRESS
             ----------------------------------------- */

          const inProgress =
            tickets.filter(
              (ticket) => {

                const status =
                  String(
                    ticket?.status || ""
                  ).toUpperCase();

                return (
                  status === "IN_PROGRESS" ||
                  status === "IN PROGRESS" ||
                  status === "IN-PROGRESS"
                );

              }
            ).length;

          /* -----------------------------------------
             TOTAL
             ----------------------------------------- */

          const total =
            open +
            resolved +
            inProgress;

          /* -----------------------------------------
             OPEN TICKETS METRIC
             ----------------------------------------- */

          setMetrics((current) => ({
            ...current,

            openTickets: open,
          }));

          /* -----------------------------------------
             MAINTENANCE DISTRIBUTION
             ----------------------------------------- */

          setTicketDistribution({
            open,
            resolved,
            inProgress,
            total,
          });

        }

        /* =============================================
           RECENT ACTIVITY
           ============================================= */

        await loadRecentActivity();

      } catch (error) {

        console.error(
          "Dashboard metrics error:",
          error
        );

      }

    };

    loadDashboardData();

  }, []);

  /* =====================================================
     SIMULATE + CALCULATE METRICS
     ===================================================== */

  const calculateMetrics = async () => {

    setCalculating(true);

    try {

      const config = getAuthConfig();

      /* =============================================
         STEP 1
         Generate and save simulated reading
         for panel ID 1
         ============================================= */

      await api.post(
        "/api/metrics/simulate/1",
        {},
        config
      );

      /* =============================================
         STEP 2
         Calculate today's dashboard metrics
         ============================================= */

      const response =
        await api.get(
          "/api/metrics/dashboard",
          config
        );

      const data =
        response.data || {};

      /* =============================================
         DAILY ENERGY
         ============================================= */

      const dailyEnergy =
        data.dailyEnergy !== undefined &&
        data.dailyEnergy !== null
          ? Number(
              data.dailyEnergy
            ).toFixed(2)
          : "0.00";

      /* =============================================
         MAINTENANCE COST
         ============================================= */

      const maintenanceCost =
        data.maintenanceCost !== undefined &&
        data.maintenanceCost !== null
          ? Number(
              data.maintenanceCost
            ).toFixed(2)
          : "3.00";

      /* =============================================
         SYSTEM EFFICIENCY
         ============================================= */

      const systemEfficiency =
        data.systemEfficiency !== undefined &&
        data.systemEfficiency !== null
          ? `${Number(
              data.systemEfficiency
            ).toFixed(1)}%`
          : "0.0%";

      /* =============================================
         UPDATE DASHBOARD CARDS
         ============================================= */

      setMetrics((current) => ({
        ...current,

        dailyEnergy,

        maintenance:
          maintenanceCost,

        efficiency:
          systemEfficiency,
      }));

      /* =============================================
         STEP 3
         Refresh Recent Activity
         ============================================= */

      await loadRecentActivity();

    } catch (error) {

      console.error(
        "Failed to calculate dashboard metrics:",
        error
      );

    } finally {

      setCalculating(false);

    }

  };

  /* =====================================================
     DONUT CALCULATION
     ===================================================== */

  const {
    open,
    resolved,
    inProgress,
    total,
  } = ticketDistribution;

  const openPercentage =
    total > 0
      ? (open / total) * 100
      : 0;

  const resolvedPercentage =
    total > 0
      ? (resolved / total) * 100
      : 0;

  const donutBackground =
    total > 0
      ? `conic-gradient(
          #ff4d4f 0% ${openPercentage}%,
          #22c55e ${openPercentage}% ${
            openPercentage +
            resolvedPercentage
          }%,
          #f59e0b ${
            openPercentage +
            resolvedPercentage
          }% 100%
        )`
      : "conic-gradient(#334155 0% 100%)";

  /* =====================================================
     FORMAT DATE
     ===================================================== */

  const formatActivityDate = (
    timestamp
  ) => {

    if (!timestamp) {
      return "Unknown date";
    }

    const date =
      new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
      return "Unknown date";
    }

    return date.toLocaleDateString(
      "en-CA"
    );
  };

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
            CALCULATE METRICS BUTTON
            ============================================= */}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "20px",
          }}
        >

          <button
            type="button"
            onClick={calculateMetrics}
            disabled={calculating}
            style={{
              padding: "12px 22px",
              border: "none",
              borderRadius: "8px",
              cursor: calculating
                ? "not-allowed"
                : "pointer",
              fontWeight: "600",
              fontSize: "14px",
              opacity: calculating
                ? 0.7
                : 1,
            }}
          >

            {calculating
              ? "Calculating..."
              : "Calculate Metrics"}

          </button>

        </div>

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

          {/* ===========================================
              MAINTENANCE DISTRIBUTION
              =========================================== */}

          <div className="dashboard-panel">

            <h2>
              Maintenance Distribution
            </h2>

            <div className="donut-wrapper">

              <div
                className="donut-chart"
                style={{
                  background:
                    donutBackground,
                }}
              >

                <div className="donut-hole">
                  {total}
                </div>

              </div>

            </div>

            <div className="chart-legend">

              <div>
                <span className="legend-dot red-dot"></span>
                Open ({open})
              </div>

              <div>
                <span className="legend-dot green-dot"></span>
                Resolved ({resolved})
              </div>

              <div>
                <span className="legend-dot yellow-dot"></span>
                In Progress ({inProgress})
              </div>

            </div>

          </div>

          {/* ===========================================
              RECENT ACTIVITY
              =========================================== */}

          <div className="dashboard-panel">

            <h2>
              Recent Activity
            </h2>

            <div className="activity-list">

              {recentActivity.length > 0 ? (

                recentActivity.map(
                  (activity, index) => (

                    <div
                      className="activity-item"
                      key={
                        activity?.id ||
                        index
                      }
                    >

                      <div>

                        <small>
                          {formatActivityDate(
                            activity?.readingTimestamp
                          )}
                        </small>

                        <p>
                          Energy generated
                        </p>

                        <span className="positive">
                          ↑{" "}
                          {Number(
                            activity?.energyGeneratedKwh || 0
                          ).toFixed(2)}{" "}
                          kWh
                        </span>

                      </div>

                      <span className="activity-status">
                        Recorded
                      </span>

                    </div>

                  )
                )

              ) : (

                <div className="activity-item">

                  <div>

                    <small>
                      No readings yet
                    </small>

                    <p>
                      No energy generation data
                      available.
                    </p>

                  </div>

                  <span className="activity-status">
                    Waiting
                  </span>

                </div>

              )}

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
              <Navigate
                to="/"
                replace
              />
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
              <Navigate
                to="/"
                replace
              />
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
                <MaintenanceTicketList />
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