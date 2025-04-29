import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { userService } from "../services/api";

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setIsAuthenticated(false);
                setIsLoading(false);
                return;
            }

            try {
                // Verify token is valid by trying to get current user
                await userService.getCurrentUser();
                setIsAuthenticated(true);
            } catch (error) {
                console.error("Authentication error:", error);
                // Token is invalid, remove it
                localStorage.removeItem("token");
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        verifyToken();
    }, []);

    if (isLoading) {
        // You could render a spinner or loading component here
        return <div className="loading">Authenticating...</div>;
    }

    if (!isAuthenticated) {
        // Redirect to the login page with a return url
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
