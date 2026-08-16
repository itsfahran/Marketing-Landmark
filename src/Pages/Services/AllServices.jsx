import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { fetchServices } from '../../lib/supabase-queries';
import './AllServices.css';

const AllServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await fetchServices(true); // Only active services
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
            width: '60px',
            height: '60px',
            objectFit: 'contain',
            marginBottom: '16px',
          }}
        />
      );
    }
    if (service.icon) {
      return (
        <div style={{ fontSize: '60px', marginBottom: '16px' }}>
          {service.icon}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="all-services-page">
        <div className="page-header">
          <h1>Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="all-services-page">
      <div className="page-header">
        <h1>All Services</h1>
        <p>Explore our complete range of digital solutions</p>
      </div>

      <div className="services-container">
        {services && services.length > 0 ? (
          <div className="services-grid">
            {services.map((service) => (
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
                  <div className="service-meta">
                    <span className="service-status">
                      {service.show_on_homepage && <span className="badge badge-featured">Featured</span>}
                      {service.show_in_navbar && <span className="badge badge-navbar">In Menu</span>}
                    </span>
                  </div>
                  <div className="service-link">
                    Learn More →
                  </div>
                </div>
              </NavLink>
            ))}
          </div>
        ) : (
          <div className="no-services">
            <p>No services found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllServices;
