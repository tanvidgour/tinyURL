/**
 * Validate a URL string
 * @param {string} url - URL to validate
 * @returns {boolean} - Whether the URL is valid
 */
const validateUrl = (url) => {
  // Skip regex pattern testing and go straight to URL object validation
  // for well-known domains like linkedin.com
  if (url.includes('linkedin.com') || 
      url.includes('github.com') || 
      url.includes('facebook.com') ||
      url.includes('twitter.com')) {
    try {
      // Ensure URL has a protocol
      let urlWithProtocol = url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        urlWithProtocol = 'https://' + url;
      }
      
      // Check if URL is valid by creating a URL object
      new URL(urlWithProtocol);
      return true;
    } catch (error) {
      console.error('URL validation error:', error);
      return false;
    }
  }
  
  // For other URLs, use regex pattern first, then URL object validation
  try {
    // Basic URL validation regex
    const urlPattern = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
    
    // Check if it matches the regex pattern
    if (!urlPattern.test(url)) {
      return false;
    }
    
    // Ensure URL has a protocol
    let urlWithProtocol = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      urlWithProtocol = 'https://' + url;
    }
    
    // Check if URL is valid by creating a URL object
    new URL(urlWithProtocol);
    return true;
  } catch (error) {
    console.error('URL validation error:', error);
    return false;
  }
};

module.exports = {
  validateUrl
}; 