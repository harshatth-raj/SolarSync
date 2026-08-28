import React, { useEffect } from "react";

import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import { useDispatch } from "react-redux";

import Login from "./Login";

import Navbar from "./components/layout/Navbar";

import SolarSiteList
    from "./components/sites/SolarSiteList";

import MaintenanceTicketList
    from "./components/tickets/MaintenanceTicketList";

import {
    fetchAnalytics,
    fetchRecentMetrics
} from "./store/slices/metricSlice";


function Dashboard() {

    const dispatch = useDispatch();

    useEffect(() => {

        dispatch(fetchAnalytics());
        dispatch(fetchRecentMetrics());

    }, [dispatch]);

    return (
        <div className="container">

            <h1>
                SolarSync Dashboard
            </h1>

            <p>
                Solar Energy Consumption
                & Maintenance Tracker
            </p>

        </div>
    );
}


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


function App() {

    return (
        <BrowserRouter>

            <Navbar />

            <Routes>

                {/* LOGIN */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* DASHBOARD */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                {/* SOLAR SITES */}
                <Route
                    path="/sites"
                    element={
                        <ProtectedRoute>
                            <SolarSiteList />
                        </ProtectedRoute>
                    }
                />

                {/* MAINTENANCE TICKETS */}
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