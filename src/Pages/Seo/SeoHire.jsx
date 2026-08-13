import React from "react";
import { FaStar, FaArrowRight, FaCheckCircle } from "react-icons/fa";
import "./SeoHire.css";
import seo from '../../assets/gig1.png'

const SeoHire = () => {

  return (
    <section className="seo-hire-section">
      <div className="seo-hire-container">
        <div className="seo-hire-content">
          <span className="seo-hire-label">Hire On Fiverr</span>

          <h2>
            I’ll Be Your Full Time SEO Manager, Manage Your Complete Project
            With My Team
          </h2>

          <p>
            Get complete SEO management for your website including on-page SEO,
            off-page SEO, technical SEO, local SEO and growth-focused reporting.
          </p>

          <div className="seo-hire-points">
            <span><FaCheckCircle /> On-Page SEO</span>
            <span><FaCheckCircle /> Off-Page SEO</span>
            <span><FaCheckCircle /> Technical SEO</span>
            <span><FaCheckCircle /> Local SEO</span>
          </div>

          <a href="#" className="seo-hire-btn">
            Hire Me <FaArrowRight />
          </a>
        </div>

        <div className="seo-hire-card">
          <div className="seo-hire-image-box">
            <img src={seo} alt="SEO Manager Service" />
          </div>

          <h3>
            I’ll Be Your Full Time SEO Manager, Manage Your Complete Project
            With My Team
          </h3>

          <div className="seo-hire-meta">
            <span><FaStar /> 24 Reviews</span>
            <span>From $150</span>
          </div>
        </div>
      </div>
    </section>
    
  );
};

export default SeoHire;