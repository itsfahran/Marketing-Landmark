import React from "react";
import { FaArrowRight, FaWhatsapp } from "react-icons/fa";
import "./SeoContact.css";
import { hasDbData } from "../../lib/dataHandler";

// Hardcoded defaults
const DEFAULT_SEO_CONTACT = {
  label: "Free SEO Audit",
  heading: "Get Your Free SEO Audit & Quote For Your Website",
  description: "Want to know why your website isn't ranking on Google?",
  details: [
    "Get a detailed Free SEO audit of your website and discover hidden opportunities to improve rankings, traffic, and conversions.",
    "We'll first analyze your website's performance, on-page, off-page, technical issues, and keyword gaps to provide you with a clear action plan.",
  ],
  cta: "Fill out the form or contact us directly on WhatsApp to get a transparent quote with growth-focused recommendations.",
};

const SeoContact = ({ contactData }) => {
  // Database-first: Use database data if exists, otherwise use hardcoded defaults
  const displayData = hasDbData(contactData) ? contactData : DEFAULT_SEO_CONTACT;

  return (
    <section className="seo-contact-section">
      <div className="seo-contact-container">
        <div className="seo-contact-content">
          {displayData.label && <span className="seo-contact-label">{displayData.label}</span>}

          {displayData.heading && (
            <h2>
              {displayData.heading}
            </h2>
          )}

          {displayData.description && (
            <p>
              {displayData.description}
              <br />
              <span className="google-text">Google?</span>
            </p>
          )}

          {displayData.details && displayData.details.length > 0 && (
            <>
              {displayData.details.map((detail, index) => (
                <p key={index}>{detail}</p>
              ))}
            </>
          )}

          {displayData.cta && (
            <p className="seo-contact-bold">
              {displayData.cta}
              <FaWhatsapp className="whatsapp-icon" />
            </p>
          )}

          <a href="#" className="seo-contact-btn">
            Let&apos;s Connect <FaArrowRight />
          </a>
        </div>

        <form className="seo-contact-form">
          <div className="form-glow"></div>

          <div className="seo-form-row">
            <div className="seo-form-group">
              <label>
                Name <span>*</span>
              </label>
              <input type="text" placeholder="Name" />
            </div>

            <div className="seo-form-group">
              <label>
                Website <span>*</span>
              </label>
              <input type="text" placeholder="Website" />
            </div>
          </div>

          <div className="seo-form-row">
            <div className="seo-form-group">
              <label>
                Email <span>*</span>
              </label>
              <input type="email" placeholder="Email" />
            </div>

            <div className="seo-form-group">
              <label>
                Whatsapp Number <span>*</span>
              </label>
              <input type="text" placeholder="Whatsapp Number" />
            </div>
          </div>

          <div className="seo-form-row">
            <div className="seo-form-group">
              <label>
                Services <span>*</span>
              </label>
              <select defaultValue="SEO">
                <option>SEO</option>
                <option>GEO</option>
                <option>Local SEO</option>
                <option>Web Development</option>
                <option>Linkedin Optimization</option>
                <option>Content Writing</option>
              </select>
            </div>

            <div className="seo-form-group">
              <label>
                Estimated Monthly Budget <span>*</span>
              </label>
              <select defaultValue="49,999 - 99,999 PKR">
                <option>49,999 - 99,999 PKR</option>
                <option>99,999 - 149,999 PKR</option>
                <option>149,999+ PKR</option>
              </select>
            </div>
          </div>

          <div className="seo-form-group full">
            <label>Message</label>
            <textarea placeholder="Message"></textarea>
          </div>

          <button type="submit" className="seo-submit-btn">
            Get A Quote <FaArrowRight />
          </button>
        </form>
      </div>
    </section>
  );
};

export default SeoContact;
