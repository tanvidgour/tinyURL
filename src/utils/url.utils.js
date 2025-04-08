/**
 * Validate a URL string
 * @param {string} url - URL to validate
 * @returns {boolean} - Whether the URL is valid
 */
const validateUrl = (url) => {
  // Basic URL validation regex
  const urlPattern = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
  
  try {
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
    return false;
  }
};

module.exports = {
  validateUrl
}; 