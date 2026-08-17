import React, { useEffect, useRef, useState } from "react";
import "./About_Section.css";
import { FaHandPointRight } from "react-icons/fa";
import aboutImg from "../../assets/hero.png";
import { fetchAbout } from "../../lib/supabase-queries";
import { hasDbData } from "../../lib/dataHandler";

// Hardcoded defaults
const DEFAULT_ABOUT = {
  description: "Hi, I'm Farhan Ali, an SEO professional dedicated to helping businesses improve their online visibility and reach their target audience. With years of experience in search engine optimization, local SEO, and digital marketing, I've helped numerous businesses achieve their goals through strategic, result-driven SEO solutions. My mission is to empower businesses with the visibility they deserve.",
  satisfaction_rate: 95,
  total_projects: 150,
  years_experience: 5,
};

const About_Section = () => {
  const sectionRef = useRef(null);
  const hasCounterStarted = useRef(false);

  const [about, setAbout] = useState(DEFAULT_ABOUT);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [projects, setProjects] = useState(0);
  const [industries, setIndustries] = useState(0);

  useEffect(() => {
    loadAbout();
  }, []);

  const loadAbout = async () => {
    try {
      const data = await fetchAbout();
      // Database-first: if data exists, use it; otherwise use defaults
      if (hasDbData(data)) {
        setAbout(data);
      } else {
        setAbout(DEFAULT_ABOUT);
      }
    } catch (error) {
      console.error("Error loading about, using defaults:", error);
      setAbout(DEFAULT_ABOUT);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!about || loading) return;

    const currentSection = sectionRef.current;

    const startCounter = (endValue, setter, duration = 1800) => {
      let startValue = 0;
      const incrementTime = 20;
      const totalSteps = duration / incrementTime;
      const incrementValue = endValue / totalSteps;

      const counter = setInterval(() => {
        startValue += incrementValue;

        if (startValue >= endValue) {
          setter(endValue);
          clearInterval(counter);
        } else {
          setter(Math.floor(startValue));
        }
      }, incrementTime);
    };

    const startAllCounters = () => {
      startCounter(about.satisfaction_rate || 0, setRating);
      startCounter(about.total_projects || 0, setProjects);
      startCounter(about.years_experience || 0, setIndustries);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasCounterStarted.current) {
          hasCounterStarted.current = true;
          startAllCounters();
        }
      },
      { threshold: 0.35 }
    );

    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, [about, loading]);

  return (
    <section className="about-sec-section" id="about" ref={sectionRef}>
      <div className="about-sec-container">
        <div className="about-sec-visual">
          <div className="about-sec-circle"></div>

          <img
            src={aboutImg}
            alt="Farhan Ali"
            className="about-sec-main-image"
          />

          <div className="about-sec-name-card">
            <h3>Farhan Ali</h3>
            <span>Founder & SEO Professional</span>
          </div>
        </div>

        <div className="about-sec-content">
          <div className="about-sec-badge">
            <FaHandPointRight />
            <span>Founder Message</span>
          </div>

          <h2>
            <span>WELCOME MESSAGE</span>
            <span>
              FROM <strong>FOUNDER</strong>
            </span>
          </h2>

          <div className="about-sec-divider"></div>

          <h4>Welcome Message</h4>

          {about.description && <p>{about.description}</p>}

          <div className="about-sec-stats">
            <div className="about-sec-stat-box">
              <h3>{rating}%</h3>
              <p>Client Satisfaction</p>
            </div>

            <div className="about-sec-stat-box">
              <h3>{projects}+</h3>
              <p>Projects Done</p>
            </div>

            <div className="about-sec-stat-box">
              <h3>{industries}+</h3>
              <p>Years Experience</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About_Section;
