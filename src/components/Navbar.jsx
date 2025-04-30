import { NavLink, useNavigate } from "react-router-dom";
import React from "react";
import Logo from "../resource/logo";
import "./css/Navbar.css";
import "./css/Style.css";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="Navbar">
            <nav className="">
                <div className="container navbar">
                    <div>
                        <div className="logo">
                            <NavLink to="/">
                                <Logo className="logo-img" />
                            </NavLink>
                        </div>
                        <div className="">
                            <ul className="nav-links">
                                <li className="nav-link">
                                    <div className="link-ease-in-out">
                                        <NavLink className="" to="/">
                                            Home
                                        </NavLink>
                                    </div>
                                </li>

                                {currentUser ? (
                                    // Меню для аутентифицированных пользователей
                                    <>
                                        <li className="nav-link">
                                            <div className="link-ease-in-out">
                                                <NavLink className="" to="/profile">
                                                    Profile
                                                </NavLink>
                                            </div>
                                        </li>
                                        <li className="nav-link">
                                            <div>
                                                <button className="btn btn-loggout" onClick={handleLogout}>
                                                    Logout
                                                </button>
                                            </div>
                                        </li>
                                    </>
                                ) : (
                                    // Меню для гостей
                                    <>
                                        <li className="nav-link">
                                            <div className="link-ease-in-out">
                                                <NavLink className="" to="/login">
                                                    Login
                                                </NavLink>
                                            </div>
                                        </li>
                                        <li className="nav-link">
                                            <div className="link-ease-in-out">
                                                <NavLink className="" to="/register">
                                                    Registration
                                                </NavLink>
                                            </div>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
