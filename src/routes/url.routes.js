const express = require('express');
const router = express.Router();
const urlController = require('../controllers/url.controller');
const { apiLimiter, shortenLimiter } = require('../middleware/rateLimiter');

// Apply rate limiter to all API routes
router.use(apiLimiter);

// Create a shortened URL (with stricter rate limit)
router.post('/shorten', shortenLimiter, urlController.createShortUrl);

// Get recent URLs
router.get('/recent', urlController.getRecentUrls);

module.exports = router; 