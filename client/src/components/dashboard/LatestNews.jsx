import React, { useEffect, useState } from 'react';
import { useData } from '../../context/DataContext';
import { Link } from 'react-router-dom';

const LatestNews = () => {
  const { newsData, fetchNewsData, loadingNews } = useData();
  const [articles, setArticles] = useState([]);
  const [featuredArticle, setFeaturedArticle] = useState(null);

  useEffect(() => {
    if (!newsData) {
      fetchNewsData();
    } else {
      setArticles(newsData.articles || []);
      setFeaturedArticle(newsData.featuredArticle);
    }
  }, [newsData, fetchNewsData]);

  if (loadingNews) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Latest News</h2>
        <div className="flex justify-center items-center h-40">
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Latest News</h2>
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-400">No news available</p>
        </div>
      </div>
    );
  }

  // Format date to "Mar 25, 2025" format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Latest News</h2>
        <Link 
          to="/news" 
          className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
        >
          <span>View All</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Featured article */}
      {featuredArticle && (
        <div className="mb-6">
          <a 
            href={featuredArticle.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block bg-gray-700 rounded-lg overflow-hidden hover:bg-gray-650 transition-colors"
          >
            {featuredArticle.image && (
              <img 
                src={featuredArticle.image} 
                alt={featuredArticle.headline}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">{featuredArticle.headline}</h3>
              <p className="text-gray-300 mb-3 line-clamp-2">{featuredArticle.summary}</p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-blue-400">{featuredArticle.source}</span>
                <span className="text-gray-400">{formatDate(featuredArticle.date)}</span>
              </div>
            </div>
          </a>
        </div>
      )}

      {/* News list */}
      <div className="space-y-4">
        {articles.slice(0, featuredArticle ? 5 : 6).map((article, index) => {
          // Skip the featured article in the list
          if (featuredArticle && article.headline === featuredArticle.headline) return null;
          
          return (
            <a 
              key={index}
              href={article.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block bg-gray-700 rounded-lg p-4 hover:bg-gray-650 transition-colors"
            >
              <div className="flex items-start">
                {article.image && (
                  <img 
                    src={article.image} 
                    alt={article.headline}
                    className="w-16 h-16 object-cover rounded mr-3 flex-shrink-0"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-medium line-clamp-2 mb-1">{article.headline}</h3>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-blue-400">{article.source}</span>
                    <span className="text-gray-400">{formatDate(article.date)}</span>
                  </div>
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {/* Categories breakdown */}
      {newsData?.categories && Object.keys(newsData.categories).length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-400 mb-3">News Categories</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(newsData.categories).map(([category, count]) => (
              <div key={category} className="bg-gray-700 rounded-full px-3 py-1 text-xs">
                {category} <span className="text-blue-400">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 text-xs text-gray-400 text-center">
        Last updated: {newsData?.lastUpdated ? new Date(newsData.lastUpdated).toLocaleTimeString() : 'Unknown'}
      </div>
    </div>
  );
};

export default LatestNews;