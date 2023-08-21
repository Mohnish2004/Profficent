const mongoose = require("mongoose");

const AllClassesSchema = new mongoose.Schema(
    {
        name: { type: String },
        crn: { type: [Number] },
        subj: { type: String },
        code: { type: String },
        course_id: { type: String },
        instructor: { type: String },
        quarter: { type: String }
    },
    { collection: "course_details" }
);

module.exports = mongoose.model("allclasses", AllClassesSchema);