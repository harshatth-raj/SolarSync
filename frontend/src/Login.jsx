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
            alert("Login successful!");
            navigate("/");
        }
    };

    return (
        <div className="login-container">

            <div className="login-card">

                <h1>Login</h1>

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
                        {loading ? "Logging in..." : "Login"}
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
                        Register
                    </button>
                </p>

            </div>

        </div>
    );
}

export default Login;