import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaBlog, FaBriefcase, FaEnvelope, FaBars, FaTimes, FaSignOutAlt, FaSearch, FaFileAlt } from 'react-icons/fa';
import '../../styles/admin-design-tokens.css';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const menuItems = [
    { label: 'Dashboard', path: '/admin', icon: FaHome },
    { label: 'Pages', path: '/admin/pages', icon: FaFileAlt },
    { label: 'Home Components', path: '/admin/home-components', icon: FaBlog },
    { label: 'About Page', path: '/admin/about-page', icon: FaBlog },
    { label: 'Portfolio Page', path: '/admin/portfolio-page', icon: FaBriefcase },
    { label: 'Blog Manager', path: '/admin/blog-manager', icon: FaBlog },
    { label: 'Contact Submissions', path: '/admin/contact-submissions', icon: FaEnvelope },
  ];

  const handleNavClick = (path) => {
    navigate(path);
    setMobileDrawerOpen(false);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: 'var(--background)' }}>
      {/* Desktop Sidebar */}
      <aside
        style={{
          width: sidebarOpen ? '260px' : '80px',
          backgroundColor: 'var(--surface)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width var(--transition-base)',
          position: 'relative',
          zIndex: 40,
        }}
        className="hidden md:flex"
      >
        {/* Sidebar Header */}
        <div
          style={{
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 'var(--spacing-lg)',
            paddingRight: 'var(--spacing-lg)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          {sidebarOpen && (
            <div>
              <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--text-primary)' }}>Admin</h2>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginTop: '2px' }}>Management Portal</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav
          style={{
            flex: 1,
            padding: 'var(--spacing-lg)',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-sm)',
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
                  gap: 'var(--spacing-md)',
                  padding: 'var(--spacing-md) var(--spacing-lg)',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: isActive ? 600 : 500,
                  transition: 'all var(--transition-fast)',
                  width: '100%',
                  justifyContent: sidebarOpen ? 'flex-start' : 'center',
                }}
                onMouseEnter={(e) => !isActive && (e.target.style.backgroundColor = '#f5f7fa')}
                onMouseLeave={(e) => !isActive && (e.target.style.backgroundColor = 'transparent')}
              >
                <Icon size={18} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div
          style={{
            borderTop: '1px solid var(--border)',
            padding: 'var(--spacing-lg)',
          }}
        >
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-md)',
              padding: 'var(--spacing-md) var(--spacing-lg)',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: 'transparent',
              color: 'var(--danger)',
              cursor: 'pointer',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 500,
              width: '100%',
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = 'var(--danger-light)')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
          >
            <FaSignOutAlt size={18} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 30,
            display: 'md' ? 'none' : 'block',
          }}
          onClick={() => setMobileDrawerOpen(false)}
        />
      )}
      <aside
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          height: '100%',
          width: '260px',
          backgroundColor: 'var(--surface)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          transform: mobileDrawerOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform var(--transition-base)',
          zIndex: 40,
        }}
        className="md:hidden"
      >
        {/* Sidebar Header */}
        <div
          style={{
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: 'var(--spacing-lg)',
            paddingRight: 'var(--spacing-lg)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div>
            <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--text-primary)' }}>Admin</h2>
          </div>
          <button
            onClick={() => setMobileDrawerOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav
          style={{
            flex: 1,
            padding: 'var(--spacing-lg)',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-sm)',
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
                  gap: 'var(--spacing-md)',
                  padding: 'var(--spacing-md) var(--spacing-lg)',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: isActive ? 600 : 500,
                  transition: 'all var(--transition-fast)',
                  width: '100%',
                  justifyContent: 'flex-start',
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Navbar */}
        <header
          style={{
            height: '64px',
            backgroundColor: 'var(--surface)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: 'var(--spacing-lg)',
            paddingRight: 'var(--spacing-lg)',
            position: 'sticky',
            top: 0,
            zIndex: 30,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)' }}>
            <button
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                display: 'none',
              }}
              className="md:hidden"
            >
              <FaBars size={20} />
            </button>
            <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--text-primary)' }}>Admin Panel</h1>
          </div>

          {/* Search & Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)' }}>
            <div
              style={{
                position: 'relative',
                width: '300px',
                display: 'flex',
                alignItems: 'center',
              }}
              className="hidden md:flex"
            >
              <FaSearch
                style={{
                  position: 'absolute',
                  left: 'var(--spacing-md)',
                  color: 'var(--text-muted)',
                  fontSize: '14px',
                }}
              />
              <input
                type="text"
                placeholder="Search..."
                style={{
                  width: '100%',
                  height: '40px',
                  paddingLeft: 'var(--spacing-2xl)',
                  paddingRight: 'var(--spacing-lg)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--background)',
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            {/* Profile Avatar */}
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 'var(--spacing-2xl)',
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
