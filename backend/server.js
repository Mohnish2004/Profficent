const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

require("dotenv").config();

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL;
const ATLAS_URI = process.env.ATLAS_URI;
if(!ATLAS_URI) {
    console.log("===== No ATLAS_URI Set. Make sure to set your .env file correctly =====");
    process.exit(0);
}

const app = express();
// TODO: Changed hardcoded URL
app.use(cors({
    credentials: true,
    origin: CLIENT_URL
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/", require("./api"));
// Add 404 to Server
app.use((req, res) => {
    res.status(404).send("404: Resource Not Found");
});

console.log("===============================================");
console.log("=============== Starting Server ===============");

mongoose.connect(ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;

connection.once("open", () => {
    // Guarantee that the database is connected before starting the server
    console.log("======= MongoDB Successfully Connected ========");
    console.log(`========== Starting API on Port ${PORT} ==========`);
    console.log(`====== Running on http://localhost:${PORT} =======`);
    console.log("===============================================");
    app.listen(PORT);
});

connection.on("error", err => {
    console.log("========== Database Failed to Start ===========");
    console.log(err);
});