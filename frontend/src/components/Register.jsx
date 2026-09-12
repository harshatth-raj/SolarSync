import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register } from "../store/slices/authSlice";

function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error } = useSelector(
        state => state.auth
    );

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "SOLAR_OPERATOR"
    });

    const [success, setSuccess] = useState("");
    const [validationError, setValidationError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

        setValidationError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSuccess("");
        setValidationError("");

        const usernameRegex = /^[A-Za-z]+$/;

        if (!usernameRegex.test(formData.username)) {
            setValidationError(
                "Username must contain only letters (A-Z and a-z)."
            );
            return;
        }

        const uppercaseRegex = /[A-Z]/;
        const lowercaseRegex = /[a-z]/;
        const numberRegex = /[0-9]/;
        const specialCharacterRegex = /[#@$!*]/;

        if (!uppercaseRegex.test(formData.password)) {
            setValidationError(
                "Password must contain at least one uppercase letter."
            );
            return;
        }

        if (!lowercaseRegex.test(formData.password)) {
            setValidationError(
                "Password must contain at least one lowercase letter."
            );
            return;
        }

        if (!numberRegex.test(formData.password)) {
            setValidationError(
                "Password must contain at least one number."
            );
            return;
        }

        if (!specialCharacterRegex.test(formData.password)) {
            setValidationError(
                "Password must contain at least one special character (#, $, @, !, *)."
            );
            return;
        }

        if (
            formData.password !==
            formData.confirmPassword
        ) {
            setValidationError(
                "Passwords do not match."
            );
            return;
        }

        const registerData = {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            role: formData.role
        };

        const result = await dispatch(
            register(registerData)
        );

        if (register.fulfilled.match(result)) {

            setSuccess("Account created — redirecting to sign in...");

            setTimeout(() => {
                navigate("/login");
            }, 1200);
        }
    };

    return (
        <div className="register-container">

            <div className="register-card">

                <h1>Create account</h1>

                <p className="register-subtitle">
                    Join SolarSync to monitor sites, panels, and performance.
                </p>

                <p className="register-quote">Build reliable solar operations with data-driven insights.</p>

                <form onSubmit={handleSubmit}>

                    {/* USERNAME */}

                    <div className="register-form-group">

                        <label>Username</label>

                        <input
                            type="text"
                            name="username"
                            placeholder="Enter username"
                            value={formData.username}
                            onChange={handleChange}
                            pattern="[A-Za-z]+"
                            title="Username can contain only letters (A-Z and a-z)"
                            required
                        />

                    </div>


                    {/* EMAIL */}

                    <div className="register-form-group">

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


                    {/* PASSWORD */}

                    <div className="register-form-group">

                        <label>Password</label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                        <small className="password-requirements">
                            Password requirements:
                            <br />
                            • At least one uppercase letter
                            <br />
                            • At least one lowercase letter
                            <br />
                            • At least one digit
                            <br />
                            • At least one special character (#, $, @, !, *)
                        </small>

                    </div>


                    {/* CONFIRM PASSWORD */}

                    <div className="register-form-group">

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


                    {/* ROLE */}

                    <div className="register-form-group">

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


                    {/* VALIDATION ERROR */}

                    {validationError && (
                        <div className="register-error">
                            {validationError}
                        </div>
                    )}


                    {/* REGISTER BUTTON */}

                    <button
                        type="submit"
                        className="register-button"
                        disabled={loading}
                    >
                        {loading ? "Creating account..." : "Create account"}
                    </button>

                </form>


                {/* BACKEND ERROR */}

                {error && (
                    <div className="register-error">
                        {error}
                    </div>
                )}


                {/* SUCCESS */}

                {success && (
                    <div className="register-success">
                        {success}
                    </div>
                )}


                {/* LOGIN */}

                <p className="register-switch">

                    Already have an account?{" "}

                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                    >
                        Sign in
                    </button>

                </p>

            </div>

        </div>
    );
}

export default Register;
