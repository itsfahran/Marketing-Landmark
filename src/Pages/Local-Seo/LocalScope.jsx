import React, { useState, useEffect } from "react";
import "./LocalScope.css";
import { getSupabaseClient } from "../../lib/supabase";
import { hasDbData } from "../../lib/dataHandler";

// Hardcoded defaults
const DEFAULT_LOCAL_SCOPE_CARDS = [
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
    text: "Build high-quality local citations, local backlinks and authority signals to increase trust in Google's local algorithm.",
  },
];

const DEFAULT_LOCAL_SCOPE = {
  heading: 'Scope Of Local SEO In Pakistan',
  description: 'A complete local SEO system designed to improve your visibility, authority and customer reach across Google Search and Google Maps.',
};

const LocalScope = ({ scopeCards, serviceId, heading, description }) => {
  const [displayData, setDisplayData] = useState([]);
  const displayHeading = heading || DEFAULT_LOCAL_SCOPE.heading;
  const displayDescription = description || DEFAULT_LOCAL_SCOPE.description;

  useEffect(() => {
    // Database-first: If scopeCards prop is provided and valid, use it
    if (hasDbData(scopeCards)) {
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
    // No DB data and no serviceId, use hardcoded defaults
    else {
      setDisplayData(DEFAULT_LOCAL_SCOPE_CARDS);
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
      } else {
        // No DB data, use hardcoded defaults
        setDisplayData(DEFAULT_LOCAL_SCOPE_CARDS);
      }
    } catch (err) {
      console.log("Using hardcoded data");
      setDisplayData(DEFAULT_LOCAL_SCOPE_CARDS);
    }
  };

  return (
    <section className="localScopeSection">
      <div className="localScopeContainer">
        <div className="localScopeHeader">
          <span>✦ Scope</span>
          {displayHeading && <h2>{displayHeading}</h2>}
          {displayDescription && <p>{displayDescription}</p>}
        </div>

        {displayData && displayData.length > 0 && (
          <div className="localScopeGrid">
            {displayData.map((item, index) => (
              <div className="localScopeCard" key={index}>
                {item.number && <div className="scopeNumber">{item.number}</div>}

                {item.icon && (
                  <div className="scopeIcon">
                    {typeof item.icon === "string" ? (
                      <span style={{ fontSize: "24px" }}>{item.icon}</span>
                    ) : (
                      <span>{item.icon}</span>
                    )}
                  </div>
                )}

                {item.title && <h3>{item.title}</h3>}
                {item.text && <p>{item.text}</p>}

                <div className="scopeLine"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LocalScope;
