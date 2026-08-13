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
import {
  FaArrowRight,
} from "react-icons/fa";
import Brand from "../../Sections/Brand/Brand";

const Geo = ({ serviceData }) => {
  const heroData = serviceData;
  return (
    <>

    <section className="geoHero">
      <div className="geoWrapper">
        
          

        <div className="geoText">
          {/* <span className="geoLabel">AI Search Optimization Expert</span> */}

          <h1>
            {heroData?.geo_heading || "HI"}
            <span> {heroData?.geo_heading_accent || 'Professional GEO Services'}</span>
          </h1>

          <p>
            {heroData?.geo_subheading || "Get ranked across Google, AI search results, local searches and answer engines with a modern GEO strategy designed for brands, businesses and service providers."}
          </p>

          <div className="geoFeatures">
            <div>{heroData?.geo_feature_1 || "Generative Engine Optimization"}</div>
            <div>{heroData?.geo_feature_2 || "AI Search Visibility"}</div>
            <div>{heroData?.geo_feature_3 || "Local SEO & AEO Strategy"}</div>
          </div>

          <div className="geoActions">
            <button onClick={() => window.location.href = heroData?.geo_cta1_link || '#'}>{heroData?.geo_cta1_text || "Start Your GEO Growth"}</button>
            <a href={heroData?.geo_cta2_link || "/contact"}>{heroData?.geo_cta2_text || "Free Consultation"}</a>
          </div>
        </div>
        {/* <div className="geoVisual">
        <div className="geoOrbit"></div>
          <div className="geoImageCard">
            <img src={geoImg} alt="GEO Professional" />
          </div>

          <div className="geoMiniCard cardOne">
            <strong>150+</strong>
            <span>Projects</span>
          </div>

          <div className="geoMiniCard cardTwo">
            <strong>5+</strong>
            <span>Years Experience</span>
          </div>
        </div> */}
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
    <section className="geoModernInfo">
  <div className="geoModernWrap">
    <div className="geoModernText">
      {/* <span className="geoModernTag">✦ AI Search Visibility</span> */}

      <h2>
        {heroData?.geo_modern_heading || "How GEO Helps Modern Websites"}
        <span>{heroData?.geo_modern_subheading || "Rank In AI Search Results"}</span>
      </h2>

      <p>
        {heroData?.geo_modern_description || "AI-powered search engines like Google’s AI Overviews, ChatGPT, Perplexity and other answer engines now select content based on trust, clarity, authority and structure. GEO helps your website become easier for AI systems to understand, summarize and recommend."}
      </p>

      <div className="geoModernPoints">
        <div>
          <strong>01</strong>
          <span>{heroData?.geo_modern_item_1_title || "Structured content for AI engines"}</span>
        </div>
        <div>
          <strong>02</strong>
          <span>{heroData?.geo_modern_item_2_title || "Better visibility in generated answers"}</span>
        </div>
        <div>
          <strong>03</strong>
          <span>{heroData?.geo_modern_item_3_title || "Authority-driven optimization strategy"}</span>
        </div>
      </div>
    </div>

    <div className="geoModernMedia">
      <div className="geoVideoCard">
        <iframe
          src={heroData?.geo_modern_video_url || "https://www.youtube.com/embed/YOUR_VIDEO_ID"}
          title="GEO Video"
          allowFullScreen
        ></iframe>
      </div>

      <div className="geoFloatingBadge">
        <strong>{heroData?.geo_modern_badge_title || "GEO"}</strong>
        <span>{heroData?.geo_modern_badge_subtitle || "AI Search Ready"}</span>
      </div>
    </div>
  </div>
</section>
<Geo_Scope scopeCards={serviceData?.scopeCards} serviceId={serviceData?.id} />
<Geo_Benefits benefits={serviceData?.benefits} />
<Geo_Pricing pricing={serviceData?.pricing} />
<Geo_Process processSteps={serviceData?.processSteps} />
<Geo_Platforms platforms={serviceData?.platforms} tools={serviceData?.tools} />
<GeoHireSection/>
<Brand/>
<Testimonials/>
<Choose/>
{serviceData?.faqs && serviceData.faqs.length > 0 && <GeoFAQs faqs={serviceData.faqs} />}
<GeoContact/>
</>
  );
};

// FAQs Section Component
function GeoFAQs({ faqs }) {
  return (
    <section style={{ padding: '80px 20px', backgroundColor: '#f5f7fa' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '36px', fontWeight: 700, textAlign: 'center', marginBottom: '60px' }}>
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