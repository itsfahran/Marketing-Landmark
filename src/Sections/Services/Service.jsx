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

const Service = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await fetchServices();
      setServices(data);
    } catch (error) {
      console.error("Error loading services:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <section className="service-section"><h2>Loading...</h2></section>;
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