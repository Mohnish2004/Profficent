import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import SearchBar from "../components/NavBar/SearchBar";
import image1 from "../images/homepage/homepage1.svg";
import image2 from "../images/homepage/homepage2.svg";
import image3 from "../images/homepage/homepage3.svg";
import rectangle from "../images/PlaceholderRectange.svg";
import logo from "../images/logos/logo.svg";
import Footer from "../components/Footer/Footer";
import "../css/homepage.css";

function Home() {
    return (
        <div className="home">
            <Container>
                <Row className="divider-spacing1">
                    <Col className="push-logo-left">
                        <div className="logo-container d-flex justify-content-end">
                            <img src={logo} alt="Logo" className="logo"/>
                        </div>
                    </Col>
                    <Col className="push-logo-right">
                        <div className="logo-container d-flex justify-content-start">
                            <h1 className="title1">Aggie Review</h1>
                        </div>
                    </Col>
                </Row>
                <Row className="d-flex justify-content-center">
                    <p className="oneLineDescription">Aggie Review, a UC Davis platform for students <br/> to review courses and professors.</p>
                </Row>
                <Row className="d-flex justify-content-center">
                    <div className="searchbar-container">
                        <SearchBar/>
                    </div>
                </Row>
                <Row className="align-items-center divider-spacing2">
                    <Col md={8}>
                        <h1 className="title2">Helping Aggies find <br/> the perfect courses. </h1>
                        <img src={image1} alt="Response Image"/>
                    </Col>
                    <Col md={4}>
                        <p className="subtitle1">Never walk into a course unaware of what to expect</p>
                        <p className="subtitle2">Aggie Review provides you with a wide range of information on the course and its structure so that you can make the most of your academic experience.</p>
                    </Col>
                </Row>

                <Row className="align-items-center">
                    <Col md={6}>
                        {/* <p className="titlecontainer22">Questions catered for student reviewers like you to accurately reflect courses and professors for other students</p> */}
                        <p className="subtitle3">Protecting our Aggie community</p>
                        <p className="subtitle4">With Aggie Review your reviews and private information are always protected and kept anonymous from other Aggie viewers.</p>
                    </Col>
                    <Col md={6}>
                        <img src={image3} alt="Feedback Image"/>
                    </Col>
                </Row>

                <Row className="align-items-center">
                    <Col>
                        <img src={image2} alt="Profile Image"/>
                    </Col>
                    <Col>
                        {/* <Col><p className="titlecontainer23">Your ratings are always anonymous to viewers. With an added secure log-in feature tied to the school for the safety of  students</p></Col> */}
                        <p className="subtitle1 subtitle-margin1">Helping you write more objective reviews</p>
                        <p className="subtitle2 subtitle-margin2">Aggie Review guides you through the reviewing process so that you can better reflect on your courses and form a productive and objective review.</p>
                    </Col>
                </Row>

                <Row className="gettingStarted divider-spacing1">
                    <h2 className="heading-text">Get Started with Aggie Review</h2>
                    <Col className="padded-cols">
                        <Row> <img src={rectangle} alt="Rectangle"/> </Row>
                        <Row><p className="instruction-text">Click on the the search bar and enter the class name or the professor name you want to learn more about. </p></Row>
                    </Col>
                    <Col className="padded-cols">
                        <Row> <img src={rectangle} alt="Rectangle"/> </Row>
                        <Row><p className="instruction-text">Then a drop down menu will show up listing the professors and courses. Click on the option you are interested in. </p></Row>
                    </Col>
                    <Col className="padded-cols">
                        <Row> <img src={rectangle} alt="Rectangle"/> </Row>
                        <Row><p className="instruction-text text-padding">You will be directed to a full page dedicated to the professor or course you clicked on. To view a different option, click back into the search bar. </p></Row>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </div>
    );
}

export default Home;