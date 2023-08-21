// File exists for auth.js

const User = require("../models/User.model");

/**
 * Adds user if the user does not exist. Searches by email
 * @property {Object} newUser New user to add if they do not exist
 * @property {string} newUser.email Required email property
 */
function addUser(newUser) {
    return User.findOne({ email: newUser.email }).exec()
        .then(user => {
            if(user) {
                return;
            }

            console.log("Adding New User");
            console.log(newUser);

            return new User(newUser).save();
        });
}

module.exports = addUser;