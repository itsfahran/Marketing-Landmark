import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { fetchHomepageServices } from '../../lib/supabase-queries';
import { hasDbData } from '../../lib/dataHandler';
import './HomepageServices.css';

// Hardcoded defaults
const DEFAULT_HOMEPAGE_SERVICES = [
  {
    id: '1',
    title: 'SEO Optimization',
    description: 'Boost your online visibility with expert SEO strategies and proven techniques.',
    page_url: '/seo',
    icon: '🔍',
  },
  {
    id: '2',
    title: 'Local SEO',
    description: 'Dominate local search results and attract customers in your area.',
    page_url: '/local',
    icon: '📍',
  },
  {
    id: '3',
    title: 'Generative Engine Optimization',
    description: 'Optimize your presence on AI-powered search engines for better visibility.',
    page_url: '/geo',
    icon: '🤖',
  },
];

const HomepageServices = () => {
  const [services, setServices] = useState(DEFAULT_HOMEPAGE_SERVICES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await fetchHomepageServices();
      // Database-first: if data exists, use it; otherwise use defaults
      if (hasDbData(data)) {
        setServices(data);
      } else {
        setServices(DEFAULT_HOMEPAGE_SERVICES);
      }
    } catch (error) {
      console.error('Error loading services, using defaults:', error);
      setServices(DEFAULT_HOMEPAGE_SERVICES);
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

  if (services && services.length > 0) {
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
                  {(service.icon_url || service.icon) && (
                    <div className="service-icon">
                      {renderIcon(service)}
                    </div>
                  )}
                  {service.title && <h3>{service.title}</h3>}
                  {service.description && <p>{service.description}</p>}
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
  }

  return null;
};

export default HomepageServices;
