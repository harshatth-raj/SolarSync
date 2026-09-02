import React, { useEffect } from "react";
import "./App.css";

import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import {
    useDispatch,
    useSelector
} from "react-redux";

import Login from "./Login";
import Register from "./Register";

import Navbar from "./components/layout/Navbar";

import SolarSiteList
    from "./components/sites/SolarSiteList";

import SolarSiteDetails
    from "./components/sites/SolarSiteDetails";

import MaintenanceTicketList
    from "./components/tickets/MaintenanceTicketList";

import StatCards
    from "./components/dashboard/StatCards";

import StatusDonut
    from "./components/dashboard/StatusDonut";

import RecentActivity
    from "./components/dashboard/RecentActivity";

import {
    fetchAnalytics,
    fetchRecentMetrics
} from "./store/slices/metricSlice";


/* =========================================
   DASHBOARD
========================================= */

function Dashboard() {

    const dispatch = useDispatch();

    const {
        analytics,
        recent,
        loading,
        error
    } = useSelector(
        state => state.metrics
    );

    const user = useSelector(
        state => state.auth.user
    );


    useEffect(() => {

        dispatch(
            fetchAnalytics()
        );

        dispatch(
            fetchRecentMetrics()
        );

    }, [dispatch]);


    return (

        <div className="dashboard-container">

            {/* =========================
                WELCOME SECTION
            ========================= */}

            <div className="welcome-card">

                <h1>
                    Welcome back, {user?.username}!
                </h1>

                <p>
                    Your role:{" "}
                    {user?.role}
                </p>

                <p>
                    SolarSync is currently
                    monitoring your solar
                    energy system.
                </p>

            </div>


            {/* =========================
                STATISTICS
            ========================= */}

            <StatCards
                stats={analytics}
            />


            {/* =========================
                DASHBOARD GRID
            ========================= */}

            <div className="dashboard-grid">

                <StatusDonut
                    analytics={analytics}
                />

                <RecentActivity
                    metrics={recent}
                />

            </div>


            {/* =========================
                LOADING
            ========================= */}

            {loading && (

                <p className="loading">
                    Loading dashboard data...
                </p>

            )}


            {/* =========================
                ERROR
            ========================= */}

            {error && (

                <p className="error-msg">
                    {error}
                </p>

            )}

        </div>

    );
}


/* =========================================
   PROTECTED ROUTE
========================================= */

function ProtectedRoute({ children }) {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    if (!user) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }

    return children;
}


/* =========================================
   APP
========================================= */

function App() {

    return (

        <BrowserRouter>

            {/* =========================
                NAVBAR
            ========================= */}

            <Navbar />


            <Routes>

                {/* =========================
                    LOGIN
                ========================= */}

                <Route
                    path="/login"
                    element={
                        <Login />
                    }
                />


                {/* =========================
                    REGISTER
                ========================= */}

                <Route
                    path="/register"
                    element={
                        <Register />
                    }
                />


                {/* =========================
                    DASHBOARD
                ========================= */}

                <Route
                    path="/"
                    element={

                        <ProtectedRoute>

                            <Dashboard />

                        </ProtectedRoute>

                    }
                />


                {/* =========================
                    SOLAR SITES
                ========================= */}

                <Route
                    path="/sites"
                    element={

                        <ProtectedRoute>

                            <SolarSiteList />

                        </ProtectedRoute>

                    }
                />


                {/* =========================
                    SITE DETAILS
                ========================= */}

                <Route
                    path="/sites/:id"
                    element={

                        <ProtectedRoute>

                            <SolarSiteDetails />

                        </ProtectedRoute>

                    }
                />


                {/* =========================
                    MAINTENANCE TICKETS
                ========================= */}

                <Route
                    path="/tickets"
                    element={

                        <ProtectedRoute>

                            <MaintenanceTicketList />

                        </ProtectedRoute>

                    }
                />

            </Routes>

        </BrowserRouter>

    );

}


export default App;