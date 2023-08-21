import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import "../../css/reviewItem.css";
import "../../css/review.css";

function ReviewItem(props) {
    const date = new Date(props.item.createdAt);
    return (
        <Container className="review-container">
            <Row>
                <Col md={2} className="ratings-container">
                    <Row> <p className="overall-rating-title"> Overall Rating </p> </Row>
                    <Row> <p className="heading-text"> Midterm </p> </Row>
                    <Row> <p className="subheading-text"> {props.item.midterm}/5 </p> </Row>
                    <Row> <p className="heading-text"> Workload </p> </Row>
                    <Row> <p className="subheading-text"> {props.item.workload}/5 </p> </Row>
                    <Row> <p className="heading-text"> Lecture </p> </Row>
                    <Row> <p className="subheading-text"> {props.item.lecture}/5 </p> </Row>
                </Col>
                <Col className="response-container">
                    <Row>
                        <Col> <p className="subheading-text"> {props.course_name} </p> </Col>
                        <Col> <p className="subheading-text response-date"> {date.toLocaleString("default", { month: "long" })} {date.getDate()}, {date.getFullYear()} </p></Col>
                    </Row>
                    <Row>
                        <Col>
                            <p className="subheading-text"> Quarter: {props.item.quarter} {props.item.year} </p>
                        </Col>
                        <Col>
                            <p className="subheading-text"> Format: {props.item.format}</p>
                        </Col>
                        <Col>
                            <p className="subheading-text"> Grade: {props.item.grade}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p className="written-response-text"> {props.item.written} </p>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

export default ReviewItem;