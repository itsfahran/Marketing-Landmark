import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

import {
  FaFacebookF,
  FaLinkedinIn,
  FaWhatsapp,
  FaEnvelope,
  FaPhoneAlt,
  FaArrowRight,
} from "react-icons/fa";

import { SiUpwork } from "react-icons/si";
import hero from "../../assets/2.png";

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-wrapper">
        {/* Brand Area */}
        <div className="footer-brand">
          <div className="footer-logo-box">
            <img src={hero} alt="SEO Professional" />

            {/* <div>
              <h3>SEO Professional</h3>
              <span>Certified SEO Expert</span>
            </div> */}
          </div>

          <p>
            Farhan Ali is an experienced and certified Professional SEO Expert
            with specialized expertise in GEO, AEO, AI Search Engine Optimization
            and Local SEO.
          </p>

          <div className="footer-socials">
            <a href="contact@marketinglandmark.com" aria-label="Email">
              <FaEnvelope />
            </a>

            <a
              href="https://wa.me/923272462207"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
            >
              <FaWhatsapp />
            </a>

            <a href="#" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>

            <a href="#" aria-label="Facebook">
              <FaFacebookF />
            </a>

            <a href="#" aria-label="Upwork">
              <SiUpwork />
            </a>
          </div>
        </div>

        {/* Quick Menu */}
        <div className="footer-column">
          <h4>Quick Menu</h4>

          <ul>
            <li>
              <Link to="/">
                <FaArrowRight /> Home
              </Link>
            </li>

            <li>
              <Link to="/about">
                <FaArrowRight /> About
              </Link>
            </li>

            <li>
              <Link to="/portfolio">
                <FaArrowRight /> Portfolio
              </Link>
            </li>

            <li>
              <Link to="/contact">
                <FaArrowRight /> Contact
              </Link>
            </li>
            <li>
              <Link to="/contact">
                <FaArrowRight /> Career
              </Link>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div className="footer-column">
          <h4>Services</h4>

          <ul>
            <li>
              <a href="/#services">
                <FaArrowRight /> Search Engine Optimization
              </a>
            </li>

            <li>
              <a href="/#services">
                <FaArrowRight /> Generative Engine Optimization
              </a>
            </li>

            <li>
              <a href="/#services">
                <FaArrowRight /> Local SEO
              </a>
            </li>

            {/* <li>
              <a href="/#services">
                <FaArrowRight /> AI Search Optimization
              </a>
            </li> */}
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-column footer-contact">
          <h4>Contact Us</h4>

          <div className="contact-row">
            <span>
              <FaPhoneAlt />
            </span>
            <a href="tel:03272462207">0327 2462207</a>
          </div>

          <div className="contact-row">
            <span>
              <FaWhatsapp />
            </span>
            <a
              href="https://wa.me/923272462207"
              target="_blank"
              rel="noreferrer"
            >
              0327 2462207
            </a>
          </div>

          <div className="contact-row">
            <span>
              <FaEnvelope />
            </span>
            <a href="mailto:contact@seoprofessional.pk">
              contact@marketinglandmark.com
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© Copyright 2025-2026 Marketing Landmark. All Rights Reserved.</p>

        <div className="footer-bottom-links">
          <Link to="/">Privacy Policy</Link>
          <Link to="/">Terms & Conditions</Link>
          <Link to="/contact">Contact Support</Link>
        </div>
      </div>

      <a
        href="https://wa.me/923272462207"
        className="whatsapp-float"
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
      >
        <FaWhatsapp />
      </a>
    </footer>
  );
};

export default Footer;