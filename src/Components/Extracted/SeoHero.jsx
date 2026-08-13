import React, { useEffect, useState } from "react";
import "../../Pages/Seo/Seo.css";
import { FaArrowRight } from "react-icons/fa";

/**
 * Extracted SEO Hero Section - 100% match to Seo.jsx hero section
 */
const SeoHero = ({ data }) => {
  const heroData = data || {};
  const [experience, setExperience] = useState(0);
  const [projects, setProjects] = useState(0);
  const [clients, setClients] = useState(0);

  useEffect(() => {
    const startCounter = (endValue, setter, duration = 1800) => {
      let startValue = 0;
      const incrementTime = 20;
      const totalSteps = duration / incrementTime;
      const incrementValue = endValue / totalSteps;

      const counter = setInterval(() => {
        startValue += incrementValue;

        if (startValue >= endValue) {
          setter(endValue);
          clearInterval(counter);
        } else {
          setter(Math.floor(startValue));
        }
      }, incrementTime);
    };

    startCounter(5, setExperience);
    startCounter(150, setProjects);
    startCounter(90, setClients);
  }, []);

  return (
    <>
      <section className="seo-hero-section">
        <div className="seo-hero-container">
          <div className="seo-hero-content">
            <h1>
              {heroData.heading || "Best SEO Services in Pakistan by Professional SEO Expert"}
            </h1>

            <p>
              {heroData.description || "Farhan Ali is a Top-Rated SEO freelancer on Fiverr, providing SEO services in Pakistan with 5+ years of experience in SEO and expertise in GEO / AEO / AI Search Engine Optimization and Local SEO. Worked with top global IT and digital marketing companies and international clients, completing 150+ projects on freelance platforms."}
            </p>

            <div className="seo-hero-stats">
              <div className="seo-stat-box">
                <h3>{experience}+</h3>
                <span>{heroData.stat_1_label || "Years Experience"}</span>
              </div>

              <div className="seo-stat-box">
                <h3>{projects}+</h3>
                <span>{heroData.stat_2_label || "Project Complete"}</span>
              </div>

              <div className="seo-stat-box">
                <h3>{clients}%</h3>
                <span>{heroData.stat_3_label || "Return Clients"}</span>
              </div>
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

        <div className="seo-hero-marquee">
          <div className="seo-marquee-track">
            <span>Professional SEO Expert In Pakistan</span>
            <strong>*</strong>
            <span>{heroData.marquee_text || "Farhan Ali"}</span>
            <strong>*</strong>
            <span>Professional SEO Expert In Pakistan</span>
            <strong>*</strong>
            <span>{heroData.marquee_text || "Farhan Ali"}</span>
            <strong>*</strong>
            <span>Professional SEO Expert In Pakistan</span>
            <strong>*</strong>
            <span>{heroData.marquee_text || "Farhan Ali"}</span>
            <strong>*</strong>
          </div>

          <div className="seo-marquee-track">
            <span>Professional SEO Expert In Pakistan</span>
            <strong>*</strong>
            <span>{heroData.marquee_text || "Farhan Ali"}</span>
            <strong>*</strong>
            <span>Professional SEO Expert In Pakistan</span>
            <strong>*</strong>
            <span>{heroData.marquee_text || "Farhan Ali"}</span>
            <strong>*</strong>
            <span>Professional SEO Expert In Pakistan</span>
            <strong>*</strong>
            <span>{heroData.marquee_text || "Farhan Ali"}</span>
            <strong>*</strong>
          </div>
        </div>

        <div className="seo-hero-seo-intro">
          <div className="seo-intro-left">
            <h2>
              How SEO Helps Your Website Rank Higher on Google
              <span className="google-text">
                <span className="g-blue">G</span>
                <span className="g-red">o</span>
                <span className="g-yellow">o</span>
                <span className="g-blue">g</span>
                <span className="g-green">l</span>
                <span className="g-red">e</span>
              </span>
              ?
            </h2>
          </div>

          <div className="seo-intro-right">
            <p>
              {heroData.intro_description || "Search Engine Optimization (SEO) plays a crucial role in helping websites rank higher on"}
              <span className="small-google">
                <span className="g-blue">G</span>
                <span className="g-red">o</span>
                <span className="g-yellow">o</span>
                <span className="g-blue">g</span>
                <span className="g-green">l</span>
                <span className="g-red">e</span>
              </span>
              {". By optimizing content, website structure, and technical elements, SEO ensures that search engines understand the site and show it to the right audience."}
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default SeoHero;
