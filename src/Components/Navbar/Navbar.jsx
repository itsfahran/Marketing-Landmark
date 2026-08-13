import React, { useState } from "react";
import "./Navbar.css";
import { NavLink } from "react-router-dom";
import {
  FaWhatsapp,
  FaLinkedinIn,
  FaChevronDown,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import profile from "../../assets/2.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServiceOpen, setIsServiceOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsServiceOpen(false);
  };

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
          <li>
            <NavLink
              to="/"
              onClick={closeMenu}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Home
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/about"
              onClick={closeMenu}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              About Me
            </NavLink>
          </li>

          <li className={`nav-dropdown ${isServiceOpen ? "service-open" : ""}`}>
            <button
              type="button"
              className={`dropdown-toggle ${
                location.pathname.includes("/services") ? "active" : ""
              }`}
              onClick={() => setIsServiceOpen(!isServiceOpen)}
            >
              Services <FaChevronDown className="dropdown-icon" />
            </button>

            <ul className="dropdown-menu">
              <li>
                <NavLink
                  to="/seo"
                  onClick={closeMenu}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  SEO Services In Pakistan
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/geo"
                  onClick={closeMenu}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  GEO Services In Pakistan
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/local"
                  onClick={closeMenu}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Local SEO Services In Pakistan
                </NavLink>
              </li>
            </ul>
          </li>

          <li>
            <NavLink
              to="/portfolio"
              onClick={closeMenu}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Portfolio
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/contact"
              onClick={closeMenu}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Contact Us
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/blog"
              onClick={closeMenu}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
           Blogs
            </NavLink>
          </li>
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