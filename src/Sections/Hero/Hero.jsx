import React, { useEffect, useState } from "react";
import "./Hero.css";
import { FaHandPointRight } from "react-icons/fa";
import heroImg from "../../assets/hero.png";
import {
  FaPhoneAlt,
  FaWhatsapp,
  FaEnvelope,
  FaLinkedinIn,
  FaFacebookF,
  FaArrowRight,
} from "react-icons/fa";

const Hero = ({
  heading = "Professional SEO Expert In Pakistan",
  subheading = "Farhan Ali is an Experienced and Certified Professional SEO Expert in Pakistan with specialized Expertise in GEO / AEO / AI Search Engine Optimization and Local SEO.",
  description = "Over the Past 5 Years, I've Completed 150+ Projects, Collaborating with Top Global IT & Digital Marketing Companies and International Clients, Consistently Delivering Proven Results in Online Visibility, Organic Traffic, and Online Business Growth.",
  marqueeText = "Professional SEO Expert In Pakistan * Farhan Ali * Professional SEO Expert In Pakistan",
  primaryBtn = { text: "Get Started", link: "/contact" },
  secondaryBtn = { text: "Learn More", link: "#" },
  showStats = true,
  stats = [],
  videoLink = "",
  showContactForm = true,
} = {}) => {
  const [marqueeStarted, setMarqueeStarted] = useState(false);
  const [statValues, setStatValues] = useState(stats?.map(() => 0) || []);

  useEffect(() => {
    if (!showStats || !stats?.length) return;

    const startCounter = (endValue, index, duration = 1800) => {
      let startValue = 0;
      const incrementTime = 20;
      const totalSteps = duration / incrementTime;
      const incrementValue = endValue / totalSteps;

      const counter = setInterval(() => {
        startValue += incrementValue;

        if (startValue >= endValue) {
          setStatValues((prev) => {
            const updated = [...prev];
            updated[index] = endValue;
            return updated;
          });
          clearInterval(counter);
        } else {
          setStatValues((prev) => {
            const updated = [...prev];
            updated[index] = Math.floor(startValue);
            return updated;
          });
        }
      }, incrementTime);
    };

    stats.forEach((stat, index) => {
      startCounter(parseInt(stat.end), index);
    });

    const marqueeTimer = setTimeout(() => {
      setMarqueeStarted(true);
    }, 3000);

    return () => {
      clearTimeout(marqueeTimer);
    };
  }, [stats, showStats]);

  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <h1>{heading}</h1>
          {subheading && <p>{subheading}</p>}
          {description && <p>{description}</p>}

          {showStats && stats?.length > 0 && (
            <div className="hero-stats">
              {stats.map((stat, index) => (
                <div key={stat.id || index} className="stat-box">
                  <h3>
                    {statValues[index] || 0}
                    {stat.suffix}
                  </h3>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* <div className="hero-image">
          <img src={heroImg} alt="Professional SEO Expert" />
        </div> */}

        {showContactForm && (
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
        )}
      </div>

      <div className="hero-marquee">
        <div
          className={`marquee-content ${
            marqueeStarted ? "marquee-started" : ""
          }`}
        >
          <div className="marquee-track">
            {marqueeText.split(" * ").map((text, i) => (
              <React.Fragment key={`track-${i}`}>
                <span>{text}</span>
                {i < marqueeText.split(" * ").length - 1 && <strong>*</strong>}
              </React.Fragment>
            ))}
            <strong>*</strong>
            {marqueeText.split(" * ").map((text, i) => (
              <React.Fragment key={`track-repeat-${i}`}>
                <span>{text}</span>
                {i < marqueeText.split(" * ").length - 1 && <strong>*</strong>}
              </React.Fragment>
            ))}
          </div>

          <div className="marquee-track" aria-hidden="true">
            {marqueeText.split(" * ").map((text, i) => (
              <React.Fragment key={`track-copy-${i}`}>
                <span>{text}</span>
                {i < marqueeText.split(" * ").length - 1 && <strong>*</strong>}
              </React.Fragment>
            ))}
            <strong>*</strong>
            {marqueeText.split(" * ").map((text, i) => (
              <React.Fragment key={`track-copy-repeat-${i}`}>
                <span>{text}</span>
                {i < marqueeText.split(" * ").length - 1 && <strong>*</strong>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="hero-seo-intro">
        <div className="seo-intro-left">
          <h2>
            Want More Traffic, Leads, And Sales From{" "}
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
            We'll Optimize Your Website Using the Latest SEO Strategies and
            AI-based Techniques to Connect Your Business with the Right Audience
            and Rank on 1st Page of{" "}
            <span className="small-google">
              <span className="g-blue">G</span>
              <span className="g-red">o</span>
              <span className="g-yellow">o</span>
              <span className="g-blue">g</span>
              <span className="g-green">l</span>
              <span className="g-red">e</span>
            </span>
            .
          </p>

          <p>
            Our Step-by-Step SEO Process Ensures Long-Term Visibility, Traffic
            Growth, and Higher Conversions.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;