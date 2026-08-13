import React, { useEffect, useRef, useState } from "react";
import "./Geo_Scope.css";

import geoAuditImg from "../../assets/geo-audit.png";
import geoOptimizationImg from "../../assets/geo-optimization.png";
import geoVisibilityImg from "../../assets/geo-visibility.png";

const geoScopeData = [
  {
    number: "01",
    title: "Audit",
    image: geoAuditImg,
    text: "Every page undergoes a detailed On-Page and Technical GEO audit to identify gaps that impact AI visibility. This includes reviewing structure, content clarity, technical setup, schema implementation, and overall AI-readiness to ensure the foundation is strong.",
  },
  {
    number: "02",
    title: "Optimization",
    image: geoOptimizationImg,
    text: "Fix On-Page and Technical GEO issues to improve AI understanding and contextual relevance. This includes long-tail keyword research, AI-optimized conversational content, metadata creation, FAQ and Local Business schema markup.",
  },
  {
    number: "03",
    title: "Visibility",
    image: geoVisibilityImg,
    text: "The final stage focuses on enhancing presence on AI search engines through strategic brand mentions, optimizing for generative results, improving featured snippet opportunities, and increasing chances of being referenced in AI-generated answers.",
  },
];

const Geo_Scope = ({ scopeCards, heading, description }) => {
  const sectionRef = useRef(null);
  const previewShown = useRef(false);
  const [previewActive, setPreviewActive] = useState(false);

  // Use database data or fallback to hardcoded
  const displayData = scopeCards && scopeCards.length > 0 ? scopeCards : geoScopeData;
  const displayHeading = heading || 'Scope Of GEO';
  const displayDescription = description || 'Our GEO scope is designed to make your business more discoverable across modern AI-driven search platforms. From technical audits and content optimization to schema markup, local relevance, and brand visibility signals, every step helps search engines and AI tools better understand, trust, and reference your business. This process improves your chances of appearing in generative search results, featured answers, and high-intent local queries, helping your brand build stronger authority, better visibility, and long-term organic growth.';

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
      {
        threshold: 0.35,
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`geoScopeSection ${previewActive ? "preview-active" : ""}`}
    >
      <div className="geoScopeHeader">
        <span>✦ Scope</span>
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

export default Geo_Scope;