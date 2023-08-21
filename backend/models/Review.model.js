const mongoose = require("mongoose");

const review = new mongoose.Schema(
    {
        user_id: { type: String, required: true },
        course_id: { type: String, required: true },
        course_name: { type: String, required: true },
        prof_name: { type: String, required: true },

        // course Information
        quarter: { type: String, required: true },
        year: { type: String, required: true },
        format: { type: String, required: true },

        // general questions
        grade: { type: String, required: true },
        midterm: { type: Number, required: true },
        workload: { type: Number, required: true },
        lecture: { type: Number, required: true },

        // written response
        written: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("review", review);