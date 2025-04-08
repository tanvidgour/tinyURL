const urlModel = require('../models/url.model');
const { validateUrl } = require('../utils/url.utils');

// Create a shortened URL
const createShortUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;
    
    // Validate URL
    if (!originalUrl) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    if (!validateUrl(originalUrl)) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }
    
    // Create short URL
    const result = await urlModel.createUrl(originalUrl);
    
    // Construct the full shortened URL
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const shortUrl = `${baseUrl}/${result.shortId}`;
    
    res.status(201).json({
      shortUrl,
      originalUrl: result.originalUrl
    });
  } catch (error) {
    console.error('Error creating short URL:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Redirect to original URL
const redirectToUrl = async (req, res) => {
  try {
    const { shortId } = req.params;
    
    // Find the URL in the database
    const url = await urlModel.findByShortId(shortId);
    
    if (!url) {
      // Send a 404 page with a link back to home
      return res.status(404).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>URL Not Found</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background-color: #f9fafb;
              color: #1f2937;
            }
            .container {
              text-align: center;
              padding: 2rem;
              background-color: white;
              border-radius: 0.5rem;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
              max-width: 24rem;
              width: 100%;
            }
            h1 {
              font-size: 1.5rem;
              font-weight: 600;
              margin-bottom: 1rem;
            }
            p {
              margin-bottom: 1.5rem;
              color: #4b5563;
            }
            a {
              display: inline-block;
              background-color: #2563eb;
              color: white;
              padding: 0.5rem 1rem;
              border-radius: 0.25rem;
              text-decoration: none;
              font-weight: 500;
              transition: background-color 150ms;
            }
            a:hover {
              background-color: #1d4ed8;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>URL Not Found</h1>
            <p>The short URL you're trying to access doesn't exist or has been removed.</p>
            <a href="/">Back to Home</a>
          </div>
        </body>
        </html>
      `);
    }
    
    // Redirect to the original URL
    res.redirect(url.original_url);
  } catch (error) {
    console.error('Error redirecting:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get recent URLs
const getRecentUrls = async (req, res) => {
  try {
    const urls = await urlModel.getRecentUrls();
    
    // Format the response
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const formattedUrls = urls.map(url => ({
      id: url.id,
      shortUrl: `${baseUrl}/${url.short_id}`,
      originalUrl: url.original_url,
      createdAt: url.created_at
    }));
    
    res.json(formattedUrls);
  } catch (error) {
    console.error('Error getting recent URLs:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  createShortUrl,
  redirectToUrl,
  getRecentUrls
}; 