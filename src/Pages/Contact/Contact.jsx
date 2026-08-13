import React, { useState } from "react";
import "./Contact.css";
import { Link } from "react-router-dom";

import {
  FaPhoneAlt,
  FaWhatsapp,
  FaEnvelope,
  FaLinkedinIn,
  FaFacebookF,
  FaArrowRight,
} from "react-icons/fa";

import { SiUpwork } from "react-icons/si";
import { createContactSubmission } from "../../lib/supabase-queries";

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    service: "Search Engine Optimization (SEO)",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMessage("");

    try {
      const submission = await createContactSubmission({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        service_interested: formData.service,
        message: formData.message,
        source_page_slug: "contact",
        status: "new",
      });

      if (submission) {
        setSubmitMessage("✅ Thank you! Your message has been sent successfully.");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          service: "Search Engine Optimization (SEO)",
          message: "",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitMessage("❌ Error sending message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero-content">
          <h1>Contact Us</h1>

          <div className="contact-breadcrumb">
            <Link to="/">Home</Link>
            <span></span>
            <p>Contact Us</p>
          </div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="contact-info-section">
        <div className="contact-info-grid">
          <div className="contact-info-card">
            <div className="contact-info-icon">
              <FaPhoneAlt />
            </div>

            <h3>Call Us Any Time</h3>
            <a href="tel:03272462207">0327 2462207</a>
          </div>

          <div className="contact-info-card">
            <div className="contact-info-icon">
              <FaWhatsapp />
            </div>

            <h3>Whatsapp Us</h3>
            <a
              href="https://wa.me/923272462207"
              target="_blank"
              rel="noreferrer"
            >
              0327 2462207
            </a>
          </div>

          <div className="contact-info-card">
            <div className="contact-info-icon">
              <FaEnvelope />
            </div>

            <h3>Email Us</h3>
            <a href="mailto:contact@seoprofessional.pk">
              contact@seoprofessional.pk
            </a>
          </div>
        </div>
      </section>

      {/* Contact Form + Map */}
      <section className="contact-main-section">
        <div className="contact-main-container">
          {/* Left Side */}
          <div className="contact-left">
            <div className="follow-box">
              <span className="contact-small-title">Follow Us</span>
              <h2>Let’s Stay Connected</h2>

              <div className="contact-socials">
                <a href="mailto:contact@seoprofessional.pk" aria-label="Email">
                  <FaEnvelope />
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

                <a
                  href="https://wa.me/923272462207"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                >
                  <FaWhatsapp />
                </a>
              </div>
            </div>

            <div className="map-box">
              <iframe
                title="Pakistan Map"
                src="https://www.google.com/maps?q=Pakistan&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Right Side Form */}
          <div className="contact-form-box">
            <span className="contact-small-title">Send Message</span>
            <h2>Get In Touch</h2>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Services</label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                  >
                    <option>Search Engine Optimization (SEO)</option>
                    <option>Generative Engine Optimization</option>
                    <option>Local SEO</option>
                    <option>AI Search Optimization</option>
                    <option>Web Development</option>
                    <option>Graphic Design</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea
                  name="message"
                  placeholder="Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              {submitMessage && (
                <div
                  style={{
                    padding: "10px",
                    borderRadius: "4px",
                    marginBottom: "10px",
                    background: submitMessage.includes("✅") ? "#d4edda" : "#f8d7da",
                    color: submitMessage.includes("✅") ? "#155724" : "#721c24",
                  }}
                >
                  {submitMessage}
                </div>
              )}

              <button
                type="submit"
                className="contact-submit-btn"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit"} <FaArrowRight />
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;