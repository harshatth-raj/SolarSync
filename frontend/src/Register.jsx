import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { register } from "./store/slices/authSlice";

function Register() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        loading,
        error
    } = useSelector(state => state.auth);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        role: "SOLAR_OPERATOR"
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        const result = await dispatch(
            register(formData)
        );

        if (register.fulfilled.match(result)) {
            navigate("/login");
        }
    };

    return (
        <div className="login-container">

            <div className="login-card">

                <h1>SolarSync Register</h1>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        name="username"
                        placeholder="Enter your username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                    >
                        <option value="SOLAR_OPERATOR">
                            Solar Operator
                        </option>

                        <option value="MAINTENANCE_TECHNICIAN">
                            Maintenance Technician
                        </option>

                        <option value="SYSTEM_ADMINISTRATOR">
                            System Administrator
                        </option>
                    </select>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                    >
                        {loading
                            ? "Registering..."
                            : "Register"}
                    </button>

                    {error && (
                        <div className="error-msg">
                            {error}
                        </div>
                    )}

                </form>

                <p className="register-link">
                    Already have an account?{" "}
                    <span
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </span>
                </p>

            </div>

        </div>
    );
}

export default Register;