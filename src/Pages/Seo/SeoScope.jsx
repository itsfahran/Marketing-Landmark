import React, { useEffect, useRef, useState } from "react";
import "./SeoScope.css";
import onPageImg from "../../assets/onPageImg.png";
import offPageImg from "../../assets/offPageImg.png";
import technicalImg from "../../assets/technicalImg.png";
import { hasDbData } from "../../lib/dataHandler";

// Hardcoded defaults
const DEFAULT_SEO_SCOPE_CARDS = [
  {
    number: "01",
    title: "On Page SEO",
    description: "On-Page SEO focuses on optimizing the content and structure of your website to make it search-engine friendly and user-focused. We ensure every page is optimized to rank higher and convert visitors into customers.",
    image: onPageImg,
  },
  {
    number: "02",
    title: "Off Page SEO",
    description: "Off-Page SEO builds your website's authority and trust through external signals and high-quality backlinks. Our goal is to increase your domain authority and establish your website as a trusted source in your industry.",
    image: offPageImg,
  },
  {
    number: "03",
    title: "Technical SEO",
    description: "Technical SEO ensures your website is fast, secure, and easy for search engines to crawl and index. We optimize the technical foundation of your website to improve user experience, site speed, and rankings on Search Engines.",
    image: technicalImg,
  },
];

const DEFAULT_SEO_SCOPE = {
  heading: "Scope Of SEO Services In Pakistan",
  description: "Search Engine Optimization (SEO) is a complete strategy designed to improve your website's visibility, traffic, and rankings on search engines like Google. Our SEO services in Pakistan is focused on three core pillars that work together to deliver long-term, sustainable results.",
};

const SeoScope = ({ scopeCards, heading, description }) => {
  const sectionRef = useRef(null);
  const previewShown = useRef(false);
  const [previewActive, setPreviewActive] = useState(false);

  // Database-first: Use database data if exists, otherwise use hardcoded defaults
  const displayData = hasDbData(scopeCards) ? scopeCards : DEFAULT_SEO_SCOPE_CARDS;
  const displayHeading = heading || DEFAULT_SEO_SCOPE.heading;
  const displayDescription = description || DEFAULT_SEO_SCOPE.description;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !previewShown.current) {
          previewShown.current = true;
          setPreviewActive(true);
          setTimeout(() => {
            setPreviewActive(false);
          }, 1500);
          observer.unobserve(section);
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="scope-section">
      <div className="scope-container">
        <div className="scope-heading">
          <span>☛ Scope</span>
          {displayHeading && <h2>{displayHeading}</h2>}
          {displayDescription && <p>{displayDescription}</p>}
        </div>

        {displayData && displayData.length > 0 && (
          <div className="scope-grid">
            {displayData.map((item) => (
              <div className="scope-card" key={item.id || item.number}>
                {item.image && (
                  <div className="scope-image">
                    <img src={item.image} alt={item.title || 'Scope card'} />
                  </div>
                )}
                <div className="scope-content">
                  {item.title && <h3>{item.title}</h3>}
                  {(item.text || item.description) && <p>{item.text || item.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SeoScope;
