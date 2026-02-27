require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

//SEC MIDDLEWARE

//add secure http headers
app.use(helmet());

//enable cors
/////////////TO DO:::::: TIGHTEN UP LATER/////////////
app.use(cors());

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

app.listen(PORT, () => {
  console.log(`Server running securely on port ${PORT}`);
});