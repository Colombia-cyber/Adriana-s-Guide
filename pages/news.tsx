import { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { NewsItem } from './api/news-feed'

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('technology news')
  const [isSearching, setIsSearching] = useState(false)

  const fetchNews = useCallback(async (query: string = searchQuery) => {
    setIsSearching(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/news-feed?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch news')
      }
      
      setNews(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch news')
      setNews([])
    } finally {
      setLoading(false)
      setIsSearching(false)
    }
  }, [searchQuery])

  useEffect(() => {
    fetchNews()
  }, [fetchNews])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      fetchNews(searchQuery.trim())
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return null
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return null
    }
  }

  return (
    <>
      <Head>
        <title>News Feed - Adriana&apos;s Guide</title>
        <meta name="description" content="Combined news feed from multiple sources" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-800">
                Adriana&apos;s Guide
              </Link>
              <span className="text-lg font-semibold text-gray-700">News</span>
            </div>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for news topics..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isSearching}
                />
                <button
                  type="submit"
                  disabled={isSearching || !searchQuery.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </div>
            </form>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-6">
          {loading && !isSearching && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-lg text-gray-600">Loading news...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                  <p className="text-sm text-red-700 mt-2">
                    Make sure your API keys are properly configured in your .env.local file.
                  </p>
                </div>
              </div>
            </div>
          )}

          {news.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {news.map((article, index) => (
                <article
                  key={`${article.url}-${index}`}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                >
                  {article.image && (
                    <div className="aspect-w-16 aspect-h-9">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="p-4">
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <span className="font-medium">{article.source}</span>
                      {article.publishedAt && (
                        <>
                          <span className="mx-1">•</span>
                          <span>{formatDate(article.publishedAt)}</span>
                        </>
                      )}
                    </div>
                    
                    <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-600 transition-colors"
                      >
                        {article.title}
                      </a>
                    </h2>
                    
                    <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                      {article.description}
                    </p>
                    
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Read more
                      <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}

          {!loading && !error && news.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📰</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No news found</h3>
              <p className="text-gray-600">Try searching for a different topic.</p>
            </div>
          )}
        </main>
      </div>

      <style jsx global>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  )
}