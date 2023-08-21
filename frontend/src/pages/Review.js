import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReviewItem from "../components/Profile/ReviewItem";
import lockIcon from "../images/icons/lock.svg";
import "../css/review.css";

function FindAverage(...nums) {
    return (nums.reduce((sum, num) => sum + num, 0) / nums.length).toFixed(2);
}

function Review() {
    const { id } = useParams();
    const [ClassInfo, setClassInfo] = useState(null);
    const [reviewIDs, setReviewsIDS] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [AvgRating, setAvg] = useState(0);
    // eslint-disable-next-line no-unused-vars
    const [DropDownTitle, setDropDownTitle] = useState("sort by");
    const [ratings, setRatings] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, "count": 0 });
    const loginRedirect = () => window.location = "/profile";

    const url = `${process.env.REACT_APP_SERVER_URL}/courses/get/${id}`;
    useEffect(() => {
        axios
            .get(url)
            .then(response => setClassInfo(response.data));
    }, [url]);

    useEffect(() => { // sets profid after fetching class info
        if(ClassInfo && reviewIDs.length === 0) {
            setReviewsIDS(ClassInfo.reviews);
            // fetchReviewData();
        }
    }, [ClassInfo]);

    useEffect(() => { // fetches data for professor after setting profid for profurl
        if(reviewIDs.length !== reviews.length) {
            fetchReviewData();
        }
    }, [reviewIDs]);

    const fetchReviewData = () => { // fetches class data using axios and class id
        const nonNullIds = [];
        if(reviewIDs.length !== reviews.length) {
            for(let i = 0; i < reviewIDs.length; i++) {
                if(reviewIDs[i] != null) {
                    console.log(reviewIDs[i]);
                    const full_review_url = `${process.env.REACT_APP_SERVER_URL}/review/get/${reviewIDs[i]}`;
                    axios.get(full_review_url)
                        .then(response => {
                            if(response.data != null) {
                                nonNullIds.push(reviewIDs[i]);
                                setReviews((prevReviews) => [...prevReviews, response.data,]);
                            }
                        });
                }
            }
        }
        if(nonNullIds.length !== reviewIDs.length) {
            setReviewsIDS(nonNullIds);
        }
    };

    useEffect(() => {
        if(reviews) {
            // console.log("reviews.length: " + reviews.length + " reviewIDs.length: " + reviewIDs.length);
            if(reviews.length > 0 && reviews.length === reviewIDs.length) {
                calculateRatings();
            }
        }

    }, [reviews]);

    const calculateRatings = () => {
        const _ratings = ratings;
        for(let i = 0; i < reviews.length; i++) { // Collects amount of ratings per number 1-5, and adds current num to AvgRating
            _ratings[reviews[i].midterm]++;
            _ratings[reviews[i].lecture]++;
            _ratings[reviews[i].workload]++;
            _ratings["count"] += 3;
        }

        setRatings(_ratings);
        setAvg(((ratings[1] * 1 + ratings[2] * 2 + ratings[3] * 3 + ratings[4] * 4 + ratings[5] * 5) / ratings["count"]).toFixed(2));
    };

    // eslint-disable-next-line no-unused-vars
    const handleSelect = (e) => {
        setDropDownTitle(e);
        if(e === "Low to High") {
            const sorted_data = reviews.sort((a, b) => {
                const overallRating1 = FindAverage(a.midterm, a.lecture, a.workload);
                const overallRating2 = FindAverage(b.midterm, b.lecture, b.workload);
                return overallRating1 < overallRating2 ? -1 : 1;
            });
            setReviews(sorted_data);
        } else if(e === "High to Low") {
            reviews.sort(function(a, b) {
                const overallRating1 = FindAverage(a.midterm, a.lecture, a.workload);
                const overallRating2 = FindAverage(b.midterm, b.lecture, b.workload);
                return overallRating1 < overallRating2 ? 1 : -1;
            });
            setReviews(reviews);
        } else if(e === "Newest First") {
            reviews.sort(function(a, b) {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                return dateB - dateA;
            });
            setReviews(reviews);
        } else if(e === "Oldest First") {
            reviews.sort(function(a, b) {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                return dateA - dateB;
            });
            setReviews(reviews);
        }
    };

    return (
        <div className="reviewPage">
            {ClassInfo &&
                <Row className="myRow">
                    <Col className="myCol" md={3}>
                        {reviews.length > 0 && reviews.length === reviewIDs.length &&
                            <button type="button" className="ReviewButton" onClick={() => window.location = `/review/write/${id}`}>
                                Review
                            </button>
                        }
                        <div className="ClassContainer"
                            style={{marginTop: reviews.length > 0 && reviews.length === reviewIDs.length ? "20px" : "-20px"}}>
                            <p className="CourseTitle">
                                {ClassInfo.course_id}
                            </p>
                            <p className="CourseSubTitle">
                                {ClassInfo.name}
                            </p>
                            <p className="CourseProfessor">
                                {ClassInfo.instructor}
                            </p>

                            <div className="rectangle">
                                <p className="OverallRating">
                                    Overall Rating
                                </p>
                                <div className="ratings">
                                    <p className="RatingLabelOne">
                                        {AvgRating}
                                    </p>
                                    <p className="RatingLabelTwo">
                                        /5
                                    </p>
                                </div>
                                <p className="NumRatings">
                                    Based on {reviews.length} reviews
                                </p>
                            </div>

                            <div className="bars">
                                <div className="test">
                                    <label className="starlabel" htmlFor="file">
                                        5
                                    </label>
                                    <progress className="progressbar" id="file"
                                        value={reviews.length === 0 ? 0 : ratings[5] / ratings["count"] * 100} max="100">
                                    </progress>
                                    <label className="percentage">
                                        {reviews.length === 0 ? 0 : Math.round(ratings[5] / ratings["count"] * 100)}%
                                    </label>
                                </div>

                                <div className="test">
                                    <label className="starlabel" htmlFor="file">
                                        4
                                    </label>
                                    <progress className="progressbar" id="file"
                                        value={reviews.length === 0 ? 0 : ratings[4] / ratings["count"] * 100} max="100">
                                    </progress>
                                    <label className="percentage">
                                        {reviews.length === 0 ? 0 : Math.round(ratings[4] / ratings["count"] * 100)}%
                                    </label>
                                </div>

                                <div className="test">
                                    <label className="starlabel" htmlFor="file">
                                        3
                                    </label>
                                    <progress className="progressbar" id="file"
                                        value={reviews.length === 0 ? 0 : ratings[3] / ratings["count"] * 100} max="100">
                                    </progress>
                                    <label className="percentage">
                                        {reviews.length === 0 ? 0 : Math.round(ratings[3] / ratings["count"] * 100)}%
                                    </label>
                                </div>

                                <div className="test">
                                    <label className="starlabel" htmlFor="file">
                                        2
                                    </label>
                                    <progress className="progressbar" id="file"
                                        value={reviews.length === 0 ? 0 : ratings[2] / ratings["count"] * 100} max="100">
                                    </progress>
                                    <label className="percentage">
                                        {reviews.length === 0 ? 0 : Math.round(ratings[2] / ratings["count"] * 100)}%
                                    </label>
                                </div>

                                <div className="test">
                                    <label className="starlabel" htmlFor="file">
                                        1
                                    </label>
                                    <progress className="progressbar" id="file"
                                        value={reviews.length === 0 ? 0 : ratings[1] / ratings["count"] * 100} max="100">
                                    </progress>
                                    <label className="percentage">
                                        {reviews.length === 0 ? 0 : Math.round(ratings[1] / ratings["count"] * 100)}%
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="AnonymousContainer">
                            <p className="anonText">
                                Anonymous Profile
                            </p>
                            <p className="anonParagraph">
                                Create an anonymous profile to help your
                                aggie peers to better grasp the context of
                                student reviews!
                            </p>
                            <img src={lockIcon} alt="Lock Icon"/>
                            <button type="button" className="create" onClick={loginRedirect}>
                                Create
                            </button>
                        </div>
                    </Col>
                    {reviews.length > 0 && reviews.length === reviewIDs.length &&
                        <Col className="review-component-col" md={8}>
                            {reviews.length > 0 && reviews.length === reviewIDs.length &&
                                reviews.map(review => {
                                    return (
                                        <ReviewItem item={review} course_name={ClassInfo.course_id} key={review._id}/>
                                    );
                                })
                            }
                        </Col>
                    }
                    {!(reviews.length > 0 && reviews.length === reviewIDs.length) &&
                        <Col className="review-component-col" md={9}>
                            <Container className=" review-container no-reviews-container">
                                <Row>
                                    <Col md={9}>
                                        <Row><p className="heading-text">There are no reviews for this class. Be the first to review! </p> </Row>
                                        <Row><p className="subheading-text">In the meantime, review other professors who teach {ClassInfo.course_id}.</p> </Row>
                                    </Col>
                                    <Col>
                                        <button type="button" className="ReviewButton noReviewButtonMoveDown" onClick={() => window.location = `/review/write/${id}`}>
                                            Review
                                        </button>
                                    </Col>
                                </Row>
                            </Container>
                        </Col>
                    }
                </Row>
            }
        </div>
    );
}

export default Review;