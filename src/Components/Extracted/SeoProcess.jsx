import React, { useEffect, useRef, useState } from 'react';
import { FaFileAlt, FaChartLine, FaKey, FaEdit, FaCog, FaLink, FaMapMarkerAlt, FaChartPie, FaLongArrowAltRight } from 'react-icons/fa';
import '../../Pages/Seo/Seo.css';

const SeoProcess = ({ processSteps = null, heading = null, description = null }) => {
  const defaultProcessSteps = [
    {
      icon: <FaFileAlt />,
      title: "Website Audit",
      desc: "Analyze the current site to identify issues and improvement opportunities.",
    },
    {
      icon: <FaChartLine />,
      title: "Competitor Analysis",
      desc: "Understand what's working best in your niche.",
    },
    {
      icon: <FaKey />,
      title: "Keyword Research",
      desc: "Find the right keywords that attract relevant audience.",
    },
    {
      icon: <FaEdit />,
      title: "On-Page Optimization",
      desc: "Improve website elements and content to make it search-friendly and user-focused.",
    },
    {
      icon: <FaCog />,
      title: "Technical SEO",
      desc: "Fix site technical issues, improve site speed, mobile-friendliness, and crawlability.",
    },
    {
      icon: <FaLink />,
      title: "Off-Page SEO",
      desc: "Analyze off-page SEO, fix errors, and create high-quality backlink & local citations.",
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "Local & GEO Optimization",
      desc: "Optimize GBP for local search visibility and target regional customers.",
    },
    {
      icon: <FaChartPie />,
      title: "Reporting & Growth",
      desc: "Track performance, analyze results, and scale visibility.",
    },
  ];

  const displaySteps = (processSteps && processSteps.length > 0)
    ? processSteps.map(step => ({
        icon: step.icon_name ? <span>{step.icon_name}</span> : <FaChartLine />,
        title: step.title,
        desc: step.description || step.desc,
      }))
    : defaultProcessSteps;

  const displayHeading = heading || 'How We\'ll Work On Your Website To Rank It On #1 Page Of Google';
  const displayDescription = description || '';

  const repeatedProcessSteps = [...displaySteps, ...displaySteps];
  const sectionRef = useRef(null);
  const [isProcessVisible, setIsProcessVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsProcessVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      className={`seo-process-section ${isProcessVisible ? 'seo-process-active' : ''}`}
      ref={sectionRef}
    >
      <div className="seo-process-container">
        <div className="seo-process-heading">
          <span className="seo-process-label">Our SEO Process</span>
          <h2>{displayHeading}</h2>
          {displayDescription && <p>{displayDescription}</p>}
        </div>

        <div className="seo-process-marquee">
          <div className="seo-process-track">
            {repeatedProcessSteps.map((step, index) => (
              <React.Fragment key={index}>
                <div className="seo-process-card">
                  <div className="seo-process-number">
                    {String((index % displaySteps.length) + 1).padStart(2, '0')}
                  </div>
                  <div className="seo-icon-circle">
                    <span>{step.icon}</span>
                  </div>

                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>

                {index !== repeatedProcessSteps.length - 1 && (
                  <div className="seo-process-arrow">
                    <FaLongArrowAltRight />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SeoProcess;
