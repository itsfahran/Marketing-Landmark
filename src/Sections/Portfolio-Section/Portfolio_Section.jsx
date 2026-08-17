import React, { useEffect, useState } from "react";
import "./Portfolio_Section.css";
import { FaHandPointRight } from "react-icons/fa";
import { fetchHomePortfolioItems } from "../../lib/supabase-queries";
import { hasDbData } from "../../lib/dataHandler";

// Hardcoded defaults
const DEFAULT_PORTFOLIO_ITEMS = [
  {
    id: '1',
    title: "E-commerce SEO Project",
    description: "Successfully optimized an e-commerce website, resulting in 250% increase in organic traffic and 40% increase in conversions within 6 months.",
    image_url: "https://via.placeholder.com/400?text=Portfolio+1",
  },
  {
    id: '2',
    title: "Local Business Ranking",
    description: "Helped a local service provider rank #1 for 15+ high-value keywords in their area, increasing leads by 300%.",
    image_url: "https://via.placeholder.com/400?text=Portfolio+2",
  },
  {
    id: '3',
    title: "Startup Growth Strategy",
    description: "Developed and executed a comprehensive SEO strategy for a tech startup, achieving top 3 rankings for competitive keywords.",
    image_url: "https://via.placeholder.com/400?text=Portfolio+3",
  },
];

const DEFAULT_PORTFOLIO_SECTION = {
  badge: "Portfolio",
  heading: "Featured Projects & Case Studies",
};

const PortfolioItems = ({ items, expandedCard, toggleDescription }) => (
  <>
    {items.map((item, index) => (
      <div
        className={`portfolio-card ${
          expandedCard === index ? "portfolio-card-expanded" : ""
        }`}
        key={item.id || index}
      >
        {item.title && <h3>{item.title}</h3>}

        {item.image_url && (
          <div className="portfolio-image">
            <img src={item.image_url} alt={item.title || 'Portfolio item'} />
          </div>
        )}

        {item.description && (
          <p
            className={`portfolio-description ${
              expandedCard === index ? "show-full-description" : ""
            }`}
          >
            {item.description}
          </p>
        )}

        <button
          type="button"
          className="portfolio-read-more"
          onClick={() => toggleDescription(index)}
        >
          {expandedCard === index ? "Read Less" : "Read More"}
        </button>
      </div>
    ))}
  </>
);

const Portfolio_Section = () => {
  const [projects, setProjects] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await fetchHomePortfolioItems();
      // Database-first: if data exists, use it; otherwise use defaults
      if (hasDbData(data)) {
        setProjects(data);
      } else {
        setProjects(DEFAULT_PORTFOLIO_ITEMS);
      }
    } catch (error) {
      console.error("Error loading projects, using defaults:", error);
      setProjects(DEFAULT_PORTFOLIO_ITEMS);
    } finally {
      setLoading(false);
    }
  };

  const toggleDescription = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  return (
    <section className="portfolio-section" id="portfolio">
      <div className="portfolio-heading">
        <div className="portfolio-badge">
          <FaHandPointRight />
          <span>{DEFAULT_PORTFOLIO_SECTION.badge}</span>
        </div>

        <h2>{DEFAULT_PORTFOLIO_SECTION.heading}</h2>
      </div>

      {projects && projects.length > 0 && (
        <div className="portfolio-row-wrapper">
          <div className="portfolio-cards">
            <div className="portfolio-group">
              <PortfolioItems
                items={projects}
                expandedCard={expandedCard}
                toggleDescription={toggleDescription}
              />
            </div>

            <div className="portfolio-group" aria-hidden="true">
              <PortfolioItems
                items={projects}
                expandedCard={expandedCard}
                toggleDescription={toggleDescription}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Portfolio_Section;
