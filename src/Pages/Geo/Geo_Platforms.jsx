import React from "react";
import "./Geo_Platforms.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
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

const platforms = [
  { name: "ChatGPT", img: gpt },
  { name: "Google AI Overview", img: gemini },
  { name: "Perplexity", img: perplexity },
  { name: "Microsoft Copilot", img: copilot },
  { name: "Meta AI", img: meta },
  { name: "DeepSeek", img: deepseek },
  { name: "Grok", img: grok },
];

const tools = [
  { name: "Google Business Profile", img: google },
  { name: "LocalBright", img: localbright },
  { name: "SEMRush", img: semrush },
  { name: "Localo", img: localo },
  { name: "Ahref", img: ahref },
];

const GeoInfiniteSlider = ({ label, title, data, reverse = false }) => {
  const duplicatedData = [...data, ...data];

  return (
    <div className="geoPlatformsBlock">
      <div className="geoPlatformsHeader">
        <span>✦ {label}</span>
        <h2>{title}</h2>
      </div>

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
                    <img src={item.img || item.logo_url || item.icon_url} alt={item.name || item.title} />
                  )}
                  <h3>{item.name || item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="geoPlatformsArrow geoPlatformsRight">
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

const Geo_Platforms = ({ platforms: platformsData, tools: toolsData }) => {
  // Use database data or fallback to hardcoded
  const displayPlatforms = platformsData && platformsData.length > 0 ? platformsData : platforms;
  const displayTools = toolsData && toolsData.length > 0 ? toolsData : tools;

  return (
    <section className="geoPlatformsSection">
      <GeoInfiniteSlider
        label="Platforms"
        title="Platforms We Optimize For"
        data={displayPlatforms}
      />

      <GeoInfiniteSlider
        label="Tools"
        title="Tools I’m Using For GEO Optimization"
        data={displayTools}
      />
    </section>
  );
};

export default Geo_Platforms;
