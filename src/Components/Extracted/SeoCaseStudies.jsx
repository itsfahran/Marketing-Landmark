import React from 'react';
import './SeoCaseStudies.css';

const SeoCaseStudies = ({ data }) => {
  const items = data?.items || [];
  const heading = data?.heading || 'Case Studies';
  const description = data?.description || '';

  return (
    <section className="seo-case-studies">
      <div className="seo-case-studies-container">
        {heading && <h2 className="seo-case-studies-heading">{heading}</h2>}
        {description && <p className="seo-case-studies-description">{description}</p>}

        <div className="seo-case-studies-grid">
          {items.length === 0 ? (
            <p className="no-items-message">No case studies available</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="seo-case-studies-card">
                {item.image_url && (
                  <div className="seo-case-studies-image-wrapper">
                    <img src={item.image_url} alt={item.title} className="seo-case-studies-card-image" />
                    {item.is_featured && (
                      <div className="seo-case-studies-featured-badge">⭐ Featured</div>
                    )}
                  </div>
                )}
                <div className="seo-case-studies-card-content">
                  {item.category && (
                    <p className="seo-case-studies-card-category">{item.category}</p>
                  )}
                  <h3 className="seo-case-studies-card-title">{item.title}</h3>
                  {item.description && (
                    <p className="seo-case-studies-card-description">{item.description}</p>
                  )}
                  {item.project_url && (
                    <a href={item.project_url} target="_blank" rel="noopener noreferrer" className="seo-case-studies-card-link">
                      View Project →
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default SeoCaseStudies;
