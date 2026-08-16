import React, { useEffect, useRef, useState } from "react";
import "../Geo/Geo_Scope.css";

const seoScopeData = [
  {
    number: "01",
    title: "On Page SEO",
    description: "On-Page SEO focuses on optimizing the content and structure of your website to make it search-engine friendly and user-focused. We ensure every page is optimized to rank higher and convert visitors into customers.",
  },
  {
    number: "02",
    title: "Off Page SEO",
    description: "Off-Page SEO builds your website's authority and trust through external signals and high-quality backlinks. Our goal is to increase your domain authority and establish your website as a trusted source in your industry.",
  },
  {
    number: "03",
    title: "Technical SEO",
    description: "Technical SEO ensures your website is fast, secure, and easy for search engines to crawl and index. We optimize the technical foundation of your website to improve user experience, site speed, and rankings on Search Engines.",
  },
];

const SeoScope = ({ scopeCards, heading, description }) => {
  const sectionRef = useRef(null);
  const previewShown = useRef(false);
  const [previewActive, setPreviewActive] = useState(false);

  const displayData = scopeCards && scopeCards.length > 0 ? scopeCards : seoScopeData;
  const displayHeading = heading || "Scope Of SEO Services In Pakistan";
  const displayDescription = description || "Search Engine Optimization (SEO) is a complete strategy designed to improve your website's visibility, traffic, and rankings on search engines like Google. Our SEO services in Pakistan is focused on three core pillars that work together to deliver long-term, sustainable results.";

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
    <section ref={sectionRef} className={`geoScopeSection ${previewActive ? "preview-active" : ""}`}>
      <div className="geoScopeHeader">
        <span>☛ Scope</span>
        <h2>{displayHeading}</h2>
        <div className="geo-scope-text">
          <p>{displayDescription}</p>
        </div>
      </div>

      <div className="geoScopeCards">
        {displayData.map((item) => (
          <div className="geoScopeCard" key={item.id || item.number}>
            {item.image && <img src={item.image} alt={item.title} className="geoScopeImg" />}
            <div className="geoScopeOverlay"></div>
            <div className="geoScopeContent">
              <span className="geoScopeNumber">{item.number || item.id?.substring(0, 2)}</span>
              <h3>{item.title}</h3>
              <p>{item.text || item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SeoScope;
