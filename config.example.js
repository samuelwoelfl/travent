// Google API Configuration - EXAMPLE FILE
// Copy this file to config.js and add your actual API keys
// DO NOT commit config.js to version control

const config = {
  GOOGLE_CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID_HERE',
  GOOGLE_API_KEY: 'YOUR_GOOGLE_API_KEY_HERE'
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = config;
} else {
  // For browser usage
  window.config = config;
}
