import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "./store/slices/authSlice";

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error } = useSelector(state => state.auth);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await dispatch(
            login({
                username,
                password
            })
        );

        if (login.fulfilled.match(result)) {
            navigate("/");
        }
    };

    return (
        <div className="login-container">

            <div className="login-wrapper">

                <div className="login-side-text" aria-hidden="true">
                    <div className="login-side-line1">Monitor and optimize your solar assets with confidence.</div>
                    <div className="login-side-line2">Powering a cleaner, smarter energy future.</div>
                </div>

                <div className="login-card">

                    <h1>Welcome to SolarSync</h1>

                <form onSubmit={handleSubmit}>

                    <div className="login-form-group">

                        <label>Username</label>

                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            required
                        />

                    </div>

                    <div className="login-form-group">

                        <label>Password</label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>

                    {error && (
                        <p className="error-msg">
                            {error}
                        </p>
                    )}

                </form>

                <p className="register-link">
                    Don't have an account?{" "}

                    <button
                        type="button"
                        onClick={() => navigate("/register")}
                    >
                        Create account
                    </button>
                </p>

                </div>

            </div>

        </div>
    );
}

export default Login;