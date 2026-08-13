import React from "react";
import "../../Pages/Geo/Geo.css";
import { FaArrowRight } from "react-icons/fa";

/**
 * Extracted GEO Hero Section - 100% match to Geo.jsx hero section
 */
const GeoHero = ({ data }) => {
  const heroData = data || {};

  return (
    <section className="geoHero">
      <div className="geoWrapper">
        <div className="geoText">
          <h1>
            {heroData.heading || "HI"}
            <span> {heroData.geo_heading_accent || 'Professional GEO Services'}</span>
          </h1>

          <p>
            {heroData.subheading || "Get ranked across Google, AI search results, local searches and answer engines with a modern GEO strategy designed for brands, businesses and service providers."}
          </p>

          <div className="geoFeatures">
            <div>{heroData.geo_feature_1 || "Generative Engine Optimization"}</div>
            <div>{heroData.geo_feature_2 || "AI Search Visibility"}</div>
            <div>{heroData.geo_feature_3 || "Local SEO & AEO Strategy"}</div>
          </div>

          <div className="geoActions">
            <button onClick={() => window.location.href = heroData.geo_cta1_link || '#'}>
              {heroData.geo_cta1_text || "Start Your GEO Growth"}
            </button>
            <a href={heroData.geo_cta2_link || "/contact"}>
              {heroData.geo_cta2_text || "Free Consultation"}
            </a>
          </div>
        </div>

        <div className="contact-form-box">
          <span className="contact-small-title">Send Message</span>
          <h2>Get In Touch</h2>

          <form className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input type="text" placeholder="First Name" />
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <input type="text" placeholder="Last Name" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Services</label>
                <select defaultValue="Search Engine Optimization (SEO)">
                  <option>Search Engine Optimization (SEO)</option>
                  <option>Generative Engine Optimization</option>
                  <option>Local SEO</option>
                  <option>AI Search Optimization</option>
                  <option>Web Development</option>
                  <option>Graphic Design</option>
                </select>
              </div>

              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="Email" />
              </div>
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea placeholder="Message"></textarea>
            </div>

            <button type="submit" className="contact-submit-btn">
              Submit <FaArrowRight />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default GeoHero;
