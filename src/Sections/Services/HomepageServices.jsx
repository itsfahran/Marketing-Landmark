import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { fetchHomepageServices } from '../../lib/supabase-queries';
import './HomepageServices.css';

const HomepageServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await fetchHomepageServices();
      setServices(data || []);
    } catch (error) {
      console.error('Error loading services:', error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const renderIcon = (service) => {
    if (service.icon_url) {
      return (
        <img
          src={service.icon_url}
          alt={service.title}
          style={{
            width: '48px',
            height: '48px',
            objectFit: 'contain',
            marginBottom: '16px',
          }}
        />
      );
    }
    if (service.icon) {
      return (
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>
          {service.icon}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return <section className="homepage-services"><p>Loading...</p></section>;
  }

  if (!services || services.length === 0) {
    return null;
  }

  return (
    <section className="homepage-services">
      <div className="services-container">
        <div className="services-header">
          <h2>Our Services</h2>
          <p>Choose from our specialized digital solutions</p>
        </div>

        <div className="services-grid">
          {services.slice(0, 3).map((service) => (
            <NavLink
              key={service.id}
              to={service.page_url || '#'}
              className="service-card-link"
              style={{ textDecoration: 'none' }}
            >
              <div className="service-card">
                <div className="service-icon">
                  {renderIcon(service)}
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <div className="service-link">
                  Learn More →
                </div>
              </div>
            </NavLink>
          ))}
        </div>

        {services.length > 3 && (
          <div className="services-footer">
            <NavLink to="/services" className="view-all-btn">
              View All Services
            </NavLink>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomepageServices;
