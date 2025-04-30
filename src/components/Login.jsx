import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Style.css";
import "./css/Login.css";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login, loading, error: authError } = useAuth();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [error, setError] = useState("");

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

        try {
            // Вызываем функцию входа из контекста аутентификации
            const success = await login({
                username: formData.username,
                password: formData.password,
            });

            if (success) {
                // Перенаправляем на главную страницу после успешного входа
                navigate("/profile");
            } else {
                setError(authError || "Ошибка входа в систему");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Произошла ошибка при входе. Пожалуйста, попробуйте снова.");
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

                        {(error || authError) && <div className="error-message">{error || authError}</div>}

                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input type="text" className="form-control" id="username" required placeholder="Enter username" value={formData.username} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" className="form-control" id="password" required placeholder="Password" value={formData.password} onChange={handleChange} />
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
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
