const express = require("express");
const router = express.Router();

// TEMP route
router.get("/enrollment-test", (req, res) => {
  res.send("Enrollment routes working");
});

module.exports = router;
