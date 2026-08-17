import React from "react";
import "./Geo.css";
import geoImg from "../../assets/hero.png";
import Geo_Scope from "./Geo_Scope";
import Geo_Pricing from "./Geo_Pricing";
import Geo_Process from "./Geo_Process";
import Geo_Platforms from "./Geo_Platforms";
import Geo_Benefits from "./Geo_Benefits";
import GeoHireSection from "./GeoHireSection";
import Testimonials from "../../Sections/Testimonials/Testimonials";
import Choose from "../../Sections/Choose/Choose";
import GeoContact from "./GeoContact";
import { FaArrowRight } from "react-icons/fa";
import Brand from "../../Sections/Brand/Brand";
import { hasDbData } from "../../lib/dataHandler";

// Hardcoded defaults (only shown if NO database data)
const DEFAULT_GEO_HERO = {
  geo_heading: "HI",
  geo_heading_accent: "Professional GEO Services",
  geo_subheading: "Get ranked across Google, AI search results, local searches and answer engines with a modern GEO strategy designed for brands, businesses and service providers.",
  geo_feature_1: "Generative Engine Optimization",
  geo_feature_2: "AI Search Visibility",
  geo_feature_3: "Local SEO & AEO Strategy",
  geo_cta1_text: "Start Your GEO Growth",
  geo_cta1_link: "#",
  geo_cta2_text: "Free Consultation",
  geo_cta2_link: "/contact",
};

const DEFAULT_GEO_MODERN = {
  geo_modern_heading: "How GEO Helps Modern Websites",
  geo_modern_subheading: "Rank In AI Search Results",
  geo_modern_description: "AI-powered search engines like Google's AI Overviews, ChatGPT, Perplexity and other answer engines now select content based on trust, clarity, authority and structure. GEO helps your website become easier for AI systems to understand, summarize and recommend.",
  geo_modern_item_1_title: "Structured content for AI engines",
  geo_modern_item_2_title: "Better visibility in generated answers",
  geo_modern_item_3_title: "Authority-driven optimization strategy",
  geo_modern_video_url: "https://www.youtube.com/embed/YOUR_VIDEO_ID",
  geo_modern_badge_title: "GEO",
  geo_modern_badge_subtitle: "AI Search Ready",
};

const Geo = ({ serviceData }) => {
  const heroData = serviceData;

  // Use DATABASE data if exists, otherwise use hardcoded defaults
  const displayHero = hasDbData(heroData) ? heroData : DEFAULT_GEO_HERO;
  const displayModern = hasDbData(heroData) ? heroData : DEFAULT_GEO_MODERN;

  return (
    <>
      {/* HERO SECTION */}
      <section className="geoHero">
        <div className="geoWrapper">
          <div className="geoText">
            {/* Only show heading if it exists */}
            {displayHero.geo_heading && (
              <h1>
                {displayHero.geo_heading}
                {displayHero.geo_heading_accent && (
                  <span> {displayHero.geo_heading_accent}</span>
                )}
              </h1>
            )}

            {/* Only show subheading if it exists */}
            {displayHero.geo_subheading && (
              <p>{displayHero.geo_subheading}</p>
            )}

            {/* Only show features if at least one exists */}
            {(displayHero.geo_feature_1 || displayHero.geo_feature_2 || displayHero.geo_feature_3) && (
              <div className="geoFeatures">
                {displayHero.geo_feature_1 && <div>{displayHero.geo_feature_1}</div>}
                {displayHero.geo_feature_2 && <div>{displayHero.geo_feature_2}</div>}
                {displayHero.geo_feature_3 && <div>{displayHero.geo_feature_3}</div>}
              </div>
            )}

            {/* Only show CTA buttons if they exist */}
            {(displayHero.geo_cta1_text || displayHero.geo_cta2_text) && (
              <div className="geoActions">
                {displayHero.geo_cta1_text && (
                  <button onClick={() => window.location.href = displayHero.geo_cta1_link || '#'}>
                    {displayHero.geo_cta1_text}
                  </button>
                )}
                {displayHero.geo_cta2_text && (
                  <a href={displayHero.geo_cta2_link || "/contact"}>
                    {displayHero.geo_cta2_text}
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Contact Form Box */}
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

      {/* MODERN INFO SECTION */}
      {(displayModern.geo_modern_heading || displayModern.geo_modern_description) && (
        <section className="geoModernInfo">
          <div className="geoModernWrap">
            <div className="geoModernText">
              {displayModern.geo_modern_heading && (
                <h2>
                  {displayModern.geo_modern_heading}
                  {displayModern.geo_modern_subheading && (
                    <span>{displayModern.geo_modern_subheading}</span>
                  )}
                </h2>
              )}

              {displayModern.geo_modern_description && (
                <p>{displayModern.geo_modern_description}</p>
              )}

              {/* Only show points if at least one exists */}
              {(displayModern.geo_modern_item_1_title || displayModern.geo_modern_item_2_title || displayModern.geo_modern_item_3_title) && (
                <div className="geoModernPoints">
                  {displayModern.geo_modern_item_1_title && (
                    <div>
                      <strong>01</strong>
                      <span>{displayModern.geo_modern_item_1_title}</span>
                    </div>
                  )}
                  {displayModern.geo_modern_item_2_title && (
                    <div>
                      <strong>02</strong>
                      <span>{displayModern.geo_modern_item_2_title}</span>
                    </div>
                  )}
                  {displayModern.geo_modern_item_3_title && (
                    <div>
                      <strong>03</strong>
                      <span>{displayModern.geo_modern_item_3_title}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="geoModernMedia">
              {displayModern.geo_modern_video_url && (
                <div className="geoVideoCard">
                  <iframe
                    src={displayModern.geo_modern_video_url}
                    title="GEO Video"
                    allowFullScreen
                  ></iframe>
                </div>
              )}

              {(displayModern.geo_modern_badge_title || displayModern.geo_modern_badge_subtitle) && (
                <div className="geoFloatingBadge">
                  {displayModern.geo_modern_badge_title && (
                    <strong>{displayModern.geo_modern_badge_title}</strong>
                  )}
                  {displayModern.geo_modern_badge_subtitle && (
                    <span>{displayModern.geo_modern_badge_subtitle}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Child Components */}
      <Geo_Scope scopeCards={serviceData?.scopeCards} serviceId={serviceData?.id} />
      <Geo_Benefits benefits={serviceData?.benefits} />
      <Geo_Pricing pricing={serviceData?.pricing} />
      <Geo_Process processSteps={serviceData?.processSteps} />
      <Geo_Platforms platforms={serviceData?.platforms} tools={serviceData?.tools} />
      <GeoHireSection />
      <Brand />
      <Testimonials />
      <Choose />
      {serviceData?.faqs && serviceData.faqs.length > 0 && (
        <GeoFAQs faqs={serviceData.faqs} />
      )}
      <GeoContact />
    </>
  );
};

// FAQs Section Component
function GeoFAQs({ faqs }) {
  return (
    <section style={{ padding: '80px 20px', backgroundColor: '#f5f7fa' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{
          fontSize: '36px',
          fontWeight: 700,
          textAlign: 'center',
          marginBottom: '60px',
        }}>
          Frequently Asked Questions
        </h2>
        <div style={{ display: 'grid', gap: '16px' }}>
          {faqs.map(faq => (
            <details key={faq.id} style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '16px',
              border: '1px solid #e5e7eb',
              cursor: 'pointer',
            }}>
              <summary style={{
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
              }}>
                {faq.question}
              </summary>
              <p style={{
                marginTop: '12px',
                fontSize: '14px',
                color: '#6b7280',
                lineHeight: '1.6',
              }}>
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Geo;
