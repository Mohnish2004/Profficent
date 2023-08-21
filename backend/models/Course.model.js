const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    crn: {
        type: [Object],
        required: true
    },
    subj: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    course_id: {
        type: String,
        required: true
    },
    instructor: {
        type: String,
        required: true
    },
    quarter: {
        type: String,
        required: true
    },
    reviews: {
        type: [String],
        required: true
    }
});

module.exports = mongoose.model("course_detail", CourseSchema);