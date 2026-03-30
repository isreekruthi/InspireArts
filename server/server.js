require('dotenv').config();

const axios = require("axios");
const { query, validationResult } = require("express-validator");
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

//environment safety check
if (!process.env.PORT) {
  console.warn("WARNING: PORT is not defined in environment variables.");
}

//SEC MIDDLEWARE

//add secure http headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://cdnjs.cloudflare.com"],
        styleSrc: ["'self'", "https://cdnjs.cloudflare.com"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: []
      }
    }
  })
);

//enable cors - STILL TIGHTEN!!!!!!!!!!! origin: allowed origin, something like that
//prevent randoms
app.use(cors({
  origin: [
    "http://localhost:5000",
    "http://localhost:3000"
  ],
  methods: ["GET", "POST"],
  credentials: true
}));

//secure json parse
app.use(express.json());

//logging
app.use(morgan('combined'));

//rate limiting
//protects brute force & spam
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, //15 min
  max: 100, //limits each IP
  message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

//FRONTEND FILES

//move front end into "public"
app.use(express.static(path.join(__dirname, '../public')));

//test route

app.get('/api/health', (req, res) => {
  res.json({ status: "Secure server running." });
});

//start server

//MUSIC SEARCH API
app.get(
  "/api/search-artist",
  [
    query("artist")
      .trim()
      .escape()
      .isLength({ min: 1, max: 100 })
      .withMessage("Invalid artist name")
  ],
  async (req, res) => {

    try {

      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "Invalid input",
          details: errors.array()
        });
      }

      const artistName = req.query.artist;

      // Call MusicBrainz securely from backend
      const response = await axios.get(
        `https://musicbrainz.org/ws/2/artist/?query=${encodeURIComponent(artistName)}&fmt=json`
      );

      res.json(response.data);

    } catch (err) {
      console.error(err.message);

      res.status(500).json({
        error: "Failed to fetch artist data"
      });
    }
  }
);

//global error handler
//prevent stack trace leak, improper error responses
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);

  res.status(500).json({
    error: "Internal Server Error"
  });
});

app.listen(PORT, () => {
  console.log(`Server running securely on port ${PORT}`);
});