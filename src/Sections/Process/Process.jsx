import React, { useEffect, useRef, useState } from "react";
import "./Process.css";
import { FaHandPointRight, FaLongArrowAltRight } from "react-icons/fa";
import { fetchProcessSteps } from "../../lib/supabase-queries";
import { iconMap } from "../../lib/iconMap";

const ProcessItems = ({ steps, showLastArrow = false }) => {
  return (
    <>
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="process-card">
            <div className="process-number">
              {String(index + 1).padStart(2, '0')}
            </div>
            <div className="process-icon">{iconMap[step.icon_name] || <span>•</span>}</div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
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
      setSteps(data);
    } catch (error) {
      console.error("Error loading steps:", error);
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

  if (loading) return <section className="process-section"><h2>Loading...</h2></section>;

  return (
    <section
      ref={sectionRef}
      className={`process-section ${isVisible ? "process-active" : ""}`}
    >
      <div className="process-heading">
        <div className="process-badge">
          <FaHandPointRight />
          <span>Our Process</span>
        </div>

        <h2>How We'll Work On Your Project</h2>
      </div>

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
    </section>
  );
};

export default Process;