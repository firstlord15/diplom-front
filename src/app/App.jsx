import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "../components/Navbar";
import Main from "../components/Main";
import Minibar from "../components/Minibar";
import "./App.css";
import Login from "../components/Login";
import Register from "../components/Register";
import Profile from "../components/Profile";
import ProtectedRoute from "../components/ProtectedRoute";
import ProfileSkeleton from "../components/ProfileSkeleton";

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
                    path="/test"
                    element={
                        <div className="row container center">
                            <ProfileSkeleton />
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
            </Routes>
        </div>
    );
}

export default App;
