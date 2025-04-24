import React from "react";
import "./css/Style.css";
import "./css/Minibar.css";
import Post from "../resource/post.jsx";
import Shedual from "../resource/shedual.jsx";
import Analytics from "../resource/analytics.jsx";
import { NavLink } from "react-router-dom";

const Minibar = () => {
    return (
        <div className="Minibar">
            <div className="mini-column">
                <div className="colum-center icons">
                    <NavLink className="minibar-icons-hover" to="/">
                        <Post className="minibar-icons" />
                    </NavLink>
                    <span className="minibar-icons-text">Посты</span>
                </div>

                <div className="colum-center icons">
                    <NavLink className="minibar-icons-hover" to="/">
                        <Shedual className="minibar-icons" />
                    </NavLink>
                    <span className="minibar-icons-text">План</span>
                </div>

                <div className="colum-center icons">
                    <NavLink className="minibar-icons-hover" to="/">
                        <Analytics className="minibar-icons" />
                    </NavLink>
                    <span className="minibar-icons-text">Анализ</span>
                </div>
            </div>
        </div>
    );
};

export default Minibar;
