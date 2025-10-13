// components/Cards/AdPlaceholder/AdOrNewsCard.jsx
import React, { useEffect, useState } from 'react';
import './AdOrNewsCard.css';


const AdOrNewsCard = ({ type = 'ad', category='career', newsData = null }) => {

  const [adData, setAdData] = useState(null);
  const iframeSrc = `https://auro-adhub.onrender.com/embed.html?category=${encodeURIComponent(category)}`;
 
  
  if (type === 'news' && newsData) {
    return (
      <div className="card-wrapper news-card">
        {/* First row: Image and title inline */}
        <div className="news-header">
          {newsData.imageUrl && (
            <img
              src={newsData.imageUrl}
              alt="News Thumbnail"
              className="news-thumbnail"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
          <h4 className="news-title">📰 {newsData.title}</h4>
        </div>

        {/* Second row: Description and link */}
        <div className="news-body">
          <hr />
          <p>{newsData.description}</p>
          <a href={newsData.url} target="_blank" rel="noopener noreferrer">
            Read more →
          </a>
        </div>
      </div>
    );
  }

  // Default ad fallback
  return (
    <div className="card-wrapper ad-card">
      <h4>🔖 Sponsored Ad</h4>
      <iframe
        src={iframeSrc}
        width="100%"
        height="250"
        title="Sponsored Ad"
        style={{ border: 'none', borderRadius: '8px' }}
        loading="lazy"
      ></iframe>
    </div>
  );
};

export default AdOrNewsCard;
