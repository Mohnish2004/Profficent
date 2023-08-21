const mongoose = require("mongoose");

/* Example ClassInfo Object
{
    “name” : “ECS 36A”,
    “professor” : “Aaron Kaloti”,
    “tags”: [“helpful”],
    “reviews” : [“this dude was super amazing.”, “homeworks were too hard : ( “, “lovely professor”],
    “ratings” : [4, 5, 3, 2, 5, 5]
}
 */

const ClassInfoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    professor: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        required: true
    },
    reviews: {
        type: [String],
        required: true
    },
    ratings: {
        type: [Number],
        required: true
    }
});

module.exports = mongoose.model("ClassInfo", ClassInfoSchema);