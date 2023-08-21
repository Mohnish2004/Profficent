import React, { useState } from "react";
import reviewTab from "../../images/icons/reviewIcon.svg";
import smile from "../../images/icons/smile.svg";
import "../../css/profile/ProfileSideMenu.css";

export default function ProfileSideMenu({ show, onProfileClick, onReviewsClick, profileActive, reviewsActive }) {
    const [activeStates, setActiveStates] = useState({
        profile: profileActive,
        reviews: reviewsActive
    });

    const profileClick = () => {
        setActiveStates({
            profile: true,
            reviews: false
        });
        onProfileClick();
    };

    const reviewsClick = () => {
        setActiveStates({
            profile: false,
            reviews: true
        });
        onReviewsClick();
    };

    return (
        <div className="profile-side-menu-wrapper">
            {show &&
                <div className="profile-side-menu-container">
                    <div className="profile-your-account-text">
                        Your Account
                    </div>
                    <div className="profile-side-button-container">
                        <a
                            href="#"
                            className={`profile-side-button-link ${activeStates.profile ? "profile-side-button-link-active" : ""}`}
                            role="button"
                            onClick={profileClick}
                        >
                            <div className="profile-side-button-link-text-div">
                                <img src={smile} alt="Smile Icon"/>
                                <p className="profile-side-button-link-text">
                                    profile
                                </p>
                            </div>
                        </a>
                    </div>
                    <div className="profile-side-button-container">
                        <a
                            href="#"
                            className={`profile-side-button-link ${activeStates.reviews ? "profile-side-button-link-active" : ""}`}
                            role="button"
                            onClick={reviewsClick}
                        >
                            <div className="profile-side-button-link-text-div">
                                <img src={reviewTab} alt="reviewTab"/>
                                <p className="profile-side-button-link-text">
                                    reviews
                                </p>
                            </div>
                        </a>
                    </div>
                </div>
            }
        </div>
    );
}