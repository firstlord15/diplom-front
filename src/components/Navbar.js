import { NavLink } from 'react-router-dom';
import React from 'react';
import './css/Navbar.css'

const Navbar = () => {
    return (
        <div>
            <nav className="navbar navbar-plus navbar-expand-lg navbar-dark bg-dark shadow-sm">
                <div className="container">
                    <NavLink className="navbar-brand brand-plus" to="/">
                        Game News
                    </NavLink>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <NavLink exact className="nav-link modern" aria-current="page" to="/">Home</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link modern" to="/About">About</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link modern" to="/Contacts">Contacts</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link modern" to="/Register">Register</NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;