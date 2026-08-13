import React from "react";
import { FaArrowRight, FaWhatsapp } from "react-icons/fa";
import "./SeoContact.css";

const SeoContact = () => {
  return (
    <section className="seo-contact-section">
      <div className="seo-contact-container">
        <div className="seo-contact-content">
          <span className="seo-contact-label">Free SEO Audit</span>

          <h2>
            Get Your Free SEO Audit & Quote
            <br />
            For Your Website
          </h2>

          <p>
            Want to know why your website isn’t ranking on{" "}
            <span className="google-text">Google?</span>
          </p>

          <p>
            Get a detailed Free SEO audit of your website and discover hidden
            opportunities to improve rankings, traffic, and conversions.
          </p>

          <p>
            We’ll first analyze your website’s performance, on-page, off-page,
            technical issues, and keyword gaps to provide you with a clear
            action plan.
          </p>

          <p className="seo-contact-bold">
            Fill out the form or contact us directly on{" "}
            <FaWhatsapp className="whatsapp-icon" />{" "}
            <span>WhatsApp</span> to get a transparent quote with
            growth-focused recommendations.
          </p>

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