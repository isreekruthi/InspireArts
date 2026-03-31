require('dotenv').config();

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

//helmet with CSP
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

//global rate limiting
//protects brute force & spam
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, //15 min
  max: 100, //limits each IP
  message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50, // stricter than global
  message: "Too many API requests, please try again later."
});

//FRONTEND FILES / STATIC

//move front end into "public"
app.use(express.static(path.join(__dirname, '../public')));


//routes
const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/apiRoutes');

app.use('/api', apiRoutes);
app.use('/api', authRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: "Secure server running." });
});

//global error handler
//prevent stack trace leak, improper error responses
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);

  res.status(500).json({
    error: "Internal Server Error"
  });
});

//start server
app.listen(PORT, () => {
  console.log(`Server running securely on port ${PORT}`);
});