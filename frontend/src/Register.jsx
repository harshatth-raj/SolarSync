import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register } from "./store/slices/authSlice";

function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "SOLAR_OPERATOR"
    });

    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSuccess("");

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        const registerData = {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            role: formData.role
        };

        const result = await dispatch(register(registerData));

        if (register.fulfilled.match(result)) {
            setSuccess("Registration successful! Redirecting to login...");

            setTimeout(() => {
                navigate("/login");
            }, 1200);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <h1>Register</h1>
                <p className="auth-subtitle">
                    Create your SolarSync account
                </p>

                <form onSubmit={handleSubmit}>

                    {/* Username */}
                    <div className="form-group">
                        <label>Username</label>

                        <input
                            type="text"
                            name="username"
                            placeholder="Enter username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="form-group">
                        <label>Email</label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="form-group">
                        <label>Password</label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="form-group">
                        <label>Confirm Password</label>

                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Role */}
                    <div className="form-group">
                        <label>Role</label>

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
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="auth-button"
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>

                </form>

                {error && (
                    <p className="auth-error">
                        {error}
                    </p>
                )}

                {success && (
                    <p className="auth-success">
                        {success}
                    </p>
                )}

                <p className="auth-switch">
                    Already have an account?{" "}

                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>
                </p>

            </div>

        </div>
    );
}

export default Register;