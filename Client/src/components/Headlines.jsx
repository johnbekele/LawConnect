import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import '../App.css';

function Headlines() {
  const [headlines, setHeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get('https://api.rss2json.com/v1/api.json', {
        params: {
          rss_url: 'https://news.google.com/rss/search?q=law',
        },
        timeout: 10000,
      });

      if (response.data && response.data.items) {
        const articles = response.data.items
          .slice(0, 6) // Reduced for sidebar
          .map((item, index) => ({
            id: `${item.guid || index}-${Date.now()}`,
            title: item.title || 'No title available',
            url: item.link || '#',
            pubDate: item.pubDate || new Date().toISOString(),
            description: item.description || '',
          }));

        setHeadlines(articles);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('Failed to load news');
      setHeadlines([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 1800000);
    return () => clearInterval(interval);
  }, [fetchNews]);

  const getTimeAgo = (dateString) => {
    if (!dateString) return '';
    const now = new Date();
    const pubDate = new Date(dateString);
    const diffInHours = Math.floor((now - pubDate) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col">
        <HeaderSection onRefresh={fetchNews} />
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <HeaderSection onRefresh={fetchNews} lastUpdated={lastUpdated} />

      {error && <ErrorSection error={error} onRetry={fetchNews} />}

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {headlines.length > 0 ? (
          <div className="p-3 space-y-2">
            {headlines.map((article, index) => (
              <CompactNewsCard
                key={article.id}
                article={article}
                index={index}
                getTimeAgo={getTimeAgo}
              />
            ))}
          </div>
        ) : (
          <EmptyState onRetry={fetchNews} />
        )}
      </div>

      {headlines.length > 0 && (
        <div className="flex-shrink-0 px-3 py-2 bg-gray-50 border-t border-gray-200">
          <div className="text-center">
            <span className="text-xs text-gray-600 font-medium">
              {headlines.length} latest articles
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Compact Header for Sidebar
const HeaderSection = ({ onRefresh, lastUpdated }) => (
  <div className="flex-shrink-0 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-sm font-bold text-gray-900">Legal News</h3>
      <button
        onClick={onRefresh}
        className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all duration-200"
        title="Refresh news"
      >
        <svg
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>
    </div>

    <div className="flex items-center justify-center">
      <div className="flex items-center space-x-1 px-2 py-1 bg-white rounded-full text-xs">
        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-gray-600">
          {lastUpdated ? 'Live' : 'Loading...'}
        </span>
      </div>
    </div>
  </div>
);

// Compact Loading State
const LoadingState = () => (
  <div className="flex-1 flex items-center justify-center">
    <div className="text-center">
      <svg
        className="animate-spin h-6 w-6 text-blue-600 mx-auto mb-2"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <p className="text-xs text-gray-600">Loading news...</p>
    </div>
  </div>
);

// Compact Error Section
const ErrorSection = ({ error, onRetry }) => (
  <div className="flex-shrink-0 p-2 bg-red-50 border-l-4 border-red-400">
    <div className="flex items-center justify-between">
      <p className="text-xs text-red-700">{error}</p>
      <button
        onClick={onRetry}
        className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-800 text-xs rounded transition-colors"
      >
        Retry
      </button>
    </div>
  </div>
);

// Compact News Card for Sidebar
const CompactNewsCard = ({ article, index, getTimeAgo }) => (
  <div className="group p-2 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200 bg-white">
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <div className="flex items-start space-x-2">
        <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-white text-xs font-bold">{index + 1}</span>
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 leading-tight line-clamp-2 mb-1">
            {article.title.length > 60
              ? `${article.title.substring(0, 60)}...`
              : article.title}
          </h4>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center">
              <svg
                className="w-2.5 h-2.5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {getTimeAgo(article.pubDate)}
            </span>
            <span className="text-blue-600 group-hover:text-blue-700">→</span>
          </div>
        </div>
      </div>
    </a>
  </div>
);

// Empty State for Sidebar
const EmptyState = ({ onRetry }) => (
  <div className="flex-1 flex items-center justify-center p-4">
    <div className="text-center">
      <svg
        className="w-8 h-8 text-gray-400 mx-auto mb-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
        />
      </svg>
      <h4 className="text-xs font-medium text-gray-900 mb-1">
        No news available
      </h4>
      <p className="text-xs text-gray-500 mb-2">
        Unable to fetch latest updates
      </p>
      <button
        onClick={onRetry}
        className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

export default Headlines;
