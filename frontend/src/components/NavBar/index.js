import React from "react";
import { Col, Row } from "react-bootstrap";
import logo_small from "../../images/logos/logo_small.svg";
import SearchBar from "./SearchBar";
import profileIcon from "../../images/icons/profile.svg";
import useAuth, { getAuthStatus } from "../../utils/useAuth";

const Navbar = () => {
    const { logout } = useAuth(false);

    return(
        <div className="Navbar">
            <Row className="header-padding">
                <Col md={3}>
                    <a href="/">
                        <Row>
                            <Col md={4} className="d-flex justify-content-end">
                                <img src={logo_small} alt="Logo_small" className="logo-small"/>
                            </Col>
                            <Col className="d-flex justify-content-start">
                                <p className="header-logo-text">Aggie Review</p>
                            </Col>
                        </Row>
                    </a>
                </Col>
                <Col md={6}>
                    {window.location.pathname.split("/")[1] === "review" ? <SearchBar /> : null}
                </Col>
                <Col md={3} className="d-flex justify-content-end profile-container">
                    {
                        getAuthStatus().status === "Good" ?
                            <Row>
                                <Col md={4}>
                                    <a href="/profile">
                                        <img src={profileIcon} alt="Profile Icon" className="profile"/>
                                    </a>
                                </Col>
                                <Col md={8}>
                                    <div className="login-logout-button" onClick={logout}>
                                        <p className="header-text login-logout-text">Log Out</p>
                                    </div>
                                </Col>
                            </Row>
                            :
                            <Row>
                                <a href="/profile">
                                    <div className="login-logout-button">
                                        <p className="header-text login-logout-text">Login</p>
                                    </div>
                                </a>
                            </Row>
                    }
                </Col>
            </Row>
            <hr />
        </div>
    );
};

export default Navbar;