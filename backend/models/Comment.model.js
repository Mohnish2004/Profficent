const mongoose = require("mongoose");

/* Example Comment Object
{
    userID: "620d590629429099c7a10905",
    reviewID: "62821006afb25a30781a6315"
    likes: number
    comment: "Lorem Ipsum"
}
 */

const comment = new mongoose.Schema(
    {
        userID: { type: String, required: true },
        reviewID: { type: String, required: true },
        likes: { type: [String], required: true },
        comment: { type: String, required: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model("comment", comment);