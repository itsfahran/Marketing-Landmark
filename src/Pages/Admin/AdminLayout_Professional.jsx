import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaBlog, FaBriefcase, FaEnvelope, FaBars, FaTimes, FaSignOutAlt, FaCog, FaLink, FaStar, FaFileAlt, FaChevronRight } from 'react-icons/fa';
import '../../styles/admin-professional.css';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const menuItems = [
    { label: 'Dashboard', path: '/admin', icon: FaHome },
    { label: 'Pages', path: '/admin/pages', icon: FaFileAlt },
    { label: 'Services', path: '/admin/services-manager', icon: FaCog },
    { label: 'Home Components', path: '/admin/home-components', icon: FaBlog },
    { label: 'About Page', path: '/admin/about-page', icon: FaBlog },
    { label: 'Portfolio', path: '/admin/portfolio-page', icon: FaBriefcase },
    { label: 'Blog', path: '/admin/blog-manager', icon: FaBlog },
    { label: 'Navbar', path: '/admin/navbar-manager', icon: FaLink },
    { label: 'Testimonials', path: '/admin/testimonials-manager', icon: FaStar },
    { label: 'Submissions', path: '/admin/contact-submissions', icon: FaEnvelope },
  ];

  const handleNavClick = (path) => {
    navigate(path);
    setMobileDrawerOpen(false);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: 'var(--admin-gray-50)' }}>
      {/* Desktop Sidebar */}
      <aside
        style={{
          width: sidebarOpen ? '280px' : '80px',
          backgroundColor: 'var(--admin-primary)',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width var(--admin-transition-base)',
          position: 'relative',
          zIndex: 40,
          boxShadow: 'var(--admin-shadow-lg)',
        }}
        className="hidden md:flex"
      >
        {/* Sidebar Header */}
        <div
          style={{
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            padding: '0 var(--admin-spacing-lg)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'all var(--admin-transition-base)',
          }}
        >
          {sidebarOpen ? (
            <div>
              <div style={{ fontSize: 'var(--admin-font-size-lg)', fontWeight: 700, marginBottom: '4px' }}>
                Admin
              </div>
              <div style={{ fontSize: 'var(--admin-font-size-xs)', opacity: 0.7 }}>
                Management
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '24px' }}>⚙️</div>
          )}
        </div>

        {/* Navigation */}
        <nav
          style={{
            flex: 1,
            padding: 'var(--admin-spacing-lg)',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--admin-spacing-sm)',
          }}
        >
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--admin-spacing-md)',
                  padding: 'var(--admin-spacing-md) var(--admin-spacing-lg)',
                  borderRadius: 'var(--admin-radius-lg)',
                  border: 'none',
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  color: isActive ? 'white' : 'rgba(255, 255, 255, 0.7)',
                  cursor: 'pointer',
                  fontSize: 'var(--admin-font-size-sm)',
                  fontWeight: isActive ? 600 : 500,
                  transition: 'all var(--admin-transition-base)',
                  width: '100%',
                  justifyContent: sidebarOpen ? 'flex-start' : 'center',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <Icon size={18} />
                {sidebarOpen && (
                  <>
                    <span>{item.label}</span>
                    {isActive && (
                      <FaChevronRight size={12} style={{ marginLeft: 'auto', opacity: 0.7 }} />
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div
          style={{
            padding: 'var(--admin-spacing-lg)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--admin-spacing-md)',
              padding: 'var(--admin-spacing-md) var(--admin-spacing-lg)',
              borderRadius: 'var(--admin-radius-lg)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backgroundColor: 'transparent',
              color: 'white',
              cursor: 'pointer',
              fontSize: 'var(--admin-font-size-sm)',
              fontWeight: 500,
              transition: 'all var(--admin-transition-base)',
              width: '100%',
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <FaSignOutAlt size={18} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Bar */}
        <div
          style={{
            backgroundColor: 'white',
            borderBottom: '1px solid var(--admin-gray-200)',
            padding: 'var(--admin-spacing-lg) var(--admin-spacing-2xl)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: 'var(--admin-shadow-xs)',
          }}
        >
          <button
            className="md:hidden"
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 'var(--admin-font-size-lg)',
              cursor: 'pointer',
              color: 'var(--admin-primary)',
            }}
          >
            {mobileDrawerOpen ? <FaTimes /> : <FaBars />}
          </button>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--admin-spacing-lg)', alignItems: 'center' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden md:block"
              style={{
                background: 'none',
                border: 'none',
                fontSize: 'var(--admin-font-size-lg)',
                cursor: 'pointer',
                color: 'var(--admin-primary)',
                padding: '8px 12px',
                borderRadius: 'var(--admin-radius-lg)',
                transition: 'all var(--admin-transition-base)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--admin-gray-100)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {sidebarOpen ? '«' : '»'}
            </button>

            {/* User Profile */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--admin-spacing-md)',
              paddingLeft: 'var(--admin-spacing-lg)',
              borderLeft: '1px solid var(--admin-gray-200)',
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--admin-primary)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
              }}>
                A
              </div>
              <div className="hidden sm:block">
                <div style={{ fontSize: 'var(--admin-font-size-sm)', fontWeight: 600, color: 'var(--admin-primary)' }}>
                  Admin
                </div>
                <div style={{ fontSize: 'var(--admin-font-size-xs)', color: 'var(--admin-gray-500)' }}>
                  Administrator
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 30,
          }}
          onClick={() => setMobileDrawerOpen(false)}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '80%',
              maxWidth: '280px',
              backgroundColor: 'var(--admin-primary)',
              color: 'white',
              padding: 'var(--admin-spacing-lg)',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ marginBottom: 'var(--admin-spacing-2xl)' }}>
              <h2 style={{ fontSize: 'var(--admin-font-size-lg)', fontWeight: 700, margin: 0 }}>
                Admin Menu
              </h2>
            </div>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--admin-spacing-md)',
                    padding: 'var(--admin-spacing-md) var(--admin-spacing-lg)',
                    borderRadius: 'var(--admin-radius-lg)',
                    border: 'none',
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: 'var(--admin-font-size-sm)',
                    fontWeight: isActive ? 600 : 500,
                    width: '100%',
                    justifyContent: 'flex-start',
                    marginBottom: 'var(--admin-spacing-sm)',
                  }}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
