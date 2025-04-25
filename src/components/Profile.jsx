import React from "react";
import "./css/Style.css";
import "./css/Profile.css";

const Profile = ({ data }) => {
    return (
        <div className="Profile">
            <div className="container">
                <div className="content border br-25 h-1000">
                    <div className="main-info">
                        <div className="profile-photo">
                            <img src="https://free-png.ru/wp-content/uploads/2021/12/free-png.ru-307.png" alt="avatar" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
