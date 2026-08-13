import React from "react";
import "./GeoHireSection.css";
import { FaArrowRight, FaStar, FaCheckCircle } from "react-icons/fa";
import img from "../../assets/gig2.png";
import { SiFiverr } from "react-icons/si";

const GeoHireSection = () => {
  return (
    <section className="geoHireSection">
      <div className="geoHireContainer">
        <div className="geoHireContent">
          <span className="geoHireBadge">
            {" "}
            <img
              src="https://www.google.com/s2/favicons?domain=fiverr.com&sz=64"
              alt="Fiverr"
              className="fiverrIcon"
            />
            Hire On Fiverr
          </span>

          <h1>
            Rank Your Website On <span>AI Engines</span> With GEO & Voice SEO
          </h1>

          <p>
            Boost your visibility on ChatGPT, Gemini, Perplexity and AI-powered
            search engines with professional Generative Engine Optimization.
          </p>

         

          <div className="geoHireButtons">
            <a href="#" className="primaryBtn">
               <img
              src="https://www.google.com/s2/favicons?domain=fiverr.com&sz=64"
              alt="Fiverr"
              className="fiverrIcon"
            />Hire Us through Fiver <FaArrowRight />
            </a>
            
          </div>
        </div>

        <div className="geoHireCard">
          <div className="cardImageBox">
            <img src={img} alt="GEO Fiverr Gig" />
          </div>

          <div className="cardContent">
            <h3>
              I’ll Rank Your Site On AI Engines With Generative Engine
              Optimization
            </h3>

            <div className="cardMeta">
              <span>
                <FaStar /> 26 Reviews
              </span>
              <strong>From PKR 41,536</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GeoHireSection;
