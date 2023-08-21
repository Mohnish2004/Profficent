import React, {useEffect, useState} from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { TrashFill } from "react-bootstrap-icons";
import axios from "axios";
import ReviewItem from "./ReviewItem";
import "../../css/profile/ProfileReviewSection.css";

export default function ProfileReviewSection({ show, reviews }) {
    const [courseNames, setCourses] = useState({});
    const [courseIDs, setCourseIDs] = useState({});
    const [showEditReviewPrompt, setShowEditReviewPrompt] = useState(false); // edit
    const [showDeleteReviewPrompt, setShowDeleteReviewPrompt] = useState(false); // delete
    const [reviewID, setID] = useState("");
    const [focusReview, setFocusReview] = useState();

    // for edit review
    const [_quarter, setQuarter] = useState();
    const [_year, setYear] = useState();
    const [_format, setFormat] = useState();
    const [_grade, setGrade] = useState();
    const [_midterm, setMidterm] = useState();
    const [_workload, setWorkload] = useState();
    const [_lecture, setLecture] = useState();
    const [_written, setWritten] = useState();

    useEffect(() => {
        for (let i = 0; i < reviews.length; i++) {
            axios
                .get(`${process.env.REACT_APP_SERVER_URL}/courses/get/${reviews[i].course_id}`)
                .then(course => {
                    courseNames[reviews[i]._id.toString()] = course.data.course_id;
                    courseIDs[reviews[i]._id.toString()] = course.data._id;
                    setCourses(courseNames);
                    setCourseIDs(courseIDs);
                });
        }

    }, [reviews]);

    useEffect(() => {
        if (focusReview) {
            setQuarter(focusReview.quarter);
            setYear(focusReview.year);
            setFormat(focusReview.format);
            setGrade(focusReview.grade);
            setMidterm(focusReview.midterm);
            setWorkload(focusReview.workload);
            setLecture(focusReview.lecture);
            setWritten(focusReview.written);
        }

    }, [focusReview]);

    const editReview = () => {
        if (_year.length < 4 || _year[0] !== "2") {
            setYear(focusReview.year);
        }

        if (_written.length === 0) {
            setWritten(focusReview.written);
        }

        axios.put(`${process.env.REACT_APP_SERVER_URL}/review/update/${reviewID}`,
            {
                user_id: focusReview.user_id,
                course_id: focusReview.course_id,
                course_name: focusReview.course_name,
                prof_name: focusReview.prof_name,

                quarter: _quarter,
                year: _year,
                format: _format,

                grade: _grade,
                midterm: _midterm,
                workload: _workload,
                lecture: _lecture,
                written: _written
            });

        cancelEdit();
        window.location=`review/${focusReview.course_id}`;

    };

    const deleteReview = () => {
        axios.put(`${process.env.REACT_APP_SERVER_URL}/courses/remove-review/${focusReview.course_id}/${reviewID}`);
        axios
            .delete(`${process.env.REACT_APP_SERVER_URL}/review/delete/${reviewID}`)
            .then(console.log("deleted!"))
            .catch((error) => { console.log(error); });
        cancelDelete();
        window.location=`review/${focusReview.course_id}`;
    };

    const cancelDelete = () => {
        setShowDeleteReviewPrompt(false);
        setID("");
        setFocusReview(null);
    };

    const cancelEdit = () => {
        setShowEditReviewPrompt(false);
        setID("");
        setFocusReview(null);
    };

    return show && reviews.length > 0 ?
        <div>
            <Col className="review-section">
                {reviews.map(review =>
                    <Row key={review._id}>
                        <div  className="my-review-container">
                            <ReviewItem item={review} course_name={courseNames[review._id]}/>
                            <div className="edit-icon-col">
                                <button className="edit-icon" onClick={() => { setShowEditReviewPrompt(true); setID(review._id); setFocusReview(review); }}/>
                                <TrashFill size={20} className="trash-icon" onClick={() => { setShowDeleteReviewPrompt(true); setFocusReview(review); setID(review._id); }}/>
                            </div>
                        </div>
                    </Row>
                )}
            </Col>
            <div>
                <Modal
                    centered
                    show={showEditReviewPrompt}
                    onHide={cancelEdit}
                    size="lg"
                >
                    <Modal.Header className="modal-title" closeButton>
                        <Modal.Title>Edit Review</Modal.Title>
                    </Modal.Header>

                    <Modal.Body className="modal-body">
                        { focusReview &&
                            <div>
                                <Row>
                                    <p className="heading-text">{focusReview.course_name}</p>
                                </Row>
                                <Row>
                                    <p className="subheading-text">{focusReview.prof_name}</p>
                                </Row>
                                <Row>
                                    <Col>
                                        <Row className="form-sub-container">
                                            <Col md={3}>
                                                <p className="subheading-text"> Quarter </p>
                                            </Col>
                                            <Col>
                                                <Form.Select
                                                    aria-label="quarter"
                                                    size="sm"
                                                    defaultValue={_quarter}
                                                    onChange={(e) => setQuarter(e.target.value)}
                                                >
                                                    <option value="FQ">Fall</option>
                                                    <option value="WQ">Winter</option>
                                                    <option value="SQ">Spring</option>
                                                    <option value="SS1">Summer Session 1</option>
                                                    <option value="SS2">Summer Session 2</option>
                                                </Form.Select>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col>
                                        <Row className="form-sub-container">
                                            <Col md={2}>
                                                <p className="subheading-text"> Year </p>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    size = "sm"
                                                    defaultValue={_year}
                                                    type="number"
                                                    placeholder="Year"
                                                    aria-label="year"
                                                    onChange={(e) => setYear(e.target.value)}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Row className="form-sub-container">
                                            <Col md={3}>
                                                <p className="subheading-text"> Format </p>
                                            </Col>
                                            <Col>
                                                <Form.Select
                                                    aria-label="format"
                                                    size="sm"
                                                    defaultValue={_format}
                                                    onChange={(e) => setFormat(e.target.value)}
                                                >
                                                    <option value="in-person">In-person</option>
                                                    <option value="online">Online</option>
                                                    <option value="hybrid">Hybrid</option>
                                                </Form.Select>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col>
                                        <Row className="form-sub-container">
                                            <Col md={3}>
                                                <p className="subheading-text"> Grade </p>
                                            </Col>
                                            <Col>
                                                <Form.Select
                                                    aria-label="grade"
                                                    size="sm"
                                                    defaultValue={_grade}
                                                    onChange={(e) => setGrade(e.target.value)}
                                                >
                                                    <option value="A+">A+</option>
                                                    <option value="A">A</option>
                                                    <option value="A-">A-</option>
                                                    <option value="B+">B+</option>
                                                    <option value="B">B</option>
                                                    <option value="B-">B-</option>
                                                    <option value="C+">C+</option>
                                                    <option value="C">C</option>
                                                    <option value="C-">C-</option>
                                                    <option value="D+">D+</option>
                                                    <option value="D">D</option>
                                                    <option value="D-">D-</option>
                                                    <option value="F">F</option>
                                                </Form.Select>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="form-sub-container2">
                                        <p className="subheading-text"> How well did the midterms reflect the material of the course? </p>
                                        <Form.Select
                                            aria-label="midterm"
                                            size="sm"
                                            defaultValue={_midterm}
                                            onChange={(e) => setMidterm(e.target.value)}
                                        >
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                        </Form.Select>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="form-sub-container2">
                                        <p className="subheading-text"> Is the workload in this course manageable? </p>
                                        <Form.Select
                                            aria-label="workload"
                                            size="sm"
                                            defaultValue={_workload}
                                            onChange={(e) => setWorkload(e.target.value)}
                                        >
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                        </Form.Select>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="form-sub-container2">
                                        <p className="subheading-text"> What would you rate the quality of the lectures? </p>
                                        <Form.Select
                                            aria-label="lecture"
                                            size="sm"
                                            defaultValue={_lecture}
                                            onChange={(e) => setLecture(e.target.value)}
                                        >
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                        </Form.Select>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="form-sub-container2">
                                        <p className="subheading-text"> Elaborate on your experience with the course. </p>
                                        <Form.Control
                                            defaultValue={_written}
                                            as="textarea"
                                            rows={2}
                                            placeholder="Written Response"
                                            aria-label="written"
                                            onChange={(e) => setWritten(e.target.value)}
                                        />
                                    </Col>
                                </Row>
                            </div>
                        }
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={cancelEdit}>Cancel</Button>
                        <Button variant="primary" onClick={editReview}>Save Changes</Button>
                    </Modal.Footer>
                </Modal>
            </div>
            <div>
                <Modal
                    centered
                    show={showDeleteReviewPrompt}
                    onHide={cancelDelete}
                >
                    <Modal.Header className="modal-title" closeButton>
                        <Modal.Title>Delete Review</Modal.Title>
                    </Modal.Header>

                    <Modal.Body className="modal-body">
                        Are you sure you want to delete this review? This can't be undone!
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={cancelDelete}>Cancel</Button>
                        <Button variant="primary" onClick={deleteReview}>Delete</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
        : null;
}