import React, { useState } from "react";
import "./css/Style.css";
import "./css/Register.css";

const Register = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [passwordError, setPasswordError] = useState("");

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value,
        });

        // Clear password error when user types in either password field
        if (id === "password" || id === "confirmPassword") {
            setPasswordError("");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            setPasswordError("Passwords do not match");
            return;
        }

        // If passwords match, proceed with form submission
        // You can redirect to the desired page here
        window.location.href = "/login"; // Change this to your desired URL
    };

    return (
        <div className="Register">
            <div className="container">
                <div className="content">
                    {/* Декоративные элементы */}
                    <div className="decoration-circle top-right"></div>
                    <div className="decoration-circle bottom-left"></div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-header">
                            <h2>Create Account</h2>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email address</label>
                            <input required type="email" className="form-control" id="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} />
                            <small className="form-text">We'll never share your email with anyone else.</small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input required type="password" className="form-control" id="password" placeholder="Create a password" value={formData.password} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input required type="password" className="form-control" id="confirmPassword" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} />
                            {passwordError && <small className="form-text error">{passwordError}</small>}
                        </div>

                        <button type="submit" className="btn btn-primary">
                            Register
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
