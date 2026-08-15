import React from 'react';
import '../../Pages/Seo/Seo.css';

const SeoCMS = ({ items = null, heading = null, description = null }) => {
  const defaultItems = [
    { title: 'WordPress', icon_url: null },
    { title: 'Shopify', icon_url: null },
    { title: 'Wix', icon_url: null },
    { title: 'WooCommerce', icon_url: null },
    { title: 'Squarespace', icon_url: null },
  ];

  const displayItems = (items && items.length > 0) ? items : defaultItems;
  const displayHeading = heading || 'CMS We\'re Expert In';
  const displayDescription = description || '';

  return (
    <section className="seo-cms-tools-section">
      <div className="seo-cms-tools-container">
        <div className="seo-section-heading">
          <span className="seo-mini-title">CMS</span>
          <h2>{displayHeading}</h2>
          {displayDescription && <p>{displayDescription}</p>}
        </div>

        <div className="cms-card-grid">
          {displayItems.map((item, index) => (
            <div className="cms-modern-card" key={index}>
              <div className="cms-icon-box">
                {item.icon_url ? (
                  <img src={item.icon_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                  <span>{item.title.charAt(0)}</span>
                )}
              </div>
              <h3>{item.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SeoCMS;
