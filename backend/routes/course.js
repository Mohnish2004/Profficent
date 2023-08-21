const router = require("express").Router();
const Class = require("../models/Course.model.js");

// POST request (Creation of new class)
router.route("/add").post((req, res) => {
    const name = req.body.name;
    const crn = req.body.crn;
    const subj = req.body.subj;
    const code = req.body.code;
    const course_id = req.body.course_id;
    const instructor = req.body.instructor;
    const quarter = req.body.quarter;
    const reviews = req.body.reviews;

    const newClass = new Class({
        name,
        crn,
        subj,
        code,
        course_id,
        instructor,
        quarter,
        reviews
    });

    newClass.save()
        .then(() => res.json("New Class Added!"))
        .catch(err => res.status(400).json("Error: " + err));
});

// GET Request (Reading class data)
router.route("/get/:id").get((req, res) => {
    Class.findById(req.params.id)
        .then(Class => res.json(Class))
        .catch(err => res.status(400).json("Error: " + err));
});

/**
 * GET by professor
 */
router.route("/get-professor/:professor").get((req, res) => {
    // id was located in params and not body
    Class.find({ "professor": req.params.professor }) // CHANGED: from req.body.id to req.params.id
        .then(Class => res.json(Class))
        .catch(err => res.status(400).json("Error: " + err));
});

// /**
// * GET all
// */
// router.route("/get-all-professors").get((req, res) => {
//     Class.find()
//         .then(Class=>res.json(Class))
//         .catch(err=>res.status(400).json("Error: " + err));
// });

// UPDATE Request (update existing data)
router.route("/update/:id").put((req, res) => {
    const review_id = req.body.review_id;
    Class.findById(req.params.id)
        .then(Class => {
            // Class.name = req.body.name;
            // Class.crn = req.body.crn;
            // Class.subj = req.body.subj;
            // Class.code = req.body.code;
            // Class.course_id = req.body.course_id;
            // Class.instructor = req.body.instructor;
            // Class.quarter = req.body.quarter;
            // Class.reviews = req.body.reviews;
            Class.reviews = [...Class.reviews, review_id];

            Class.save()
                .then(() => res.status(200).json("Class Updated!"))
                .catch(err => res.status(400).json("Error: " + err));
            // .catch(err => {
            //     console.log(err);
            // });
        });
});

router.route("/remove-review/:course_id/:review_id").put((req, res) => {
    Class.findById(req.params.course_id)
        .then(Class => {
            const review_index = Class.reviews.indexOf(req.params.review_id);
            Class.reviews.splice(review_index, 1);
            Class.save()
                .then(() => res.status(200).json("Class Updated!"))
                .catch(err => res.status(400).json("Error: " + err));

        });
});

// DELETE Request (Delete data)
router.route("/delete/:id").delete((req, res) => {
    Class.findByIdAndDelete(req.params.id)
        .then(Class => res.json(Class))
        .catch(err => res.status(400).json("Error: " + err));
});

// TODO: GET ALL CLASSES
// TODO: GET BY SUBJECT
// TODO: GET BY SUBJECT + CODE
// TODO: GET BY SUBJECT + CODE + PROFESSOR

module.exports = router;