import React from "react";
import { FaStar, FaArrowRight, FaCheckCircle } from "react-icons/fa";
import "./SeoHire.css";
import { hasDbData } from "../../lib/dataHandler";
import seo from '../../assets/gig1.png'

// Hardcoded defaults
const DEFAULT_SEO_HIRE = {
  label: "Hire On Fiverr",
  title: "I'll Be Your Full Time SEO Manager, Manage Your Complete Project With My Team",
  description: "Get complete SEO management for your website including on-page SEO, off-page SEO, technical SEO, local SEO and growth-focused reporting.",
  points: [
    "On-Page SEO",
    "Off-Page SEO",
    "Technical SEO",
    "Local SEO",
  ],
  image: seo,
  reviews: "24 Reviews",
  price: "From $150",
};

const SeoHire = ({ hireData }) => {
  // Database-first: Use database data if exists, otherwise use hardcoded defaults
  const displayData = hasDbData(hireData) ? hireData : DEFAULT_SEO_HIRE;
  const points = displayData.points || DEFAULT_SEO_HIRE.points;
  const image = displayData.image || DEFAULT_SEO_HIRE.image;

  return (
    <section className="seo-hire-section">
      <div className="seo-hire-container">
        <div className="seo-hire-content">
          {displayData.label && <span className="seo-hire-label">{displayData.label}</span>}

          {displayData.title && (
            <h2>{displayData.title}</h2>
          )}

          {displayData.description && (
            <p>{displayData.description}</p>
          )}

          {points && points.length > 0 && (
            <div className="seo-hire-points">
              {points.map((point, index) => (
                <span key={index}><FaCheckCircle /> {point}</span>
              ))}
            </div>
          )}

          <a href="#" className="seo-hire-btn">
            Hire Me <FaArrowRight />
          </a>
        </div>

        <div className="seo-hire-card">
          {image && (
            <div className="seo-hire-image-box">
              <img src={image} alt={displayData.title || 'SEO Manager Service'} />
            </div>
          )}

          {displayData.title && (
            <h3>{displayData.title}</h3>
          )}

          {(displayData.reviews || displayData.price) && (
            <div className="seo-hire-meta">
              {displayData.reviews && <span><FaStar /> {displayData.reviews}</span>}
              {displayData.price && <span>{displayData.price}</span>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SeoHire;
