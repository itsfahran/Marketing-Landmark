import React from "react";
import { FaArrowRight } from "react-icons/fa";
import "./SeoCaseStudies.css";

import project1 from "../../assets/project1.png";
import project2 from "../../assets/project2.png";
import project3 from "../../assets/project3.png";

const caseStudies = [
  {
    title: "New E-Commerce Store 3-Month SEO Growth",
    image: project1,
    desc: "Within just 3 months, We achieved 117K impressions and 1.75K organic clicks for this new e-Commerce store, Our approach helped the store establish a strong foundation for long-term organic success.",
  },
  {
    title: "30 Days Shopify Store SEO Result | 134 Orders",
    image: project2,
    desc: "By using advanced keyword research, on-page SEO, technical optimization, and high-quality backlinks, We successfully increased sales and positioned this Shopify perfume store for long-term organic growth.",
  },
  {
    title:
      "6 Month SEO Result | 23.4k Click 775k Impression Received 5000+ Orders",
    image: project3,
    desc: "This was a new website that sells gaming virtual products, and through my advanced SEO strategies, it successfully sold 5000+ products within 6 months.",
  },
  {
    title: "New E-Commerce Store 3-Month SEO Growth",
    image: project1,
    desc: "Within just 3 months, We achieved 117K impressions and 1.75K organic clicks for this new e-Commerce store, Our approach helped the store establish a strong foundation for long-term organic success.",
  },
  {
    title: "30 Days Shopify Store SEO Result | 134 Orders",
    image: project2,
    desc: "By using advanced keyword research, on-page SEO, technical optimization, and high-quality backlinks, We successfully increased sales and positioned this Shopify perfume store for long-term organic growth.",
  },
  {
    title:
      "6 Month SEO Result | 23.4k Click 775k Impression Received 5000+ Orders",
    image: project3,
    desc: "This was a new website that sells gaming virtual products, and through my advanced SEO strategies, it successfully sold 5000+ products within 6 months.",
  },
];

// Duplicate cards for seamless infinite scrolling
const sliderCards = [...caseStudies, ...caseStudies];

const SeoCaseStudies = () => {
  return (
    <section className="seo-case-section">
      <div className="seo-case-container">
        <div className="seo-case-heading">
          <span>Case Studies</span>
          <h2>Our SEO Case Studies</h2>
        </div>

        <div className="seo-case-slider">
          <div className="seo-case-track">
            {sliderCards.map((item, index) => (
              <div className="seo-case-card" key={index}>
                <div className="seo-case-top-line"></div>

                <h3>{item.title}</h3>

                <div className="seo-case-image">
                  <img src={item.image} alt={item.title} />
                </div>

                <div className="seo-case-content">
                  <p>{item.desc}</p>

                  <a href="#" className="seo-case-btn">
                    See Results <FaArrowRight />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SeoCaseStudies;