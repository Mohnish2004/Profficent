/**
 * Combines all API endpoints
 * Database is guaranteed to be connected before the app starts (See server/index.js))
 */
const api = require("express").Router();

const userRouter = require("./routes/user");
api.use("/user", userRouter);

const reviewRouter = require("./routes/review");
api.use("/review", reviewRouter);

const commentRouter = require("./routes/comment");
api.use("/comment", commentRouter);

const courseRouter = require("./routes/course");
api.use("/courses", courseRouter);

const authRouter = require("./routes/auth");
api.use("/auth", authRouter);

const allClassRouter = require("./routes/allClasses");
api.use("/allClasses", allClassRouter);

module.exports = api;