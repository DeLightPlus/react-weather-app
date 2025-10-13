// components/SmartFeeds.jsx
import React, { useEffect, useState } from 'react';
import AdOrNewsCard from '../Cards/AdPlaceholder/AdOrNewsCard';
import { useAppContext } from '../../context/AppContext';
import axios from 'axios';

const API_KEY = '849d9d8f212e4af0aece5c49291799c3';

const SmartFeeds = () => {
  const { currentLocation, defaultLocation, weatherData } = useAppContext();
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get location and country fallback
  const city = weatherData?.name || defaultLocation.cityName || 'Durban';
  const countryCode = weatherData?.sys?.country || defaultLocation.countryCode || 'ZA';

  const query = `(Weather OR Climate) AND (${city} OR ${countryCode})`;
  const fallbackQuery = `weather AND ${countryCode}`;

  const fetchNews = async () => {
    console.log(query, fallbackQuery);
    try {
      const primaryRes = await axios.get(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=5&apiKey=${API_KEY}`
      );

      let results = Array.isArray(primaryRes.data.articles) ? primaryRes.data.articles : [];
      console.log(results);      

      // If city-based query returns no results, try broader fallback
      if (results.length === 0) {
        const fallbackRes = await axios.get(
          `https://newsapi.org/v2/everything?q=${encodeURIComponent(fallbackQuery)}&language=en&sortBy=publishedAt&pageSize=5&apiKey=${API_KEY}`
        );
        results = Array.isArray(fallbackRes.data.articles) ? fallbackRes.data.articles : [];
      }

      setNewsList(results.slice(0, 2));
    } catch (err) {
      console.error('Error fetching news:', err);
      setNewsList([]);
    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    fetchNews();
  }, [weatherData]);

  const adFallback = (count) => {
    return Array.from({ length: count }, (_, i) => ({
      title: `Sponsored Ad #${i + 1}`,
      description: 'Ad content goes here. Targeted by location or weather.',
      url: 'https://example.com',
    }));
  };

  const newsCount = newsList.length;
  const adsNeeded = 2 - newsCount;
  const ads = adFallback(adsNeeded);

  return (
    <div className="smart-feeds">
      {loading && <p>Loading feeds...</p>}

      {!loading && (
        <>
          {/* Render news */}
          {newsList.map((newsItem, index) => (
            <AdOrNewsCard
              key={`news-${index}`}
              type="news"
              newsData={{
                title: newsItem.title,
                description: newsItem.description,
                url: newsItem.url,
                imageUrl: newsItem.urlToImage,
              }}
            />
          ))}

          {/* Render ads if needed */}
          {ads.map((ad, index) => (
            <AdOrNewsCard
              key={`ad-${index}`}
              type="ad"              
            />
          ))}
        </>
      )}
    </div>
  );
};

export default SmartFeeds;
