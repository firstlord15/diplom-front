import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Style.css";
import "./css/Register.css";
import { userService } from "../services/api";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value,
        });

        // Clear error when field is modified
        if (errors[id]) {
            setErrors({
                ...errors,
                [id]: "",
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Username validation
        if (formData.username.length < 5) {
            newErrors.username = "Username must be at least 5 characters long";
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        // Password validation
        if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters long";
        }

        // Confirm password validation
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Call the registration API
            const response = await userService.register({
                username: formData.username,
                email: formData.email,
                password: formData.password,
            });

            // Store the JWT token
            localStorage.setItem("token", response.data.token);

            // Redirect to login or home page
            navigate("/");
        } catch (err) {
            console.error("Registration error:", err);

            // Handle different error scenarios
            if (err.response && err.response.data) {
                // Backend validation errors
                if (err.response.data.username) {
                    setErrors((prev) => ({ ...prev, username: err.response.data.username }));
                }
                if (err.response.data.email) {
                    setErrors((prev) => ({ ...prev, email: err.response.data.email }));
                }
                if (err.response.data.password) {
                    setErrors((prev) => ({ ...prev, password: err.response.data.password }));
                }
                // General error message
                if (err.response.data.message) {
                    setErrors((prev) => ({ ...prev, general: err.response.data.message }));
                }
            } else {
                setErrors((prev) => ({ ...prev, general: "An error occurred during registration. Please try again." }));
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="Register">
            <div className="container">
                <div className="content">
                    {/* Decorative elements */}
                    <div className="decoration-circle top-right"></div>
                    <div className="decoration-circle bottom-left"></div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-header">
                            <h2>Create Account</h2>
                        </div>

                        {errors.general && <div className="error-message general-error">{errors.general}</div>}

                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input required type="text" className={`form-control ${errors.username ? "is-invalid" : ""}`} id="username" placeholder="Enter username" value={formData.username} onChange={handleChange} />
                            {errors.username && <small className="form-text error">{errors.username}</small>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email address</label>
                            <input required type="email" className={`form-control ${errors.email ? "is-invalid" : ""}`} id="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} />
                            {errors.email && <small className="form-text error">{errors.email}</small>}
                            <small className="form-text">We'll never share your email with anyone else.</small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input required type="password" className={`form-control ${errors.password ? "is-invalid" : ""}`} id="password" placeholder="Create a password" value={formData.password} onChange={handleChange} />
                            {errors.password && <small className="form-text error">{errors.password}</small>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input required type="password" className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`} id="confirmPassword" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} />
                            {errors.confirmPassword && <small className="form-text error">{errors.confirmPassword}</small>}
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {isLoading ? "Registering..." : "Register"}
                        </button>

                        <div className="login-link">
                            Already have an account? <a href="/login">Log in</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
