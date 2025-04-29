import React, { createContext, useState, useEffect, useContext } from "react";
import { userService } from "../services/api";

// Создаем контекст для аутентификации
const AuthContext = createContext(null);

// Создаем провайдер для контекста
export const AuthProvider = ({ children }) => {
    // Пытаемся получить данные пользователя из localStorage при инициализации
    const [currentUser, setCurrentUser] = useState(() => {
        const savedUser = localStorage.getItem("currentUser");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Проверяем, аутентифицирован ли пользователь
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setCurrentUser(null);
                setLoading(false);
                return;
            }

            try {
                // Если у нас нет данных пользователя или мы хотим обновить их
                if (!currentUser) {
                    const response = await userService.getCurrentUser();
                    const userData = response.data;
                    setCurrentUser(userData);
                    // Сохраняем данные пользователя в localStorage
                    localStorage.setItem("currentUser", JSON.stringify(userData));
                }
            } catch (err) {
                console.error("Auth check error:", err);
                // При ошибке аутентификации удаляем токен и данные пользователя
                localStorage.removeItem("token");
                localStorage.removeItem("currentUser");
                setCurrentUser(null);
                setError("Сессия истекла. Пожалуйста, войдите снова.");
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Функция для входа пользователя
    const login = async (credentials) => {
        try {
            setLoading(true);
            const response = await userService.login(credentials);
            localStorage.setItem("token", response.data.token);

            // Получаем данные текущего пользователя после успешного входа
            const userResponse = await userService.getCurrentUser();
            const userData = userResponse.data;
            setCurrentUser(userData);

            // Сохраняем данные пользователя в localStorage
            localStorage.setItem("currentUser", JSON.stringify(userData));

            setError(null);
            return true;
        } catch (err) {
            console.error("Login error:", err);
            setError(err.response?.data?.message || "Ошибка входа в систему.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Функция для регистрации пользователя
    const register = async (userData) => {
        try {
            setLoading(true);
            const response = await userService.register(userData);
            localStorage.setItem("token", response.data.token);

            // Получаем данные текущего пользователя после успешной регистрации
            const userResponse = await userService.getCurrentUser();
            const newUserData = userResponse.data;
            setCurrentUser(newUserData);

            // Сохраняем данные пользователя в localStorage
            localStorage.setItem("currentUser", JSON.stringify(newUserData));

            setError(null);
            return true;
        } catch (err) {
            console.error("Registration error:", err);
            setError(err.response?.data?.message || "Ошибка регистрации.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Функция для выхода пользователя
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        setCurrentUser(null);
    };

    // Значение, предоставляемое контекстом
    const value = {
        currentUser,
        loading,
        error,
        login,
        register,
        logout,
        // Добавляем функцию обновления данных пользователя
        refreshUserData: async () => {
            try {
                const response = await userService.getCurrentUser();
                const userData = response.data;
                setCurrentUser(userData);
                localStorage.setItem("currentUser", JSON.stringify(userData));
                return userData;
            } catch (err) {
                console.error("Error refreshing user data:", err);
                throw err;
            }
        },
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Хук для использования контекста аутентификации
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth должен использоваться внутри AuthProvider");
    }
    return context;
};

export default AuthContext;
