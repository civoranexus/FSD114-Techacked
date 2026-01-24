const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Enrollment = sequelize.define("Enrollment", {
  userId: DataTypes.INTEGER,
  courseId: DataTypes.INTEGER,
  progress: { type: DataTypes.INTEGER, defaultValue: 0 }
});

module.exports = Enrollment;
