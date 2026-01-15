const express = require("express");
const router = express.Router();

// TEMP route to remove errors
router.get("/", (req, res) => {
  res.send("Auth routes working");
});

module.exports = router;
