import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../store/slices/authSlice";

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error } = useSelector(
        (state) => state.auth
    );

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        dispatch(
            login({
                username,
                password
            })
        );
    };

    return (
        <div className="register-container">

            <div className="login-wrapper">

                <div className="login-side-text" aria-hidden="true">
                    <div className="login-side-line1">Monitor and optimize your solar assets with confidence.</div>
                    <div className="login-side-line2">Powering a cleaner, smarter energy future.</div>
                </div>

                <div className="register-card">

                    <h1>Welcome to SolarSync</h1>

                <form onSubmit={handleSubmit}>

                    {/* USERNAME */}

                    <div className="register-form-group">

                        <label>Username</label>

                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) =>
                                setUsername(e.target.value)
                            }
                            required
                        />

                    </div>


                    {/* PASSWORD */}

                    <div className="register-form-group">

                        <label>Password</label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />

                    </div>


                    {/* BACKEND ERROR */}

                    {error && (
                        <div className="register-error">
                            {error}
                        </div>
                    )}


                    {/* LOGIN BUTTON */}

                    <button
                        type="submit"
                        className="register-button"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>

                </form>


                {/* REGISTER */}

                <p className="register-switch">

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