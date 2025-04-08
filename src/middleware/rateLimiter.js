const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  message: {
    error: 'Too many requests from this IP, please try again after 15 minutes'
  }
});

const shortenLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 URL shortening requests per hour
  standardHeaders: true,
  message: {
    error: 'You have reached the maximum number of URL shortening requests. Please try again later.'
  }
});

module.exports = {
  apiLimiter,
  shortenLimiter
}; 