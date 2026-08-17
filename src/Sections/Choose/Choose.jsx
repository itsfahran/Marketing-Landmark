import React, { useEffect, useState } from "react";
import "./Choose.css";
import { FaHandPointRight } from "react-icons/fa";
import { fetchChooseFeatures } from "../../lib/supabase-queries";
import { iconMap } from "../../lib/iconMap";
import { hasDbData } from "../../lib/dataHandler";

// Hardcoded defaults
const DEFAULT_CHOOSE_FEATURES = [
  {
    icon_name: "FaStar",
    title: "Proven Results",
    description: "I've helped numerous businesses improve their online visibility and increase organic traffic with result-driven strategies.",
  },
  {
    icon_name: "FaTargetArrow",
    title: "Customized Approach",
    description: "Every business is unique. I create tailored SEO strategies that align with your specific goals and target audience.",
  },
  {
    icon_name: "FaChartLine",
    title: "Transparent Reporting",
    description: "You'll always know how your campaign is performing with detailed, easy-to-understand reports and regular updates.",
  },
  {
    icon_name: "FaShieldAlt",
    title: "White Hat SEO",
    description: "I follow Google's best practices and use ethical SEO techniques that ensure long-term, sustainable growth.",
  },
  {
    icon_name: "FaClock",
    title: "Consistent Support",
    description: "I'm committed to your success. You'll have ongoing support and guidance throughout your SEO journey.",
  },
  {
    icon_name: "FaRocket",
    title: "Fast Implementation",
    description: "Once we agree on a strategy, I quickly implement changes and optimizations to start delivering results.",
  },
];

const DEFAULT_CHOOSE = {
  badge: "Why Choose Me",
  heading: "Why You Choose Farhan Ali For SEO and Marketing Services In Pakistan?",
};

const Choose = () => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeatures();
  }, []);

  const loadFeatures = async () => {
    try {
      const data = await fetchChooseFeatures();
      // Database-first: if data exists, use it; otherwise use defaults
      if (hasDbData(data)) {
        setFeatures(data);
      } else {
        setFeatures(DEFAULT_CHOOSE_FEATURES);
      }
    } catch (error) {
      console.error("Error loading features, using defaults:", error);
      setFeatures(DEFAULT_CHOOSE_FEATURES);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="choose-section">
      <div className="choose-heading">
        <div className="choose-badge">
          <FaHandPointRight />
          <span>{DEFAULT_CHOOSE.badge}</span>
        </div>

        <h2>{DEFAULT_CHOOSE.heading}</h2>
      </div>

      {features && features.length > 0 && (
        <div className="choose-grid">
          {features.map((feature) => (
            <div
              className="choose-card"
              key={feature.id || feature.title}
            >
              {feature.icon_name && (
                <div className="choose-icon">
                  {iconMap[feature.icon_name] || <span>•</span>}
                </div>
              )}

              {feature.title && <h3>{feature.title}</h3>}

              {feature.description && <p>{feature.description}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Choose;
