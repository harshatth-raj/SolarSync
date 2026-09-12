import React, { useEffect, useState, useRef, useCallback } from "react";
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
    dailyEnergy: "0.00",
    maintenance: "3.00",
    efficiency: "0.0%",
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
  const [lastUpdated, setLastUpdated] = useState(null);
  const [liveTime, setLiveTime] = useState(new Date());
  const [newActivityIds, setNewActivityIds] = useState(new Set());
  const [flashedCards, setFlashedCards] = useState(new Set());
  const prevMetricsRef = useRef(null);
  const prevActivityRef = useRef([]);

  /* =====================================================
     LIVE CLOCK — ticks every second
     ===================================================== */

  useEffect(() => {
    const clockInterval = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(clockInterval);
  }, []);

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
     LOAD DASHBOARD METRICS
     ===================================================== */

  const loadCalculatedMetrics = async () => {

    try {

      const config = getAuthConfig();

      const response =
        await api.get(
          "/api/metrics/dashboard",
          config
        );

      const data =
        response.data || {};

      setMetrics((current) => {

        const next = { ...current };
        const changed = new Set();

        if (data.dailyEnergy !== undefined && data.dailyEnergy !== null) {
          const val = Number(data.dailyEnergy).toFixed(2);
          if (val !== current.dailyEnergy) { next.dailyEnergy = val; changed.add("dailyEnergy"); }
        }

        if (data.maintenanceCost !== undefined && data.maintenanceCost !== null) {
          const val = Number(data.maintenanceCost).toFixed(2);
          if (val !== current.maintenance) { next.maintenance = val; changed.add("maintenance"); }
        }

        if (data.systemEfficiency !== undefined && data.systemEfficiency !== null) {
          const val = `${Number(data.systemEfficiency).toFixed(1)}%`;
          if (val !== current.efficiency) { next.efficiency = val; changed.add("efficiency"); }
        }

        if (changed.size > 0) {
          setFlashedCards(changed);
          setTimeout(() => setFlashedCards(new Set()), 2000);
        }

        return next;

      });

    } catch (error) {

      console.error(
        "Failed to load dashboard metrics:",
        error
      );

    }

  };

  /* =====================================================
     LOAD SITES
     ===================================================== */

  const loadSites = async () => {

    try {

      const config = getAuthConfig();

      const response =
        await api.get(
          "/api/sites",
          config
        );

      const sites =
        Array.isArray(response.data)
          ? response.data
          : [];

      setMetrics((current) => ({

        ...current,

        activeSites:
          sites.length,

      }));

    } catch (error) {

      console.error(
        "Failed to load sites:",
        error
      );

    }

  };

  /* =====================================================
     LOAD TICKETS
     ===================================================== */

  const loadTickets = async () => {

    try {

      const config = getAuthConfig();

      const response =
        await api.get(
          "/api/tickets",
          config
        );

      const tickets =
        Array.isArray(response.data)
          ? response.data
          : [];

      const open =
        tickets.filter(
          (ticket) =>
            String(
              ticket?.status || ""
            ).toUpperCase() === "OPEN"
        ).length;

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

      const total =
        open +
        resolved +
        inProgress;

      setMetrics((current) => ({

        ...current,

        openTickets:
          open,

      }));

      setTicketDistribution({

        open,
        resolved,
        inProgress,
        total,

      });

    } catch (error) {

      console.error(
        "Failed to load tickets:",
        error
      );

    }

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

      const activities =
        Array.isArray(response.data)
          ? response.data
          : [];

      const sortedActivities =
        [...activities].sort(
          (a, b) =>
            new Date(
              b?.readingTimestamp || 0
            ) -
            new Date(
              a?.readingTimestamp || 0
            )
        );

      const latest = sortedActivities.slice(0, 5);

      /* detect newly added entries to flash-animate them */
      const prevIds = new Set(
        prevActivityRef.current.map((a) => a?.id)
      );
      const freshIds = new Set(
        latest
          .filter((a) => a?.id && !prevIds.has(a.id))
          .map((a) => a.id)
      );
      if (freshIds.size > 0) {
        setNewActivityIds(freshIds);
        setTimeout(() => setNewActivityIds(new Set()), 2500);
      }
      prevActivityRef.current = latest;

      setRecentActivity(latest);
      setLastUpdated(new Date());

    } catch (error) {

      console.error(
        "Failed to load recent activity:",
        error
      );

    }

  };

  /* =====================================================
     GENERATE NEW LIVE READING
     ===================================================== */

  const generateLiveReading = useCallback(async () => {

    try {

      const config = getAuthConfig();

      await api.post(
        "/api/metrics/simulate/1",
        {},
        config
      );

      await Promise.all([
        loadCalculatedMetrics(),
        loadRecentActivity(),
        loadSites(),
        loadTickets(),
      ]);

    } catch (error) {

      console.error(
        "Failed to generate live reading:",
        error
      );

    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =====================================================
     INITIAL DASHBOARD LOAD
     ===================================================== */

  useEffect(() => {

    let mounted = true;

    const loadDashboard = async () => {

      if (!mounted) {
        return;
      }

      try {

        await Promise.all([
          loadCalculatedMetrics(),
          loadSites(),
          loadTickets(),
          loadRecentActivity(),
        ]);

      } catch (error) {

        console.error(
          "Failed to load dashboard:",
          error
        );

      }

    };

    loadDashboard();

    return () => {

      mounted = false;

    };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =====================================================
     CONTINUOUS LIVE DASHBOARD — every 10 s
     ===================================================== */

  useEffect(() => {

    const liveInterval = setInterval(() => {
      generateLiveReading();
    }, 10000);

    return () => {
      clearInterval(liveInterval);
    };

  }, [generateLiveReading]);

  /* =====================================================
     MANUAL CALCULATE METRICS
     ===================================================== */

  const calculateMetrics = async () => {

    setCalculating(true);

    try {

      const config =
        getAuthConfig();

      await api.post(
        "/api/metrics/simulate/1",
        {},
        config
      );

      await Promise.all([
        loadCalculatedMetrics(),
        loadRecentActivity(),
        loadSites(),
        loadTickets(),
      ]);

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

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return "Unknown date";

    }

    return date.toLocaleDateString(
      "en-CA"
    );

  };

  /* =====================================================
     FORMAT TIME
     ===================================================== */

  const formatActivityTime = (
    timestamp
  ) => {

    if (!timestamp) {
      return "";
    }

    const date =
      new Date(timestamp);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return "";

    }

    return date.toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }
    );

  };

  return (
    <PageLayout>

      <div className="dashboard-page">

        {/* =============================================
            WELCOME CARD
            ============================================= */}

        <section className="welcome-card">

          <div style={{ flex: 1 }}>

            <h1>
              Welcome back,{" "}
              {user?.username || "admin"}!
            </h1>

            <p>
              You are{" "}
              {user?.role || "SYSTEM ADMINISTRATOR"}
            </p>

            <span>
              Systems are currently operating
              with optimal efficiency.
            </span>

          </div>

          {/* live clock */}
          <div className="welcome-live-clock">
            <span className="live-pulse-dot" />
            <span className="live-label">LIVE</span>
            <span className="live-clock-time">
              {liveTime.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
            <span className="live-clock-date">
              {liveTime.toLocaleDateString("en-CA")}
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

          <div className={`metric-card metric-blue${flashedCards.has("dailyEnergy") ? " metric-card--flash metric-card--flash-blue" : ""}`}>
            <span>DAILY ENERGY</span>
            <strong>{metrics.dailyEnergy} <em className="metric-unit">kWh</em></strong>
            {flashedCards.has("dailyEnergy") && <span className="metric-updated-dot" />}
          </div>

          <div className={`metric-card metric-red${flashedCards.has("maintenance") ? " metric-card--flash metric-card--flash-red" : ""}`}>
            <span>MAINTENANCE COST</span>
            <strong>{metrics.maintenance}</strong>
            {flashedCards.has("maintenance") && <span className="metric-updated-dot" />}
          </div>

          <div className={`metric-card metric-green${flashedCards.has("efficiency") ? " metric-card--flash metric-card--flash-green" : ""}`}>
            <span>SYSTEM EFFICIENCY</span>
            <strong>{metrics.efficiency}</strong>
            {flashedCards.has("efficiency") && <span className="metric-updated-dot" />}
          </div>

          <div className="metric-card metric-yellow">
            <span>ACTIVE SITES</span>
            <strong>{metrics.activeSites}</strong>
          </div>

          <div className="metric-card metric-purple">
            <span>OPEN TICKETS</span>
            <strong>{metrics.openTickets}</strong>
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
              LIVE RECENT ACTIVITY
              =========================================== */}

          <div className="dashboard-panel">

            {/* panel header with LIVE badge */}
            <div className="activity-panel-header">
              <h2>Recent Activity</h2>
              <div className="activity-live-badge">
                <span className="live-pulse-dot" />
                <span>LIVE</span>
              </div>
            </div>

            {/* last-updated line */}
            {lastUpdated && (
              <div className="activity-last-updated">
                Updated {formatActivityTime(lastUpdated.toISOString())}
              </div>
            )}

            <div className="activity-list">

              {recentActivity.length > 0 ? (

                recentActivity.map(
                  (activity, index) => {
                    const isNew = newActivityIds.has(activity?.id);
                    const kwh = Number(activity?.energyGeneratedKwh || 0);
                    const isHigh = kwh > 5;

                    return (
                      <div
                        className={`activity-item${isNew ? " activity-item--new" : ""}`}
                        key={activity?.id || index}
                      >

                        <div className="activity-icon-col">
                          {isHigh ? "⚡" : "☀️"}
                        </div>

                        <div className="activity-body">
                          <small>
                            {formatActivityDate(
                              activity?.readingTimestamp
                            )}{" "}
                            {formatActivityTime(
                              activity?.readingTimestamp
                            )}
                          </small>
                          <p>Energy generated</p>
                          <span className={kwh > 0 ? "positive" : "negative"}>
                            {kwh > 0 ? "↑" : "↓"}{" "}
                            {kwh.toFixed(2)} kWh
                          </span>
                        </div>

                        <div className="activity-right-col">
                          <span className="activity-status activity-status--recorded">
                            ✓ Recorded
                          </span>
                          <span className={`activity-level-badge${isHigh ? " activity-level-badge--high" : ""}`}>
                            {isHigh ? "High" : "Normal"}
                          </span>
                        </div>

                      </div>
                    );
                  }
                )

              ) : (

                <div className="activity-item activity-item--empty">
                  <div className="activity-icon-col">🔄</div>
                  <div className="activity-body">
                    <small>Waiting for data…</small>
                    <p>No energy generation readings yet.</p>
                  </div>
                  <span className="activity-status">Waiting</span>
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
