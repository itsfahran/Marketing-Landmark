import React from 'react';
import { FaArrowRight, FaStar, FaCheckCircle } from 'react-icons/fa';
import './GeoHire.css';

const GeoHire = ({ data }) => {
  const heading = data?.heading || 'Rank Your Website On AI Engines';
  const description = data?.description || '';
  const items = data?.items || [];
  const primaryItem = items.length > 0 ? items[0] : null;

  return (
    <section className="geoHireSection">
      <div className="geoHireContainer">
        <div className="geoHireContent">
          <span className="geoHireBadge">
            <img
              src="https://www.google.com/s2/favicons?domain=fiverr.com&sz=64"
              alt="Fiverr"
              className="fiverrIcon"
            />
            Hire On Fiverr
          </span>

          <h1>{heading}</h1>

          {description && <p>{description}</p>}

          {primaryItem?.features && (
            <div className="geoHireFeatures">
              {primaryItem.features.map((feature, idx) => (
                <p key={idx}>
                  <FaCheckCircle /> {feature}
                </p>
              ))}
            </div>
          )}

          <div className="geoHireButtons">
            <a href="#" className="primaryBtn">
              <img
                src="https://www.google.com/s2/favicons?domain=fiverr.com&sz=64"
                alt="Fiverr"
                className="fiverrIcon"
              />
              Hire Us through Fiverr <FaArrowRight />
            </a>
          </div>
        </div>

        {primaryItem && (
          <div className="geoHireCard">
            <div className="cardImageBox">
              {primaryItem.image_url && (
                <img src={primaryItem.image_url} alt={primaryItem.title} />
              )}
            </div>

            <div className="cardContent">
              <h3>{primaryItem.title}</h3>

              <div className="cardMeta">
                {primaryItem.rating && (
                  <span>
                    <FaStar /> {primaryItem.review_count || 0} Reviews
                  </span>
                )}
                {primaryItem.price_label && (
                  <strong>{primaryItem.price_label}</strong>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default GeoHire;
