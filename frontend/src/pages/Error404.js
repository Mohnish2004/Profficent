import React from "react";
import { Col, Figure, Row } from "react-bootstrap";
import computer from "../images/icons/computerillustration.svg";
import logoPlusAggie from "../images/logos/logo.svg";

export default function Error404() {
    return (
        <Row className="my-auto">
            <Col>
                <Row>
                    <Col sm={1}> </Col>
                    <Col sm={5} className="my-auto">
                        <Row className="mx-auto">
                            <Row>
                                <Figure>
                                    <Figure.Image
                                        alt="Aggie Review Logo"
                                        src={logoPlusAggie}
                                    />
                                </Figure>
                            </Row>
                            <Row>
                                <h1>
                                    404 error
                                </h1>
                                <p>
                                    Sorry, the page you requested doesn't exist or an error occurred.
                                </p>
                            </Row>
                        </Row>
                    </Col>
                    <Col sm={5} className="d-block mx-auto">
                        <img src={computer} alt="404 Computer" className="d-block mx-auto"/>
                    </Col>
                    <Col></Col>
                </Row>
            </Col>
        </Row>
    );
}