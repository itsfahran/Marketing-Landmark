import React from 'react';
import { FaStar, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import './SeoHire.css';

const SeoHire = ({ data }) => {
  const heading = data?.heading || 'I\'ll Be Your Full Time SEO Manager';
  const description = data?.description || '';
  const items = data?.items || [];
  const primaryItem = items.length > 0 ? items[0] : null;

  return (
    <section className="seo-hire-section">
      <div className="seo-hire-container">
        <div className="seo-hire-content">
          <span className="seo-hire-label">Hire On Fiverr</span>

          <h2>{heading}</h2>

          {description && <p>{description}</p>}

          {primaryItem && (
            <div className="seo-hire-points">
              {primaryItem.features?.map((feature, idx) => (
                <span key={idx}>
                  <FaCheckCircle /> {feature}
                </span>
              )) || (
                <span><FaCheckCircle /> Professional Service</span>
              )}
            </div>
          )}

          <a href="#" className="seo-hire-btn">
            Hire Me <FaArrowRight />
          </a>
        </div>

        {primaryItem && (
          <div className="seo-hire-card">
            <div className="seo-hire-image-box">
              {primaryItem.image_url && (
                <img src={primaryItem.image_url} alt={primaryItem.title} />
              )}
            </div>

            <h3>{primaryItem.title}</h3>

            <div className="seo-hire-meta">
              {primaryItem.rating && (
                <span>
                  <FaStar /> {primaryItem.review_count || 0} Reviews
                </span>
              )}
              {primaryItem.price_label && (
                <span>{primaryItem.price_label}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SeoHire;
