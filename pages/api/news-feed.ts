import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export interface NewsItem {
  title: string
  description: string
  source: string
  url: string
  image?: string
  publishedAt?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<NewsItem[] | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { q = 'technology news' } = req.query

  try {
    // Check for required environment variables
    const googleApiKey = process.env.GOOGLE_API_KEY
    const googleCseId = process.env.GOOGLE_CSE_ID
    const newsApiKey = process.env.NEWSAPI_KEY

    if (!googleApiKey || !googleCseId || !newsApiKey) {
      return res.status(500).json({ 
        error: 'Missing required environment variables. Please check your .env.local file.' 
      })
    }

    const results: NewsItem[] = []

    // Fetch from Google Custom Search API
    try {
      const googleResponse = await axios.get(
        `https://www.googleapis.com/customsearch/v1?key=${googleApiKey}&cx=${googleCseId}&q=${encodeURIComponent(q as string)}&num=10`
      )

      if (googleResponse.data.items) {
        const googleItems = googleResponse.data.items.map((item: {
          title?: string;
          snippet?: string;
          displayLink?: string;
          link?: string;
          pagemap?: {
            cse_image?: { src: string }[];
            cse_thumbnail?: { src: string }[];
          };
        }) => ({
          title: item.title || 'No title',
          description: item.snippet || 'No description available',
          source: item.displayLink || 'Unknown source',
          url: item.link || '#',
          image: item.pagemap?.cse_image?.[0]?.src || item.pagemap?.cse_thumbnail?.[0]?.src,
          publishedAt: undefined // Google Custom Search doesn't provide publish date
        }))
        results.push(...googleItems)
      }
    } catch (error) {
      console.error('Google Custom Search API error:', error)
      // Continue execution to try NewsAPI
    }

    // Fetch from NewsAPI
    try {
      const newsApiResponse = await axios.get(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(q as string)}&apiKey=${newsApiKey}&pageSize=10&sortBy=publishedAt`
      )

      if (newsApiResponse.data.articles) {
        const newsApiItems = newsApiResponse.data.articles.map((article: {
          title?: string;
          description?: string;
          source?: { name: string };
          url?: string;
          urlToImage?: string;
          publishedAt?: string;
        }) => ({
          title: article.title || 'No title',
          description: article.description || 'No description available',
          source: article.source?.name || 'Unknown source',
          url: article.url || '#',
          image: article.urlToImage,
          publishedAt: article.publishedAt
        }))
        results.push(...newsApiItems)
      }
    } catch (error) {
      console.error('NewsAPI error:', error)
      // Continue execution even if NewsAPI fails
    }

    // If no results from either API, return an error
    if (results.length === 0) {
      return res.status(500).json({ 
        error: 'Unable to fetch news from any source. Please check your API keys and try again.' 
      })
    }

    // Remove duplicates based on URL and limit to 20 total results
    const uniqueResults = results.filter((item, index, self) => 
      index === self.findIndex(t => t.url === item.url)
    ).slice(0, 20)

    res.status(200).json(uniqueResults)
  } catch (error) {
    console.error('News feed API error:', error)
    res.status(500).json({ error: 'Failed to fetch news feed' })
  }
}