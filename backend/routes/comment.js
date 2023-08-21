const Comment = require("../models/Comment.model.js");
const router = require("express").Router();

/**
 * POST request with a review object in the body will create a new review
 */
router.route("/add").post((req, res) => {
    const userID = req.body.userID;
    const reviewID = req.body.reviewID;
    const likes = req.body.likes;
    const comment = req.body.comment;
    const newComment = new Comment({
        userID,
        reviewID,
        likes,
        comment
    });

    newComment.save()
        .then(() => res.json("New review added!"))
        .catch(err => res.status(400).json("Error: " + err));
});

/**
 * GET request
 */
router.route("/get/:id").get((req, res) => {
    // id was located in params and not body
    Comment.findById(req.params.id) // CHANGED: from req.body.id to req.params.id
        .then(comment => res.json(comment))
        .catch(err => res.status(400).json("Error: " + err));
});


router.route("/getbyuser/:userID").get((req, res) => {
    // id was located in params and not body
    Comment.find({ "userID": req.params.userID }) // CHANGED: from req.body.id to req.params.id
        .then(comment => res.json(comment))
        .catch(err => res.status(400).json("Error: " + err));
});


/**
 * GET all
 */
router.route("/get-all-comment/").get((req, res) => {
    Comment.find()
        .then(comment => res.json(comment))
        .catch(err => res.status(400).json("Error: " + err));
});

/**
 * PUT request with an id field will update the review data
 */
router.route("/update/:id").put((req, res) => {
    Comment.findById(req.params.id) // CHANGED: from req.body.id to req.params.id
        .then(review => {
            review.userID = req.body.userID;
            review.likes = req.body.likes;
            review.comment = req.body.comment;
            review.reviewID = req.body.reviewID;

            review.save()
                .then(() => res.status(200).json("comment updated!"))
                .catch(err => res.status(400).json("Error: " + err));
        });
});

/**
 * DELETE a review by id
 */
router.route("/delete/:id").delete((req, res) => {
    Comment.findByIdAndDelete(req.params.id) // CHANGED: from req.body.id to req.params.id
        .then(comment => res.json(comment))
        .catch(err => res.status(400).json("Error: " + err));
});

// // This would delete all reviews belonging to the course with "courseName"
// reviewApi.route("/delete").post((req, res) => {
//     User.deleteMany({ courseName: req.body.courseName })
//         .then(function(){
//             return res.send("Course reviews deleted"); // Success
//         }).catch(function(error){
//             return res.send("Delete failed"); // Failure
//         });
// });

/**
 * Express App instance containing all /review routes
 */
module.exports = router;