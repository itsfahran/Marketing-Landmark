import React, { useState, useEffect } from "react";
import "./Portfolio.css";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import { fetchPortfolioCategories, fetchPortfolioProjects, fetchPortfolioPageHero } from "../../lib/supabase-queries";

const Portfolio = () => {
  const [heroData, setHeroData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPortfolioData();
  }, []);

  const loadPortfolioData = async () => {
    try {
      const [hero, cats, projs] = await Promise.all([
        fetchPortfolioPageHero(),
        fetchPortfolioCategories(),
        fetchPortfolioProjects(),
      ]);

      setHeroData(hero);
      setCategories(cats);
      setProjects(projs);

      if (cats.length > 0) {
        setActiveCategory(cats[0].name);
      }
    } catch (error) {
      console.error("Error loading portfolio:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  const filteredProjects = projects.filter(
    (item) => item.category === activeCategory
  );

  return (
    <main className="portfolio-page">
      <section className="portfolio-hero">
        <div className="portfolio-hero-content">
          <h1>{heroData?.title || "Portfolio"}</h1>

          <div className="portfolio-breadcrumb">
            <Link to="/">Home</Link>
            <span></span>
            <p>{heroData?.breadcrumb_label || "Portfolio"}</p>
          </div>
        </div>
      </section>

      <section className="portfolio-main">
        <div className="portfolio-strip">
          <h2>Our Portfolio</h2>
        </div>

        <div className="portfolio-container">
          <div className="portfolio-tabs">
            {categories.map((category) => (
              <button
                type="button"
                key={category.id}
                className={activeCategory === category.name ? "active-tab" : ""}
                onClick={() => setActiveCategory(category.name)}
              >
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          {filteredProjects.length > 0 ? (
            <div
              className={`portfolio-grid ${
                filteredProjects.length === 1 ? "single-card" : ""
              }`}
            >
              {filteredProjects.map((project) => (
                <article className="portfolio-card" key={project.id}>
                  <div className="portfolio-card-badge">
                    {project.category}
                  </div>

                  <h3>{project.title}</h3>

                  <div className="portfolio-image">
                    <img src={project.image_url} alt={project.title} />
                  </div>

                  <p>{project.description}</p>

                  <Link to={project.results_link || "/portfolio"} className="portfolio-btn">
                    See Results <FaArrowRight />
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="portfolio-empty">
              <h3>{activeCategory}</h3>
              <p>Projects for this category will be added soon.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Portfolio;