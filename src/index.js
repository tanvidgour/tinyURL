const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes and middleware
const urlRoutes = require('./routes/url.routes');
const { apiLimiter } = require('./middleware/rateLimiter');

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Initialize database
const { initializeDatabase } = require('./db/db');
initializeDatabase();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', urlRoutes);

// URL redirection route with rate limiting
app.get('/:shortId', apiLimiter, require('./controllers/url.controller').redirectToUrl);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 