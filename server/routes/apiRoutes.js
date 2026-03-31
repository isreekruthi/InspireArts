const express = require("express");
const router = express.Router();
const { query } = require("express-validator");
const { searchArtist } = require("../controllers/apiController");

router.get(
  "/search-artist",
  [
    query("artist")
      .trim()
      .escape()
      .isLength({ min: 1, max: 100 })
      .matches(/^[a-zA-Z0-9\s.'-]+$/)
  ],
  searchArtist
);

module.exports = router;