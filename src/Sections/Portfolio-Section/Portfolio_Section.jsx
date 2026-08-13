import React, { useEffect, useState } from "react";
import "./Portfolio_Section.css";
import { FaHandPointRight } from "react-icons/fa";
import { fetchHomePortfolioItems } from "../../lib/supabase-queries";

const PortfolioItems = ({ items, expandedCard, toggleDescription }) => (
  <>
    {items.map((item, index) => (
      <div
        className={`portfolio-card ${
          expandedCard === index ? "portfolio-card-expanded" : ""
        }`}
        key={index}
      >
        <h3>{item.title}</h3>

        {item.image_url && (
          <div className="portfolio-image">
            <img src={item.image_url} alt={item.title} />
          </div>
        )}

        <p
          className={`portfolio-description ${
            expandedCard === index ? "show-full-description" : ""
          }`}
        >
          {item.description}
        </p>

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
      setProjects(data);
    } catch (error) {
      console.error("Error loading projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDescription = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  if (loading) return <section className="portfolio-section"><h2>Loading...</h2></section>;

  return (
    <section className="portfolio-section" id="portfolio">
      <div className="portfolio-heading">
        <div className="portfolio-badge">
          <FaHandPointRight />
          <span>Portfolio</span>
        </div>

        <h2>Featured Projects & Case Studies</h2>
      </div>

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
    </section>
  );
};

export default Portfolio_Section;