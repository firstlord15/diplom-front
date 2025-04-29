import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Style.css";
import "./css/Login.css";
import { userService } from "../services/api";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            // Call the login API
            const response = await userService.login({
                username: formData.username,
                password: formData.password,
            });

            // Store the JWT token in localStorage
            localStorage.setItem("token", response.data.token);
            console.log("Сохраненный токен: ", localStorage.getItem("token"));

            // Redirect to the home page
            navigate("/");
        } catch (err) {
            console.error("Login error:", err);

            // Handle different error scenarios
            if (err.response && err.response.status === 401) {
                setError("Invalid username or password");
            } else if (err.response && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("An error occurred during login. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="Login">
            <div className="container">
                <div className="content">
                    <div className="decoration-circle top-right"></div>
                    <div className="decoration-circle bottom-left"></div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-header">
                            <h2>Login</h2>
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input type="text" className="form-control" id="username" required placeholder="Enter username" value={formData.username} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" className="form-control" id="password" required placeholder="Password" value={formData.password} onChange={handleChange} />
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {isLoading ? "Logging in..." : "Login"}
                        </button>

                        <div className="login-link">
                            New to Here? <a href="/register">Create an account</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
