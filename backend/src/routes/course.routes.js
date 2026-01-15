const express = require("express");
const router = express.Router();

// TEMP GET API (just to make it run)
router.get("/", (req, res) => {
  res.json([
    { id: 1, title: "HTML" },
    { id: 2, title: "CSS" },
    { id: 3, title: "JavaScript" }
  ]);
});

module.exports = router;
