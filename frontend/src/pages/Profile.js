import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import axios from "axios";
import useUserObj from "../utils/useUserObj";
import ProfileSideMenu from "../components/Profile/ProfileSideMenu";
import ProfileReviewSection from "../components/Profile//ProfileReviewsSection";
import ProfileEditableSection from "../components/Profile//ProfileEdit";
import "../css/accountPage.css";
import "../css/savedCourses.css";
import "../css/yourReviews.css";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function Profile() {
    const { user } = useUserObj();
    const [showProfileSection, setShowProfileSection] = useState(true); // profile
    const showReviewSection = !showProfileSection;

    const [dataReviewArray, setDataReviewArray] = useState([]);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        const userReviewAPI = `${SERVER_URL}/review/getbyuser/${user._id}`;
        axios.get(userReviewAPI)
            .then(res => res.data)
            .then(reviewData => setDataReviewArray([...reviewData]));
    }, [user._id]);

    return (
        <div className="profile-page">
            <Row>
                <Col md={2}>
                    <ProfileSideMenu
                        show={true}
                        onProfileClick={() => setShowProfileSection(true)}
                        onReviewsClick={() => setShowProfileSection(false)}
                    />
                </Col>
                <Col>
                    <ProfileEditableSection
                        show={showProfileSection}
                        editMode={editMode}
                        setEditMode={setEditMode}
                    />

                    {showReviewSection && dataReviewArray.length === 0 &&
                        <div className="noReviews">
                            <p className="noReviewHeader">
                                You have not reviewed any courses yet.
                            </p>
                        </div>
                    }
                    <ProfileReviewSection
                        show={showReviewSection}
                        reviews={dataReviewArray}
                    />
                </Col>
            </Row>
        </div>
    );
}

export default Profile;