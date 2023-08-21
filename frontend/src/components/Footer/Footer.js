import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import facebook from "../../images/icons/footer/facebook.svg";
import linkedin from "../../images/icons/footer/linkedin.svg";
import medium from "../../images/icons/footer/medium.svg";
import insta from "../../images/icons/footer/insta.svg";
import logo_small from "../../images/logos/logo_small.svg";
import codelab from "../../images/icons/footer/codelab.svg";
import "../../css/footer.css";
// TODO: add <a> links
function Footer () {
    return (
        <div className="footer">
            <hr />
            <Container>
                <Row>
                    <Col xs={12} md={4} className="d-flex justify-content-center">
                        <div>
                            <Row>
                                <Col className="d-flex justify-content-start">
                                    <img src={logo_small} alt="logo_small" className="logo-icon"/>
                                    <p className="logo-text">Aggie Review</p>
                                </Col>
                            </Row>
                            <Row>
                                <p className="sub-text">We are a student run website whose goal is to create a helpful environment when reviewing course reviews. </p>
                            </Row>
                            <Row>
                                <Col className="d-flex justify-content-start">
                                    <p className="sub-text">Made by </p>
                                    <img src={codelab} alt="codelab_small" className="codelab-icon"/>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col xs={6} md={{span: 3, offset: 3}} className="d-flex justify-content-center">
                        <div>
                            <Row>
                                <p className="sub-title">Codelab</p>
                            </Row>
                            <Row>
                                <a href="https://www.codelabdavis.com/about">
                                    <p className="sub-text">About Us</p>
                                </a>
                            </Row>
                            <Row>
                                <a href="https://www.codelabdavis.com/contact">
                                    <p className="sub-text">Contact Us</p>
                                </a>
                            </Row>
                            <Row>
                                <a href="https://codelabdavis.medium.com/">
                                    <p className="sub-text">Medium</p>
                                </a>
                            </Row>
                        </div>
                    </Col>
                    <Col className="d-flex justify-content-center align-items-center">
                        <div>
                            <Row>
                                <Col>
                                    <a href="https://www.linkedin.com/company/codelabdavis/">
                                        <img src={linkedin} alt="linkedin" className="linkedin-icon"/>
                                    </a>
                                </Col>
                                <Col>
                                    <a href="https://codelabdavis.medium.com/">
                                        <img src={medium} alt="medium" className="medium-icon"/>
                                    </a>
                                </Col>
                                <Col>
                                    <a href="https://www.instagram.com/codelabdavis/">
                                        <img src={insta} alt="instagram" className="insta-icon"/>
                                    </a>
                                </Col>
                                <Col>
                                    <a href="https://www.facebook.com/CodeLabDavis">
                                        <img src={facebook} alt="facebook" className="fb-icon"/>
                                    </a>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
export default Footer;