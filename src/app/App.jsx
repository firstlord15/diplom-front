import React from "react";
import { Route, Routes } from "react-router-dom";

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
                <Route
                    path="/"
                    element={
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
                <Route
                    path="/posts"
                    element={
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
                    }
                />
                <Route
                    path="/analytics"
                    element={
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
                    }
                />
            </Routes>
        </div>
    );
}

export default App;
