const Review = require("../models/Review.model.js");
const router = require("express").Router();

/**
 * POST request with a review object in the body will create a new review
 */
router.route("/add").post((req, res) => {
    const user_id = req.body.user_id;
    const course_id = req.body.course_id;
    const course_name = req.body.course_name;
    const prof_name = req.body.prof_name;

    // course Information
    const quarter = req.body.quarter;
    const year = req.body.year;
    const format = req.body.format;

    // general questions
    const grade = req.body.grade;
    const midterm = req.body.midterm;
    const workload = req.body.workload;
    const lecture = req.body.lecture;
    const written = req.body.written;

    const newreview = new Review({
        user_id,
        course_id,
        course_name,
        prof_name,
        quarter,
        year,
        format,
        grade,
        midterm,
        workload,
        lecture,
        written
    });

    newreview.save()
        .then(() => res.json({
            id: newreview._id,
        }))
        .catch(err => res.status(400).json("Error: " + err));
});

/**
 * GET request
 */
router.route("/get/:id").get((req, res) => {
    // id was located in params and not body
    Review.findById(req.params.id) // CHANGED: from req.body.id to req.params.id
        .then(review => res.json(review))
        .catch(err => res.status(400).json("Error: " + err));
});

/**
 * GET by course (DEPRECATED)
 */
router.route("/getclass/:course_id").get((req, res) => {
    // id was located in params and not body
    Review.find({ "course_id": req.params.course_id })
        .then(review => res.json(review))
        .catch(err => res.status(400).json("Error: " + err));
});

router.route("/getbyuser/:user_id").get((req, res) => {
    // id was located in params and not body
    Review.find({ "user_id": req.params.user_id })
        .then(review => res.json(review))
        .catch(err => res.status(400).json("Error: " + err));
});

router.route("/get-by-user-and-course/:user_id/:course_id").get((req, res) => {
    // id was located in params and not body
    Review.find({ "user_id": req.params.user_id, "course_id": req.params.course_id })
        .then(review => res.json(review))
        .catch(err => res.status(400).json("Error: " + err));
});

router.route("/getprof/:prof_name").get((req, res) => {
    // id was located in params and not body
    Review.find({ "prof_name": req.params.prof_name })
        .then(review => res.json(review))
        .catch(err => res.status(400).json("Error: " + err));
});

/**
 * GET all
 */
router.route("/get-all-reviews/").get((req, res) => {
    Review.find()
        .then(review => res.json(review))
        .catch(err => res.status(400).json("Error: " + err));
});

/**
 * PUT request with an id field will update the review data
 */
router.route("/update/:id").put((req, res) => {
    Review.findById(req.params.id) // CHANGED: from req.body.id to req.params.id
        .then(review => {
            review.user_id = req.body.user_id;
            review.course_id = req.body.course_id;
            review.course_name = req.body.course_name;
            review.prof_name = req.body.prof_name;

            // course Information
            review.quarter = req.body.quarter;
            review.year = req.body.year;
            review.format = req.body.format;

            // general questions
            review.grade = req.body.grade;
            review.midterm = req.body.midterm;
            review.workload = req.body.workload;
            review.lecture = req.body.lecture;
            review.written = req.body.written;

            review.save()
                .then(() => res.status(200).json("review updated!"))
                .catch(err => res.status(400).json("Error: " + err));
        });
});

/**
 * DELETE a review by id
 */
router.route("/delete/:id").delete((req, res) => {
    Review.findByIdAndDelete(req.params.id) // CHANGED: from req.body.id to req.params.id
        .then(review => res.json(review))
        .catch(err => res.status(400).json("Error: " + err));
});

/**
 * Express App instance containing all /review routes
 */
module.exports = router;