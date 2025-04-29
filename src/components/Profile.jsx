import React, { useState, useEffect } from "react";
import "./css/Style.css";
import "./css/Profile.css";
import { userService, postService, mediaService } from "../services/api";

const Profile = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        bio: "",
        location: "",
        website: "",
    });
    const [recentPosts, setRecentPosts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(profileData);
    const [error, setError] = useState(null);

    // Load user data when component mounts
    useEffect(() => {
        fetchUserData();
        fetchUserPosts();
    }, []);

    const fetchUserData = async () => {
        try {
            setIsLoading(true);
            const response = await userService.getCurrentUser();
            const userData = response.data;

            setProfileData({
                name: userData.username || "",
                email: userData.email || "",
                bio: userData.bio || "Content creator and social media manager",
                location: userData.location || "New York, USA",
                website: userData.website || "www.example.com",
            });

            setFormData({
                name: userData.username || "",
                email: userData.email || "",
                bio: userData.bio || "Content creator and social media manager",
                location: userData.location || "New York, USA",
                website: userData.website || "www.example.com",
            });

            setError(null);
        } catch (err) {
            console.error("Failed to fetch user data:", err);
            setError("Failed to load user profile. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUserPosts = async () => {
        try {
            const response = await postService.getPosts(0, 3);
            setRecentPosts(response.data.content || []);
        } catch (err) {
            console.error("Failed to fetch user posts:", err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            // Get user ID from current user or context
            const userResponse = await userService.getCurrentUser();
            const userId = userResponse.data.id;

            // Update user profile
            await userService.updateProfile(userId, {
                username: formData.name,
                email: formData.email,
                bio: formData.bio,
                location: formData.location,
                website: formData.website,
            });

            setProfileData(formData);
            setIsEditing(false);
            setError(null);
        } catch (err) {
            console.error("Failed to update profile:", err);
            setError("Failed to update profile. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !profileData.name) {
        return <div className="Profile">Loading profile data...</div>;
    }

    return (
        <div className="Profile">
            <div className="container">
                <div className="content br-25 h-1000">
                    {error && <div className="error-message">{error}</div>}

                    <div className="profile-header">
                        <h2>User Profile</h2>
                        {!isEditing && (
                            <button className="btn btn-primary edit-btn" onClick={() => setIsEditing(true)}>
                                Edit Profile
                            </button>
                        )}
                    </div>

                    <div className="profile-content">
                        <div className="profile-column left-column">
                            <div className="profile-photo">
                                <img src="https://free-png.ru/wp-content/uploads/2021/12/free-png.ru-307.png" alt="avatar" />
                                {isEditing && (
                                    <div className="photo-edit">
                                        <button className="btn btn-small">Change Photo</button>
                                    </div>
                                )}
                            </div>

                            <div className="profile-stats">
                                <div className="stat-item">
                                    <span className="stat-value">{recentPosts.length || 0}</span>
                                    <span className="stat-label">Posts</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">0</span>
                                    <span className="stat-label">Followers</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">0</span>
                                    <span className="stat-label">Following</span>
                                </div>
                            </div>
                        </div>

                        <div className="profile-column right-column">
                            {isEditing ? (
                                <form onSubmit={handleSubmit} className="profile-form">
                                    <div className="form-group">
                                        <label htmlFor="name">Name</label>
                                        <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="bio">Bio</label>
                                        <textarea className="form-control" name="bio" value={formData.bio} onChange={handleChange} rows={3} />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="location">Location</label>
                                        <input type="text" className="form-control" name="location" value={formData.location} onChange={handleChange} />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="website">Website</label>
                                        <input type="text" className="form-control" name="website" value={formData.website} onChange={handleChange} />
                                    </div>

                                    <div className="form-actions">
                                        <button type="submit" className="btn btn-primary">
                                            Save Changes
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => {
                                                setFormData(profileData);
                                                setIsEditing(false);
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="profile-details">
                                    <div className="profile-info-item">
                                        <span className="info-label">Name:</span>
                                        <span className="info-value">{profileData.name}</span>
                                    </div>
                                    <div className="profile-info-item">
                                        <span className="info-label">Email:</span>
                                        <span className="info-value">{profileData.email}</span>
                                    </div>
                                    <div className="profile-info-item">
                                        <span className="info-label">Bio:</span>
                                        <span className="info-value">{profileData.bio}</span>
                                    </div>
                                    <div className="profile-info-item">
                                        <span className="info-label">Location:</span>
                                        <span className="info-value">{profileData.location}</span>
                                    </div>
                                    <div className="profile-info-item">
                                        <span className="info-label">Website:</span>
                                        <span className="info-value">{profileData.website}</span>
                                    </div>
                                </div>
                            )}

                            <div className="recent-activity">
                                <h3>Recent Activity</h3>
                                {recentPosts.length > 0 ? (
                                    recentPosts.map((post) => (
                                        <div className="activity-item" key={post.id}>
                                            <div className="activity-icon">
                                                <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" width="24" height="24">
                                                    <path
                                                        d="M9 13H15M12.0627 6.06274L11.9373 5.93726C11.5914 5.59135 11.4184 5.4184 11.2166 5.29472C11.0376 5.18506 10.8425 5.10425 10.6385 5.05526C10.4083 5 10.1637 5 9.67452 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V15.8C3 16.9201 3 17.4802 3.21799 17.908C3.40973 18.2843 3.71569 18.5903 4.09202 18.782C4.51984 19 5.07989 19 6.2 19H17.8C18.9201 19 19.4802 19 19.908 18.782C20.2843 18.5903 20.5903 18.2843 20.782 17.908C21 17.4802 21 16.9201 21 15.8V10.2C21 9.0799 21 8.51984 20.782 8.09202C20.5903 7.71569 20.2843 7.40973 19.908 7.21799C19.4802 7 18.9201 7 17.8 7H14.3255C13.8363 7 13.5917 7 13.3615 6.94474C13.1575 6.89575 12.9624 6.81494 12.7834 6.70528C12.5816 6.5816 12.4086 6.40865 12.0627 6.06274Z"
                                                        strokeWidth="1"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="activity-text">
                                                <p>{post.title}</p>
                                                <span className="activity-time">{new Date(post.createdAt).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="activity-empty">
                                        <p>No recent activity to display</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
