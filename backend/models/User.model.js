const mongoose = require("mongoose");

/* Example User Object
{
    "email": "example@example.com",
    "password": "12345",
    "name": {
        "firstName": "John",
        "lastName": "Doe"
    },
    "majors": ["Design"],
    "minors": [],
    "years": 2022,
    "GPA": "2.0",
    "clubs": ["Going Home Club"],
    "saved_courses": {
        "coursesName": ["ECS36A: Programming", "ECS36B: Object Oriented Programming", "ECS36C: Data Structures and Algorithms", "ECS20: Discrete Math"],
        "quarterTaught": ["Fall", "Winter", "Spring", "Winter"],
        "professorName": ["Butner", "Gygi", "Porquet" , "Rogaway"],
        "courseID": 1
    },
    "jobs": ["Student"]
}
*/

const SavedCourseSchema = new mongoose.Schema({
    professorName: {
        type: [String],
    },
    quarterTaught: {
        type: [String],
    },
    coursesName: {
        type: [String],
    },
    courseID: {
        type: [Number],
    }
});

const User = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    majors: {
        type: [String],
        required: true
    },
    minors: [String],
    years: Number,
    GPA: [String],
    clubs: {
        type: [String],
        required: true
    },
    saved_courses: [SavedCourseSchema],
    jobs: [String]
});

module.exports = mongoose.model("User", User);