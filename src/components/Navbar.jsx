import { NavLink } from "react-router-dom";
import React from "react";
import Logo from "../resource/logo";
import "./css/Navbar.css";
import "./css/Style.css";

const Navbar = () => {
    return (
        <div className="Navbar">
            <nav className="">
                <div className="container navbar">
                    <div>
                        <div className="logo">
                            {/* <NavLink className="logo-text" to="/">
                            Publisher
                        </NavLink> */}
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
                                <li className="nav-link">
                                    <div className="link-ease-in-out">
                                        <NavLink className="" to="/login">
                                            login
                                        </NavLink>
                                    </div>
                                </li>
                                <li className="nav-link">
                                    <div className="link-ease-in-out">
                                        <NavLink className="" to="/Contacts">
                                            Contacts
                                        </NavLink>
                                    </div>
                                </li>
                                <li className="nav-link">
                                    <div className="link-ease-in-out">
                                        <NavLink className="" to="/Register">
                                            Register
                                        </NavLink>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
