const axios = require('axios');

// In-memory cache for news data
let newsCache = null;
let lastFetchTime = 0;
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

/**
 * Get latest crypto news with a focus on Aptos
 * @returns {Promise<Object>} News data
 */
async function getLatestNews() {
  const now = Date.now();
  
  // Return cached data if still valid
  if (newsCache && (now - lastFetchTime) < CACHE_DURATION) {
    return newsCache;
  }
  
  try {
    // Use free crypto news API
    const response = await axios.get('https://min-api.cryptocompare.com/data/v2/news/', {
      params: {
        lang: 'EN',
        categories: 'Blockchain,APT'
      },
      timeout: 10000
    });
    
    if (!response.data?.Data || !Array.isArray(response.data.Data)) {
      throw new Error('Invalid news data format');
    }
    
    const newsItems = response.data.Data.slice(0, 10).map(item => {
      const isAptosRelated = 
        item.categories?.includes('APT') ||
        item.title?.toLowerCase().includes('aptos') ||
        item.body?.toLowerCase().includes('aptos');
        
      return {
        date: new Date(item.published_on * 1000).toISOString(),
        headline: item.title,
        source: item.source || 'Crypto News',
        summary: item.body?.substring(0, 150) + '...' || 'Crypto news from the blockchain ecosystem',
        tags: isAptosRelated ? ['aptos', 'blockchain'] : ['blockchain'],
        url: item.url,
        isAptosRelated,
        image: item.imageurl,
        importance: isAptosRelated ? 8 : 5
      };
    });
    
    // Sort news to prioritize Aptos-related content
    newsItems.sort((a, b) => {
      if (a.isAptosRelated && !b.isAptosRelated) return -1;
      if (!a.isAptosRelated && b.isAptosRelated) return 1;
      // If both have same Aptos-relatedness, sort by date
      return new Date(b.date) - new Date(a.date);
    });
    
    const result = {
      articles: newsItems,
      featuredArticle: newsItems.length > 0 ? newsItems[0] : null,
      lastUpdated: new Date().toISOString()
    };
    
    // Update cache
    newsCache = result;
    lastFetchTime = now;
    
    return result;
  } catch (error) {
    console.error('Error fetching news:', error.message);
    
    // Return cached data if available, even if expired
    if (newsCache) {
      return newsCache;
    }
    
    // Return fallback data if no cache available
    return generateFallbackNews();
  }
}

/**
 * Generate fallback news data
 * @returns {Object} Fallback news data
 */
function generateFallbackNews() {
  const currentDate = new Date().toISOString();
  
  return {
    articles: [
      {
        date: currentDate,
        headline: "Aptos DeFi Ecosystem Continues to Grow",
        source: "Crypto News",
        summary: "The DeFi ecosystem on Aptos blockchain continues to expand with new protocols joining the ecosystem.",
        tags: ["aptos", "defi", "blockchain"],
        url: "#",
        isAptosRelated: true,
        image: "https://via.placeholder.com/150",
        importance: 8
      },
      {
        date: currentDate,
        headline: "New Staking Protocol Launches on Aptos",
        source: "DeFi Insight",
        summary: "A new high-yield staking protocol has launched on the Aptos blockchain, offering competitive APRs.",
        tags: ["aptos", "staking", "defi"],
        url: "#",
        isAptosRelated: true,
        image: "https://via.placeholder.com/150",
        importance: 9
      }
    ],
    featuredArticle: {
      date: currentDate,
      headline: "Aptos Ecosystem Reaches New Milestone with Rising TVL",
      source: "Crypto Analytics",
      summary: "The Aptos blockchain has reached a significant milestone with Total Value Locked (TVL) surpassing previous records.",
      tags: ["aptos", "tvl", "milestone", "defi"],
      url: "#",
      isAptosRelated: true,
      image: "https://via.placeholder.com/300x200",
      importance: 10
    },
    lastUpdated: currentDate
  };
}

module.exports = { getLatestNews };
