const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  classNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  subjects: [{
    type: String,
    required: true
  }],
  stream: {
    type: String,
    enum: ['PCM', 'PCB', 'Commerce', null],
    default: null
  },
  totalLessons: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'School Course'
  },
  level: {
    type: String,
    enum: ['Primary', 'Middle', 'Senior Secondary'],
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Course", CourseSchema);
