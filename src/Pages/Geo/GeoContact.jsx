import React from "react";
import "./GeoContact.css";

const GeoContact = () => {
  return (
    <section className="geoContactSection">
      <div className="geoContactContainer">
        <div className="geoContactInfo">
          <span className="geoContactTag">Free GEO Audit</span>

          <h2>
            Get Your Website Ready For <span>AI Search Growth</span>
          </h2>

          <p>
            Share your website details and get a professional GEO audit with
            clear recommendations to improve visibility on AI-driven search
            engines.
          </p>

          <div className="geoContactPoints">
            <div>✓ AI Search Readiness Check</div>
            <div>✓ Technical GEO Audit</div>
            <div>✓ Content Optimization Plan</div>
            <div>✓ Free Quote & Strategy</div>
          </div>
        </div>

        <form className="geoContactForm">
          <div className="formHeader">
            <h3>Request Free Audit</h3>
            <p>Fill the form below and we’ll contact you shortly.</p>
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