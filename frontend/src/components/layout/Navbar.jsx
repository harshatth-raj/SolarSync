import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { logout } from "../../store/slices/authSlice";

function Navbar() {

    const user = useSelector(
        state => state.auth.user
    );

    const dispatch = useDispatch();
    const navigate = useNavigate();

    if (!user) {
        return null;
    }

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    return (
        <nav className="navbar">

            <div className="navbar-brand">
                SolarSync
            </div>

            <div className="nav-links">

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

            <div className="navbar-user">

                <span>
                    Welcome back! {user.username}
                </span>

                <button
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>

        </nav>
    );
}

export default Navbar;