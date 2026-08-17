import React from "react";
import "./GeoHireSection.css";
import { FaArrowRight, FaStar, FaCheckCircle } from "react-icons/fa";
import { hasDbData } from "../../lib/dataHandler";
import img from "../../assets/gig2.png";
import { SiFiverr } from "react-icons/si";

// Hardcoded defaults
const DEFAULT_GEO_HIRE = {
  badge: "Hire On Fiverr",
  heading: "Rank Your Website On AI Engines With GEO & Voice SEO",
  description: "Boost your visibility on ChatGPT, Gemini, Perplexity and AI-powered search engines with professional Generative Engine Optimization.",
  image: img,
  cardTitle: "I'll Rank Your Site On AI Engines With Generative Engine Optimization",
  cardReviews: "26 Reviews",
  cardPrice: "From PKR 41,536",
};

const GeoHireSection = ({ hireData }) => {
  // Database-first: Use database data if exists, otherwise use hardcoded defaults
  const displayData = hasDbData(hireData) ? hireData : DEFAULT_GEO_HIRE;

  return (
    <section className="geoHireSection">
      <div className="geoHireContainer">
        <div className="geoHireContent">
          {displayData.badge && (
            <span className="geoHireBadge">
              <img
                src="https://www.google.com/s2/favicons?domain=fiverr.com&sz=64"
                alt="Fiverr"
                className="fiverrIcon"
              />
              {displayData.badge}
            </span>
          )}

          {displayData.heading && (
            <h1>
              Rank Your Website On <span>AI Engines</span> With GEO & Voice SEO
            </h1>
          )}

          {displayData.description && (
            <p>{displayData.description}</p>
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

        <div className="geoHireCard">
          {displayData.image && (
            <div className="cardImageBox">
              <img src={displayData.image} alt="GEO Fiverr Gig" />
            </div>
          )}

          <div className="cardContent">
            {displayData.cardTitle && (
              <h3>{displayData.cardTitle}</h3>
            )}

            {(displayData.cardReviews || displayData.cardPrice) && (
              <div className="cardMeta">
                {displayData.cardReviews && (
                  <span>
                    <FaStar /> {displayData.cardReviews}
                  </span>
                )}
                {displayData.cardPrice && <strong>{displayData.cardPrice}</strong>}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GeoHireSection;
