import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register } from "./store/slices/authSlice";

function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error } = useSelector(state => state.auth);

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

        const result = await dispatch(register(formData));

        if (register.fulfilled.match(result)) {
            alert("Registration successful!");
            navigate("/login");
        }
    };

    return (
        <div style={{
            width: "400px",
            margin: "80px auto",
            padding: "30px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            fontFamily: "Arial"
        }}>

            <h2>Register</h2>

            <form onSubmit={handleSubmit}>

                <div style={{ marginBottom: "15px" }}>
                    <label>Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "5px"
                        }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
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
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "5px"
                        }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>Role</label>

                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "5px"
                        }}
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
                    style={{
                        width: "100%",
                        padding: "12px",
                        cursor: "pointer"
                    }}
                >
                    {loading ? "Registering..." : "Register"}
                </button>

                {error && (
                    <p style={{ color: "red" }}>
                        {error}
                    </p>
                )}

            </form>

            <p style={{ marginTop: "20px" }}>
                Already have an account?{" "}
                <button onClick={() => navigate("/login")}>
                    Login
                </button>
            </p>

        </div>
    );
}

export default Register;