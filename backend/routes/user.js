/**
 * All endpoints for User CRUD operations
 * Database is guaranteed to be connected before the app starts (See server/index.js)
 */
const User = require("../models/User.model.js");
const router = require("express").Router();

/**
 * Gets a user from MongoDB given an ObjectId.
 * Returns an object containing the user as well as a status and status message
 * @param {string} id
 * @returns {Object} User will be found in the `user` property if found. May have status 404 if not found or 200 if found
 */
function getUser(id) {
    const response = {
        status: 200,
        message: "User Found",
        user: null
    };
    return User.findById(id).exec()
        .then(user => {
            response.user = user;

            if(!user) {
                response.status = 404;
                response.message = "(404) User Not Found";
            }
            return response;
        }).catch(err => {
            response.status = 400;
            response.message = `(400) Cannot Lookup User (Check ID Length): ${err}`;
            return response;
        });
}

/**
 * POST request with a User object in the body will create a new user
 */
router.post("/add", (req, res) => {
    User.findOne({ email: req.body.email }).exec()
        .then(user => {
            if(user) {
                return res.status(400).json({
                    message: "User Already Exists",
                    id: user._id
                });
            }

            new User(req.body).save()
                .then(user => {
                    res.json({
                        message: "User Added",
                        id: user._id
                    });
                })
                .catch(err => {
                    res.status(400).send(`Unable to Add User\n(${err.code}) ${err.message}`);
                });
        });
});

/**
 * GET request with an email field will send the User object as JSON
 */
router.get("/get/:id", async (req, res) => {
    getUser(req.params.id)
        .then(lookup => {
            if(lookup.status !== 200) {
                return res.status(lookup.status).send(lookup.message);
            }

            res.json(lookup.user);
        });
});

router.route("/getbyuser/:email").get((req, res) => {
    User.find({ "email": req.params.email })
        .then(review => res.json(review))
        .catch(err => res.status(400).json("Error: " + err));
});


/**
 * PUT request with an email field will replace the current user data with the request body
 * NOTE: Changing emails is not allowed by this endpoint
 */
router.put("/update/:id", (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            user.email = req.body.email;
            user.majors = req.body.majors;
            user.minors = req.body.minors;
            user.clubs = req.body.clubs;
            user.years = req.body.years;
            user.jobs = req.body.jobs;
            user.GPA = req.body.GPA;

            user.save()
                .then(() => res.status(200).json("user updated!"))
                .catch(err => res.status(400).json("Error: " + err));
        });
});

/**
 * DELETE request with an email field will delete the user associated with that email
 */
router.delete("/delete/:id", (req, res) => {
    getUser(req.params.id)
        .then(lookup => {
            if(lookup.status === 200) {
                lookup.user.remove()
                    .then(() => {
                        res.send("Successfully Deleted User");
                    }).catch(err => {
                        res.status(400).send(`Unable to Delete User\n(${err.code}) ${err.message}`);
                    });
            } else {
                res.send("Nothing to Delete");
            }
        });
});

/**
 * Express Router instance containing all /user routes
 */
module.exports = router;