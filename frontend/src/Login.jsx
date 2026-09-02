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
        <div
            style={{
                width: "400px",
                margin: "80px auto",
                padding: "30px",
                border: "1px solid #ccc",
                borderRadius: "10px",
                fontFamily: "Arial"
            }}
        >
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>

                <div style={{ marginBottom: "15px" }}>
                    <label>Username</label>

                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                        required
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "5px"
                        }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>Password</label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        required
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "5px"
                        }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: "100%",
                        padding: "12px",
                        cursor: "pointer"
                    }}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                {error && (
                    <p style={{ color: "red" }}>
                        {error}
                    </p>
                )}

            </form>

            <p style={{ marginTop: "20px" }}>
                Don't have an account?{" "}

                <button onClick={() => navigate("/register")}>
                    Register
                </button>
            </p>
        </div>
    );
}

export default Login;