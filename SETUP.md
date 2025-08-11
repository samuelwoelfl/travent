# Setup Instructions

## Google API Configuration

This project requires Google Calendar API access. Follow these steps to set up your environment:

### 1. Get Google API Credentials

1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Calendar API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set up OAuth consent screen if prompted
6. Create OAuth 2.0 Client ID for "Web application"
7. Add authorized JavaScript origins:
   - `http://localhost:5501` (for local development)
   - `http://127.0.0.1:5501` (for local development)
   - Your production domain (e.g., `https://yourdomain.com`)

### 2. Configure Local Environment

1. Copy `config.example.js` to `config.js`
2. Replace the placeholder values in `config.js` with your actual API credentials:
   ```javascript
   const config = {
     GOOGLE_CLIENT_ID: 'your-actual-client-id.apps.googleusercontent.com',
     GOOGLE_API_KEY: 'your-actual-api-key'
   };
   ```

### 3. Important Security Notes

- **NEVER commit `config.js` to version control**
- The file is already in `.gitignore`
- `config.example.js` is safe to commit (contains no real credentials)
- Keep your API keys secure and don't share them publicly

### 4. Run the Project

1. Start a local server (e.g., Live Server in VS Code)
2. Open the application in your browser
3. The Google Calendar integration should now work properly

## Troubleshooting

If you see the error "idpiframe_initialization_failed", make sure:
1. Your local development URLs are added to authorized origins in Google Cloud Console
2. The `config.js` file exists and contains valid credentials
3. You're using the correct project in Google Cloud Console
