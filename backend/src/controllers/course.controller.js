const Course = require("../models/Course");

exports.createCourse = async (req, res) => {
  const course = await Course.create({
    ...req.body,
    createdBy: req.user.id
  });
  res.status(201).json(course);
};

exports.getCourses = async (req, res) => {
  const courses = await Course.findAll();
  res.json(courses);
};
