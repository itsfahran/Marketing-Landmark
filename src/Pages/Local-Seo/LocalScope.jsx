import React, { useState, useEffect } from "react";
import "./LocalScope.css";
import { getSupabaseClient } from "../../lib/supabase";

const hardcodedScopeData = [
  {
    icon: <i className="fa-brands fa-google"></i>,
    number: "1",
    title: "Google Business Profile Optimization",
    text: "Improve your business listing to rank higher on Google Maps and local search with NAP checks, categories, services and keywords.",
  },
  {
    icon: <i className="fa-solid fa-laptop-code"></i>,
    number: "2",
    title: "Local Website On-Page SEO",
    text: "Optimize location pages, metadata, local keywords, internal links, schema and maps embeds to boost local rankings.",
  },
  {
    icon: <i className="fa-solid fa-link"></i>,
    number: "3",
    title: "Local Off-Page SEO & Citations",
    text: "Build high-quality local citations, local backlinks and authority signals to increase trust in Google’s local algorithm.",
  },
];

const LocalScope = ({ scopeCards, serviceId, heading, description }) => {
  const [displayData, setDisplayData] = useState(hardcodedScopeData);
  const displayHeading = heading || 'Scope Of Local SEO In Pakistan';
  const displayDescription = description || 'A complete local SEO system designed to improve your visibility, authority and customer reach across Google Search and Google Maps.';

  useEffect(() => {
    // If scopeCards prop is provided, use it
    if (scopeCards && scopeCards.length > 0) {
      const formattedData = scopeCards.map((card, index) => ({
        icon: card.icon_text || "",
        number: String(index + 1),
        title: card.title,
        text: card.description,
      }));
      setDisplayData(formattedData);
    }
    // Otherwise if serviceId is provided, fetch from database
    else if (serviceId) {
      fetchScopeData();
    }
  }, [scopeCards, serviceId]);

  const fetchScopeData = async () => {
    try {
      const supabase = getSupabaseClient();
      const { data } = await supabase
        .from("service_scope_cards")
        .select("*")
        .eq("service_id", serviceId)
        .order("sort_order");

      if (data && data.length > 0) {
        const formattedData = data.map((card, index) => ({
          icon: card.icon_text || "",
          number: String(index + 1),
          title: card.title,
          text: card.description,
        }));
        setDisplayData(formattedData);
      }
    } catch (err) {
      console.log("Using hardcoded data");
    }
  };

  return (
    <section className="localScopeSection">
      <div className="localScopeContainer">
        <div className="localScopeHeader">
          <span>✦ Scope</span>
          <h2>{displayHeading}</h2>
          <p>{displayDescription}</p>
        </div>

        <div className="localScopeGrid">
          {displayData.map((item, index) => (
            <div className="localScopeCard" key={index}>
              <div className="scopeNumber">{item.number}</div>

              <div className="scopeIcon">
                {typeof item.icon === "string" ? (
                  <span style={{ fontSize: "24px" }}>{item.icon}</span>
                ) : (
                  <span>{item.icon}</span>
                )}
              </div>

              <h3>{item.title}</h3>
              <p>{item.text}</p>

              <div className="scopeLine"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LocalScope;