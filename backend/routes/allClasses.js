const AllClasses = require("../models/AllClasses.model.js");
const router = require("express").Router();

router.route("/get-all-classes").get((req, res) => {
    AllClasses.find()
        .then(allClasses => res.json(allClasses))
        .catch(err => res.status(400).json("Error: " + err));
});

router.route("/get-all-classes-names").get((req, res) => {
    AllClasses.findById(req.params.course_id)
        .then(allClasses => res.json(allClasses))
        .catch(err => res.status(400).json("Error: " + err));
});


// GET Request (Reading class data)
router.route("/get/:id").get((req, res) => {
    AllClasses.findById(req.params.id)
        .then(course_details => res.json(course_details))
        .catch(err => res.status(400).json("Error: " + err));
});

/**
 * GET by professor
 */
router.route("/get-professor/:professor").get((req, res) => {
    // id was located in params and not body
    AllClasses.find({ "professor": req.params.instructor }) // CHANGED: from req.body.id to req.params.id
        .then(allClasses => res.json(allClasses))
        .catch(err => res.status(400).json("Error: " + err));
});


/**
 * GET by class AND professor
 */
router.route("/get-class-and-prof/:course_id/:instructor").get((req, res) => {
    // id was located in params and not body
    // , "instructor":req.params.instructor
    AllClasses.find({ "course_id": req.params.course_id, "instructor": req.params.instructor })
        .then(allClasses => res.json(allClasses))
        .catch(err => res.status(400).json("Error: " + err));
});


module.exports = router;