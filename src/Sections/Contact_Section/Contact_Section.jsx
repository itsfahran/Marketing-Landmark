import React, { useEffect, useState } from "react";
import "./Contact_Section.css";
import {
  FaWhatsapp,
  FaPaperPlane,
  FaEnvelope,
  FaUser,
} from "react-icons/fa";
import { fetchContactSection } from "../../lib/supabase-queries";

const Contact_Section = () => {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContact();
  }, []);

  const loadContact = async () => {
    try {
      const data = await fetchContactSection();
      setContact(data);
    } catch (error) {
      console.error("Error loading contact:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !contact) return <section className="contact-section"><h2>Loading...</h2></section>;

  const extractDigits = (str) => {
    if (!str) return "";
    const digits = [];
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      if (char >= "0" && char <= "9") {
        digits.push(char);
      }
    }
    return digits.join("");
  };

  const phoneDigits = extractDigits(contact.phone);
  const whatsappUrl = `https://wa.me/${phoneDigits}`;

  return (
    <section className="contact-section" id="contact">
      <div className="contact-container">
        <div className="contact-left">
          <h2>{contact.heading}</h2>

          <p className="contact-desc">
            {contact.description}
          </p>

          <p className="whatsapp-text">
            Fill out the form or contact us directly on{" "}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
            >
              <FaWhatsapp /> WhatsApp
            </a>{" "}
            to get your free quote.
          </p>
        </div>

        <form className="contact-form">
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <div className="input-box">
                <FaUser />
                <input type="text" placeholder="First Name" />
              </div>
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <div className="input-box">
                <FaUser />
                <input type="text" placeholder="Last Name" />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Services</label>
              <select>
                <option>Search Engine Optimization (SEO)</option>
                <option>Generative Engine Optimization (GEO)</option>
                <option>Local SEO</option>
                <option>Web Design & Development</option>
                <option>Digital Marketing</option>
              </select>
            </div>

            <div className="form-group">
              <label>Email</label>
              <div className="input-box">
                <FaEnvelope />
                <input type="email" placeholder="Email" />
              </div>
            </div>
          </div>

          <div className="form-group full-width">
            <label>Message</label>
            <textarea placeholder="Write your message..."></textarea>
          </div>

          <button type="submit" className="contact-submit">
            Submit <FaPaperPlane />
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact_Section;