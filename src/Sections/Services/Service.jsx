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

const iconMap = {
  FaSearch: <FaSearchengin />,
  FaMapMarkerAlt: <FaMapMarkerAlt />,
  MdAutoGraph: <MdAutoGraph />,
};

const defaultServices = [
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

const Service = () => {
  const [services, setServices] = useState(defaultServices);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await fetchServices();
      if (data && data.length > 0) {
        setServices(data);
      }
    } catch (error) {
      console.error("Error loading services:", error);
    }
  };
  return (
    <section className="service-section">
      <div className="service-header">
        <div>
          <div className="service-badge">
            <FaHandPointRight />
            <span>What We Offer</span>
          </div>

          <h2>Our Services</h2>
        </div>

        <a href="/services" className="view-all-btn">
          View All Services <FaArrowRight />
        </a>
      </div>

      <div className="service-cards">
        {services.map((service) => (
          <div className="service-card" key={service.id}>
            <div className="service-icon">{iconMap[service.icon_name] || <FaSearchengin />}</div>

            <h3>{service.name}</h3>

            <p>{service.description}</p>

            <a href="#" className="service-btn">
              Learn More <FaArrowRight />
            </a>
          </div>
        ))}
      </div>

      
    </section>
  );
};

export default Service;