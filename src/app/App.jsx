import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import "./App.css";
import Navbar from "../components/Navbar";
import Minibar from "../components/Minibar";
import Register from "../components/Register";
import PostPage from "../components/PostPage";
import Profile from "../components/Profile";
import Main from "../components/Main";
import Login from "../components/Login";
import PostDetail from "../components/PostDetailPage";
import ProtectedRoute from "../components/ProtectedRoute";

function App() {
    return (
        <div className="App">
            <Routes>
                {/* Публичные маршруты */}
                <Route
                    path="/login"
                    element={
                        <div className="row container center">
                            <Login />
                        </div>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <div className="row container center">
                            <Register />
                        </div>
                    }
                />
                {/* Защищенные маршруты */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <div className="wrapper">
                                <header className="App-header">
                                    <Navbar />
                                </header>
                                <main>
                                    <div className="row container center">
                                        <Minibar />
                                        <Main />
                                    </div>
                                </main>
                            </div>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <div className="wrapper">
                                <header className="App-header">
                                    <Navbar />
                                </header>
                                <main>
                                    <div className="row container center">
                                        <Minibar />
                                        <Profile />
                                    </div>
                                </main>
                            </div>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/posts"
                    element={
                        <ProtectedRoute>
                            <div className="wrapper">
                                <header className="App-header">
                                    <Navbar />
                                </header>
                                <main>
                                    <div className="row container center">
                                        <Minibar />
                                        <PostPage />
                                    </div>
                                </main>
                            </div>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/posts/:id"
                    element={
                        <ProtectedRoute>
                            <div className="wrapper">
                                <header className="App-header">
                                    <Navbar />
                                </header>
                                <main>
                                    <div className="row container center">
                                        <Minibar />
                                        <PostDetail />
                                    </div>
                                </main>
                            </div>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/shedules"
                    element={
                        <ProtectedRoute>
                            <div className="wrapper">
                                <header className="App-header">
                                    <Navbar />
                                </header>
                                <main>
                                    <div className="row container center">
                                        <Minibar />
                                    </div>
                                </main>
                            </div>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/analytics"
                    element={
                        <ProtectedRoute>
                            <div className="wrapper">
                                <header className="App-header">
                                    <Navbar />
                                </header>
                                <main>
                                    <div className="row container center">
                                        <Minibar />
                                    </div>
                                </main>
                            </div>
                        </ProtectedRoute>
                    }
                />
                {/* Перенаправление на логин при попытке доступа к несуществующему пути */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </div>
    );
}

export default App;
