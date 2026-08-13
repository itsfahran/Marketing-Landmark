import React from "react";
import "./Geo_Process.css";
import {
  FaFileAlt,
  FaChartLine,
  FaKey,
  FaEdit,
  FaCog,
  FaLink,
  FaMapMarkerAlt,
  FaChartPie,
} from "react-icons/fa";

const geoProcessData = [
  { icon: <FaFileAlt />, title: "On-Page & Technical GEO Audit", text: "Analyze each page to identify issues affecting AI visibility" },
  { icon: <FaChartLine />, title: "Fix GEO Issues", text: "Resolve all On-Page and Technical GEO problems to improve search readiness" },
  { icon: <FaKey />, title: "GEO Keyword Research", text: "Find long-tail keywords for featured snippets and AI relevance" },
  { icon: <FaEdit />, title: "Content Creation", text: "Write GEO-optimized conversational content for AI understanding" },
  { icon: <FaCog />, title: "Implementation", text: "Add meta data, FAQs, and Local Business schema, and ping all AI search engines" },
  { icon: <FaLink />, title: "Brand Mention", text: "Publish brand mention listicles to boost authority and AI visibility" },
  { icon: <FaMapMarkerAlt />, title: "GBP Optimization", text: "Optimize Google Business Profile for local and AI search recognition." },
  { icon: <FaChartPie />, title: "Reporting & Growth", text: "Track performance, refine strategies, and maintain continuous growth" },
];

const Geo_Process = ({ processSteps, heading, description }) => {
  // Use database process steps or fallback to hardcoded
  const displaySteps = processSteps && processSteps.length > 0 ? processSteps : geoProcessData;
  const displayHeading = heading || "How We’ll Work On Your Website To Rank It Top On AI Search Engines";
  const displayDescription = description || "Our GEO process is built to improve your website’s visibility across AI-powered search engines by strengthening technical structure, optimizing content for conversational search, improving local signals, and building authority through strategic brand mentions. Each step is designed to help AI platforms better understand, trust, and recommend your business in relevant search results.";

  return (
    <section className="geoProcessSection">
      <div className="geoProcessHeader">
        <span>✦ Our GEO Process</span>
        <h2>{displayHeading}</h2>

        <p className="geoProcessIntro">
          {displayDescription}
        </p>
      </div>

      <div className="geoProcessSlider">
        <div className="geoProcessTrack">
          {[1, 2].map((group) => (
            <div className="geoProcessGroup" key={group}>
              {displaySteps.map((item, index) => (
                <div className="geoProcessStep" key={`${group}-${index}`}>
                  <div className="geoProcessCard">
                    <div className="geoProcessNumber">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    {item.icon && <div className="geoProcessIcon">{item.icon}</div>}
                    <h3>{item.title}</h3>
                    <p>{item.text || item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Geo_Process;