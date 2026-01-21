const express = require("express");
const Course = require("../models/Course");
const router = express.Router();

// GET: Get all courses
router.get("/", async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});

// POST: Create a new course
router.post("/", async (req, res) => {
  const course = await Course.create(req.body);
  res.json(course);
});

module.exports = router;
