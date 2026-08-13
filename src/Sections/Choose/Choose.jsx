import React, { useEffect, useState } from "react";
import "./Choose.css";
import { FaHandPointRight } from "react-icons/fa";
import { fetchChooseFeatures } from "../../lib/supabase-queries";
import { iconMap } from "../../lib/iconMap";

const Choose = () => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeatures();
  }, []);

  const loadFeatures = async () => {
    try {
      const data = await fetchChooseFeatures();
      setFeatures(data);
    } catch (error) {
      console.error("Error loading features:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <section className="choose-section"><h2>Loading...</h2></section>;

  return (
    <section className="choose-section">
      <div className="choose-heading">
        <div className="choose-badge">
          <FaHandPointRight />
          <span>Why Choose Me</span>
        </div>

        <h2>
          Why You Choose Farhan Ali For SEO and <br />
          Marketing Services In Pakistan?
        </h2>
      </div>

      <div className="choose-grid">
        {features.map((feature) => (
          <div
            className="choose-card"
            key={feature.id}
          >
            <div className="choose-icon">{iconMap[feature.icon_name] || <span>•</span>}</div>

            <h3>{feature.title}</h3>

            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Choose;