import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { NavLink } from "react-router-dom";
import {
  FaWhatsapp,
  FaLinkedinIn,
  FaChevronDown,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { fetchNavbarMenuItems, fetchNavbarServices } from "../../lib/supabase-queries";
import profile from "../../assets/2.png";

// Default hardcoded menu items as fallback
const DEFAULT_MENU_ITEMS = [
  { id: 1, label: '🏠 Home', url: '/', icon: '🏠', order_position: 0, is_active: true, open_in_new_tab: false },
  { id: 2, label: '👤 About Me', url: '/about', icon: '👤', order_position: 1, is_active: true, open_in_new_tab: false },
  { id: 3, label: '💼 Services', url: '#', icon: '💼', order_position: 2, is_active: true, open_in_new_tab: false, has_children: true },
  { id: 4, label: 'SEO Services In Pakistan', url: '/seo', icon: null, order_position: 0, is_active: true, open_in_new_tab: false, parent_id: 3 },
  { id: 5, label: 'GEO Services In Pakistan', url: '/geo', icon: null, order_position: 1, is_active: true, open_in_new_tab: false, parent_id: 3 },
  { id: 6, label: 'Local SEO Services In Pakistan', url: '/local', icon: null, order_position: 2, is_active: true, open_in_new_tab: false, parent_id: 3 },
  { id: 7, label: '🎨 Portfolio', url: '/portfolio', icon: '🎨', order_position: 3, is_active: true, open_in_new_tab: false },
  { id: 8, label: '📧 Contact Us', url: '/contact', icon: '📧', order_position: 4, is_active: true, open_in_new_tab: false },
  { id: 9, label: '📝 Blogs', url: '/blog', icon: '📝', order_position: 5, is_active: true, open_in_new_tab: false },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState(DEFAULT_MENU_ITEMS);
  const [loading, setLoading] = useState(true);
  const [openDropdowns, setOpenDropdowns] = useState({});

  useEffect(() => {
    loadNavbarItems();
  }, []);

  const loadNavbarItems = async () => {
    try {
      const [items, services] = await Promise.all([
        fetchNavbarMenuItems(),
        fetchNavbarServices(),
      ]);

      if (items && items.length > 0) {
        // Convert services to navbar child items
        const serviceItems = (services || []).map((service, idx) => ({
          id: `service-${service.id}`,
          label: service.title,
          url: service.page_url,
          icon: service.icon_url || service.icon,
          order_position: idx,
          is_active: service.is_active,
          open_in_new_tab: false,
          parent_id: items.find(i => i.label.toLowerCase().includes('service'))?.id,
        }));

        // Merge items with service children
        const servicesItem = items.find(i => i.label.toLowerCase().includes('service'));
        if (servicesItem && serviceItems.length > 0) {
          // Replace hardcoded service children with database services
          const filteredItems = items.filter(i => !i.parent_id);
          setMenuItems([...filteredItems, ...serviceItems]);
        } else {
          setMenuItems(items);
        }
      }
    } catch (error) {
      console.error('Error loading navbar items:', error);
      // Falls back to DEFAULT_MENU_ITEMS
    } finally {
      setLoading(false);
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setOpenDropdowns({});
  };

  const toggleDropdown = (itemId) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Group items into parent/child structure
  const topLevelItems = menuItems.filter(item => !item.parent_id).sort((a, b) => a.order_position - b.order_position);
  const childItemsMap = {};
  menuItems.forEach(item => {
    if (item.parent_id) {
      if (!childItemsMap[item.parent_id]) {
        childItemsMap[item.parent_id] = [];
      }
      childItemsMap[item.parent_id].push(item);
    }
  });

  const renderIcon = (item) => {
    if (item.icon_url) {
      return (
        <img
          src={item.icon_url}
          alt={item.label}
          style={{
            width: '20px',
            height: '20px',
            marginRight: '5px',
            objectFit: 'contain',
          }}
        />
      );
    }
    if (item.icon) {
      return <span style={{ marginRight: '5px' }}>{item.icon}</span>;
    }
    return null;
  };

  const renderMenuItem = (item) => {
    const hasChildren = childItemsMap[item.id] && childItemsMap[item.id].length > 0;
    const isDropdownOpen = openDropdowns[item.id];
    const children = childItemsMap[item.id] || [];

    if (hasChildren) {
      return (
        <li key={item.id} className={`nav-dropdown ${isDropdownOpen ? "service-open" : ""}`}>
          <button
            type="button"
            className="dropdown-toggle"
            onClick={() => toggleDropdown(item.id)}
          >
            {renderIcon(item)}
            {item.label.replace(/^[^ ]+ /, '')} <FaChevronDown className="dropdown-icon" />
          </button>
          <ul className="dropdown-menu">
            {children.sort((a, b) => a.order_position - b.order_position).map(child => (
              <li key={child.id}>
                <NavLink
                  to={child.url}
                  onClick={closeMenu}
                  target={child.open_in_new_tab ? '_blank' : '_self'}
                  rel={child.open_in_new_tab ? 'noreferrer' : ''}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  {renderIcon(child)}
                  {child.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </li>
      );
    }

    return (
      <li key={item.id}>
        <NavLink
          to={item.url}
          onClick={closeMenu}
          target={item.open_in_new_tab ? '_blank' : '_self'}
          rel={item.open_in_new_tab ? 'noreferrer' : ''}
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          {renderIcon(item)}
          {item.label.replace(/^[^ ]+ /, '')}
        </NavLink>
      </li>
    );
  };

  if (loading) {
    return (
      <header className="navbar-wrapper">
        <nav className="navbar">
          <div className="navbar-logo">
            <img src={profile} alt="Profile" />
          </div>
        </nav>
      </header>
    );
  }

  return (
    <header className="navbar-wrapper">
      <nav className="navbar">
        <div className="navbar-logo">
          <img src={profile} alt="Profile" />
        </div>

        <button
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          type="button"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <ul className={`navbar-menu ${isMenuOpen ? "show-menu" : ""}`}>
          {topLevelItems.map(item => renderMenuItem(item))}
        </ul>

        <div className="navbar-icons">
          <a href="https://wa.me/923000000000" target="_blank" rel="noreferrer">
            <FaWhatsapp />
          </a>

          <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
            <FaLinkedinIn />
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;