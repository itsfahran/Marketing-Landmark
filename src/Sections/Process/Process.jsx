import React, { useEffect, useRef, useState } from "react";
import "./Process.css";
import { FaHandPointRight, FaLongArrowAltRight } from "react-icons/fa";
import { fetchProcessSteps } from "../../lib/supabase-queries";
import { iconMap } from "../../lib/iconMap";
import { hasDbData } from "../../lib/dataHandler";

// Hardcoded defaults
const DEFAULT_PROCESS_STEPS = [
  {
    icon_name: "FaLightbulb",
    title: "Research & Strategy",
    description: "We analyze your business, competitors, and target audience to develop a custom strategy.",
  },
  {
    icon_name: "FaRuler",
    title: "Planning & Design",
    description: "We create detailed plans and design mockups to visualize the solution before development.",
  },
  {
    icon_name: "FaCode",
    title: "Development",
    description: "Our developers build your project with clean, efficient, and scalable code.",
  },
  {
    icon_name: "FaFlask",
    title: "Testing & QA",
    description: "We thoroughly test the solution to ensure quality, security, and performance.",
  },
  {
    icon_name: "FaRocket",
    title: "Launch",
    description: "We deploy your project and ensure everything runs smoothly in production.",
  },
];

const DEFAULT_PROCESS = {
  badge: "Our Process",
  heading: "How We'll Work On Your Project",
};

const ProcessItems = ({ steps, showLastArrow = false }) => {
  return (
    <>
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="process-card">
            <div className="process-number">
              {String(index + 1).padStart(2, '0')}
            </div>
            {step.icon_name && (
              <div className="process-icon">
                {iconMap[step.icon_name] || <span>•</span>}
              </div>
            )}
            {step.title && <h3>{step.title}</h3>}
            {step.description && <p>{step.description}</p>}
          </div>

          {(index < steps.length - 1 || showLastArrow) && (
            <div className="process-arrow">
              <FaLongArrowAltRight />
            </div>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

const Process = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSteps();
  }, []);

  const loadSteps = async () => {
    try {
      const data = await fetchProcessSteps();
      // Database-first: if data exists, use it; otherwise use defaults
      if (hasDbData(data)) {
        setSteps(data);
      } else {
        setSteps(DEFAULT_PROCESS_STEPS);
      }
    } catch (error) {
      console.error("Error loading steps, using defaults:", error);
      setSteps(DEFAULT_PROCESS_STEPS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentSection = sectionRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.35,
      }
    );

    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`process-section ${isVisible ? "process-active" : ""}`}
    >
      <div className="process-heading">
        <div className="process-badge">
          <FaHandPointRight />
          <span>{DEFAULT_PROCESS.badge}</span>
        </div>

        <h2>{DEFAULT_PROCESS.heading}</h2>
      </div>

      {steps && steps.length > 0 && (
        <div className="process-marquee">
          <div className="process-track">
            <div className="process-slide-group">
              <ProcessItems steps={steps} showLastArrow={true} />
            </div>

            <div className="process-slide-group" aria-hidden="true">
              <ProcessItems steps={steps} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Process;
