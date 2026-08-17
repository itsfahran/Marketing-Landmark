import React from "react";
import "./Geo_Platforms.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { hasDbData } from "../../lib/dataHandler";
import gpt from "../../assets/gpt.png";
import gemini from "../../assets/gemini.png";
import perplexity from "../../assets/perplexity.png";
import copilot from "../../assets/copilot.png";
import meta from "../../assets/meta-ai.png";
import deepseek from "../../assets/deepseek.png";
import grok from "../../assets/grok.png";
import google from "../../assets/google-my-business.png";
import localbright from "../../assets/local-bright.webp";
import semrush from "../../assets/semrush.png";
import localo from "../../assets/localo.png";
import ahref from "../../assets/ahref.webp";

// Hardcoded defaults
const DEFAULT_PLATFORMS = [
  { name: "ChatGPT", img: gpt },
  { name: "Google AI Overview", img: gemini },
  { name: "Perplexity", img: perplexity },
  { name: "Microsoft Copilot", img: copilot },
  { name: "Meta AI", img: meta },
  { name: "DeepSeek", img: deepseek },
  { name: "Grok", img: grok },
];

const DEFAULT_TOOLS = [
  { name: "Google Business Profile", img: google },
  { name: "LocalBright", img: localbright },
  { name: "SEMRush", img: semrush },
  { name: "Localo", img: localo },
  { name: "Ahref", img: ahref },
];

const GeoInfiniteSlider = ({ label, title, data, reverse = false }) => {
  const duplicatedData = data && data.length > 0 ? [...data, ...data] : [];

  return (
    <div className="geoPlatformsBlock">
      <div className="geoPlatformsHeader">
        <span>✦ {label}</span>
        {title && <h2>{title}</h2>}
      </div>

      {duplicatedData && duplicatedData.length > 0 && (
        <div className="geoPlatformsSlider">
          <button className="geoPlatformsArrow geoPlatformsLeft">
            <FaChevronLeft />
          </button>

          <div className="geoPlatformsViewport">
            <div
              className={`geoPlatformsTrack ${
                reverse ? "geoPlatformsTrackReverse" : ""
              }`}
            >
              {duplicatedData.map((item, index) => (
                <div className="geoPlatformsSlide" key={index}>
                  <div className="geoPlatformsCard">
                    {(item.img || item.logo_url || item.icon_url) && (
                      <img src={item.img || item.logo_url || item.icon_url} alt={item.name || item.title || 'Platform'} />
                    )}
                    {(item.name || item.title) && <h3>{item.name || item.title}</h3>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="geoPlatformsArrow geoPlatformsRight">
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

const Geo_Platforms = ({ platforms: platformsData, tools: toolsData }) => {
  // Database-first: Use database data if exists, otherwise use hardcoded defaults
  const displayPlatforms = hasDbData(platformsData) ? platformsData : DEFAULT_PLATFORMS;
  const displayTools = hasDbData(toolsData) ? toolsData : DEFAULT_TOOLS;

  return (
    <section className="geoPlatformsSection">
      <GeoInfiniteSlider
        label="Platforms"
        title="Platforms We Optimize For"
        data={displayPlatforms}
      />

      <GeoInfiniteSlider
        label="Tools"
        title="Tools I'm Using For GEO Optimization"
        data={displayTools}
      />
    </section>
  );
};

export default Geo_Platforms;
