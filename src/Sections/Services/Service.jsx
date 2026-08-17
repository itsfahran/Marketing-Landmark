import React, { useEffect, useState } from "react";
import "./Service.css";
import {
  FaHandPointRight,
  FaArrowRight,
  FaSearchengin,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { MdAutoGraph } from "react-icons/md";
import { fetchServices } from "../../lib/supabase-queries";
import { hasDbData } from "../../lib/dataHandler";

const iconMap = {
  FaSearch: <FaSearchengin />,
  FaMapMarkerAlt: <FaMapMarkerAlt />,
  MdAutoGraph: <MdAutoGraph />,
};

// Hardcoded defaults
const DEFAULT_SERVICES = [
  {
    id: '1',
    icon_name: 'FaSearch',
    name: 'SEO Optimization',
    description: 'Boost your online visibility with expert SEO strategies',
  },
  {
    id: '2',
    icon_name: 'FaMapMarkerAlt',
    name: 'Local SEO',
    description: 'Dominate local search results in your area',
  },
  {
    id: '3',
    icon_name: 'MdAutoGraph',
    name: 'Growth Marketing',
    description: 'Accelerate your business growth with data-driven strategies',
  },
];

const DEFAULT_SERVICE_SECTION = {
  badge: "What We Offer",
  heading: "Our Services",
};

const Service = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await fetchServices();
      // Database-first: if data exists, use it; otherwise use defaults
      if (hasDbData(data)) {
        setServices(data);
      } else {
        setServices(DEFAULT_SERVICES);
      }
    } catch (error) {
      console.error("Error loading services, using defaults:", error);
      setServices(DEFAULT_SERVICES);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="service-section">
      <div className="service-header">
        <div>
          <div className="service-badge">
            <FaHandPointRight />
            <span>{DEFAULT_SERVICE_SECTION.badge}</span>
          </div>

          <h2>{DEFAULT_SERVICE_SECTION.heading}</h2>
        </div>

        <a href="/services" className="view-all-btn">
          View All Services <FaArrowRight />
        </a>
      </div>

      {services && services.length > 0 && (
        <div className="service-cards">
          {services.map((service) => (
            <div className="service-card" key={service.id || service.name}>
              {service.icon_name && (
                <div className="service-icon">
                  {iconMap[service.icon_name] || <FaSearchengin />}
                </div>
              )}

              {service.name && <h3>{service.name}</h3>}

              {service.description && <p>{service.description}</p>}

              <a href="#" className="service-btn">
                Learn More <FaArrowRight />
              </a>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Service;
