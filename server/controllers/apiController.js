const axios = require("axios");
const { validationResult } = require("express-validator");

exports.searchArtist = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Invalid input",
        details: errors.array()
      });
    }

    const artistName = req.query.artist;

    const response = await axios.get(
      `https://musicbrainz.org/ws/2/artist/?query=${encodeURIComponent(artistName)}&fmt=json`,
      { timeout: 5000 }
    );

    res.json(response.data);

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch artist data" });
  }
};