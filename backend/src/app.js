const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/courses", require("./routes/course.routes"));
app.use("/api", require("./routes/enrollment.routes"));


app.get("/", (req, res) => {
  res.send("EduVillage Backend API is running");
});

module.exports = app;
