const { db } = require('../db/db');
const { nanoid } = require('nanoid');

// Create new shortened URL
const createUrl = (originalUrl) => {
  return new Promise((resolve, reject) => {
    try {
      // Generate a short ID (7 characters)
      const shortId = nanoid(7);
      
      console.log('Generated shortId:', shortId, 'for URL:', originalUrl);
      
      // Insert into database
      const stmt = db.prepare('INSERT INTO urls (original_url, short_id) VALUES (?, ?)');
      stmt.run(originalUrl, shortId, function(err) {
        if (err) {
          console.error('Database error in createUrl:', err);
          reject(err);
          return;
        }
        
        console.log('URL saved in database with ID:', this.lastID);
        resolve({ shortId, originalUrl });
      });
      stmt.finalize();
    } catch (error) {
      console.error('Error in createUrl:', error);
      reject(error);
    }
  });
};

// Find URL by short ID
const findByShortId = (shortId) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM urls WHERE short_id = ?', [shortId], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      
      resolve(row);
    });
  });
};

// Get recent URLs (limit to 10)
const getRecentUrls = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM urls ORDER BY created_at DESC LIMIT 10', (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      
      resolve(rows);
    });
  });
};

module.exports = {
  createUrl,
  findByShortId,
  getRecentUrls
}; 