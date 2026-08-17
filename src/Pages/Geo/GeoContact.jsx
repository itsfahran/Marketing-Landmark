import React from "react";
import "./GeoContact.css";
import { hasDbData } from "../../lib/dataHandler";

// Hardcoded defaults
const DEFAULT_GEO_CONTACT = {
  tag: "Free GEO Audit",
  heading: "Get Your Website Ready For AI Search Growth",
  description: "Share your website details and get a professional GEO audit with clear recommendations to improve visibility on AI-driven search engines.",
  points: [
    "AI Search Readiness Check",
    "Technical GEO Audit",
    "Content Optimization Plan",
    "Free Quote & Strategy",
  ],
  formHeading: "Request Free Audit",
  formDescription: "Fill the form below and we'll contact you shortly.",
};

const GeoContact = ({ contactData }) => {
  // Database-first: Use database data if exists, otherwise use hardcoded defaults
  const displayData = hasDbData(contactData) ? contactData : DEFAULT_GEO_CONTACT;
  const points = displayData.points || DEFAULT_GEO_CONTACT.points;

  return (
    <section className="geoContactSection">
      <div className="geoContactContainer">
        <div className="geoContactInfo">
          {displayData.tag && <span className="geoContactTag">{displayData.tag}</span>}

          {displayData.heading && (
            <h2>
              Get Your Website Ready For <span>AI Search Growth</span>
            </h2>
          )}

          {displayData.description && (
            <p>{displayData.description}</p>
          )}

          {points && points.length > 0 && (
            <div className="geoContactPoints">
              {points.map((point, index) => (
                <div key={index}>✓ {point}</div>
              ))}
            </div>
          )}
        </div>

        <form className="geoContactForm">
          <div className="formHeader">
            {displayData.formHeading && <h3>{displayData.formHeading}</h3>}
            {displayData.formDescription && <p>{displayData.formDescription}</p>}
          </div>

          <div className="formGrid">
            <div className="inputGroup">
              <label>Name *</label>
              <input type="text" placeholder="Enter your name" />
            </div>

            <div className="inputGroup">
              <label>Website *</label>
              <input type="text" placeholder="https://example.com" />
            </div>

            <div className="inputGroup">
              <label>Email *</label>
              <input type="email" placeholder="Enter your email" />
            </div>

            <div className="inputGroup">
              <label>Whatsapp Number *</label>
              <input type="text" placeholder="Whatsapp number" />
            </div>

            <div className="inputGroup">
              <label>Services *</label>
              <select>
                <option>SEO</option>
                <option>GEO</option>
                <option>Local SEO</option>
                <option>Web Development</option>
                <option>Linkedin Optimization</option>
                <option>Content Writing</option>
              </select>
            </div>

            <div className="inputGroup">
              <label>Estimated Monthly Budget *</label>
              <select>
                <option>$399</option>
                <option>$699</option>
                <option>$999</option>
                <option>$1000+</option>
              </select>
            </div>
          </div>

          <div className="inputGroup fullWidth">
            <label>Message</label>
            <textarea placeholder="Tell us about your website goals"></textarea>
          </div>

          <button type="submit" className="geoSubmitBtn">
            Get A Quote
          </button>
        </form>
      </div>
    </section>
  );
};

export default GeoContact;
