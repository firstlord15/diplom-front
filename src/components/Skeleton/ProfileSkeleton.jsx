import "../css/Skeleton.css";

const ProfileSkeleton = () => {
    return (
        <div className="Profile">
            <div className="container">
                <div className="content br-25 h-1000">
                    <div className="profile-header">
                        <div className="skeleton-title"></div>
                        <div className="skeleton-button"></div>
                    </div>

                    <div className="profile-content">
                        <div className="profile-column left-column">
                            <div className="skeleton-avatar"></div>
                            <div className="skeleton-stats">
                                <div className="skeleton-stat"></div>
                                <div className="skeleton-stat"></div>
                                <div className="skeleton-stat"></div>
                            </div>
                        </div>

                        <div className="profile-column right-column">
                            <div className="skeleton-info">
                                <div className="skeleton-info-item"></div>
                                <div className="skeleton-info-item"></div>
                                <div className="skeleton-info-item"></div>
                                <div className="skeleton-info-item"></div>
                                <div className="skeleton-info-item"></div>
                            </div>

                            <div className="skeleton-activity">
                                <div className="skeleton-activity-header"></div>
                                <div className="skeleton-activity-item"></div>
                                <div className="skeleton-activity-item"></div>
                                <div className="skeleton-activity-item"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSkeleton;
