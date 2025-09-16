# Adriana's Guide - Combined News Feed

A Next.js application that provides a combined news feed from Google Custom Search and NewsAPI, styled similarly to Google News.

## Features

- Combined news feed from Google Custom Search API and NewsAPI
- Clean, responsive design similar to Google News
- Search functionality for different topics
- Error handling and loading states
- TypeScript support
- Tailwind CSS for styling

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API Keys

Create a `.env.local` file in the project root and add your API keys:

```bash
# Copy the example file
cp .env.local.example .env.local
```

Then edit `.env.local` and add your actual API keys:

```env
# Google Custom Search API Configuration
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_CSE_ID=your_google_cse_id_here

# NewsAPI Configuration  
NEWSAPI_KEY=your_newsapi_key_here
```

### 3. Get Your API Keys

#### Google Custom Search API
1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Custom Search API
4. Create credentials (API key)
5. Set up a Custom Search Engine at [Google CSE](https://cse.google.com/)
6. Get your Search Engine ID (CSE ID)

#### NewsAPI
1. Go to [NewsAPI.org](https://newsapi.org/)
2. Sign up for a free account
3. Get your API key from the dashboard

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 5. Navigate to News Feed

- Go to [http://localhost:3000/news](http://localhost:3000/news) to view the combined news feed
- Use the search box to query different topics

## API Endpoints

### `/api/news-feed`

Fetches and combines news from both Google Custom Search and NewsAPI.

**Query Parameters:**
- `q` (optional): Search query (default: "technology news")

**Response:**
Returns an array of news items with the following structure:
```typescript
interface NewsItem {
  title: string
  description: string
  source: string
  url: string
  image?: string
  publishedAt?: string
}
```

## Project Structure

```
├── pages/
│   ├── api/
│   │   └── news-feed.ts      # Combined news API endpoint
│   ├── _app.tsx              # App configuration
│   ├── index.tsx             # Home page
│   └── news.tsx              # News feed page
├── styles/
│   └── globals.css           # Global styles with Tailwind
├── .env.local.example        # Environment variables template
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

## Build and Deploy

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Axios](https://axios-http.com/) - HTTP requests
- Google Custom Search API - Search results
- NewsAPI - News articles