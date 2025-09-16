# API Keys Setup Guide

## Required API Keys

To use the combined news feed functionality, you need to obtain API keys from two services:

### 1. Google Custom Search API

1. **Go to Google Cloud Console**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Sign in with your Google account

2. **Create or Select a Project**
   - Click on the project dropdown at the top
   - Either create a new project or select an existing one

3. **Enable Custom Search API**
   - Go to "APIs & Services" > "Library"
   - Search for "Custom Search API"
   - Click on it and press "Enable"

4. **Create API Key**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key (this is your `GOOGLE_API_KEY`)

5. **Create Custom Search Engine**
   - Visit [Google Custom Search Engine](https://cse.google.com/)
   - Click "Add" to create a new search engine
   - In "Sites to search", enter `www.google.com` (or `*` for the entire web)
   - Give it a name and click "Create"
   - Click on your newly created search engine
   - In the sidebar, click "Setup" then "Basic"
   - Copy the "Search engine ID" (this is your `GOOGLE_CSE_ID`)

### 2. NewsAPI

1. **Go to NewsAPI**
   - Visit [NewsAPI.org](https://newsapi.org/)
   - Click "Get API Key"

2. **Sign Up**
   - Create a free account
   - Verify your email address

3. **Get Your API Key**
   - After signing in, go to your account dashboard
   - Copy your API key (this is your `NEWSAPI_KEY`)

## Environment Variables Setup

1. **Create .env.local file**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Edit .env.local with your API keys**
   ```env
   # Google Custom Search API Configuration
   GOOGLE_API_KEY=your_actual_google_api_key_here
   GOOGLE_CSE_ID=your_actual_google_cse_id_here

   # NewsAPI Configuration  
   NEWSAPI_KEY=your_actual_newsapi_key_here
   ```

3. **Save the file and restart your development server**
   ```bash
   npm run dev
   ```

## Testing

1. Navigate to `http://localhost:3000/news`
2. If configured correctly, you should see news articles from both sources
3. Try searching for different topics using the search box

## Troubleshooting

- **"Missing required environment variables" error**: Check that your `.env.local` file exists and contains all three required keys
- **No results from Google Custom Search**: Verify your API key has the Custom Search API enabled and your CSE ID is correct
- **No results from NewsAPI**: Verify your NewsAPI key is valid and you haven't exceeded rate limits
- **500 errors**: Check the browser console and server logs for specific error messages

## API Rate Limits

- **Google Custom Search**: 100 searches/day for free accounts
- **NewsAPI**: 1000 requests/day for free accounts (developer plan)

For production use, consider upgrading to paid plans for higher rate limits.