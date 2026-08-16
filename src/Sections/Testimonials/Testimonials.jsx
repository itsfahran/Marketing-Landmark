import React, { useEffect, useState } from "react";
import "./Testimonials.css";
import { FaHandPointRight, FaStar } from "react-icons/fa";
import { fetchHomeTestimonials } from "../../lib/supabase-queries";

const READ_MORE_LIMIT = 135;

// Platform icons/badges
const PLATFORM_ICONS = {
  upwork: '💼',
  fiverr: '⭐',
  linkedin: '💼',
  google: '🔍',
  freelancer: '👨‍💼',
  other: '⭐',
};

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [expandedCards, setExpandedCards] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      console.log("Starting to fetch testimonials...");

      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Testimonials fetch timeout")), 10000)
      );

      const data = await Promise.race([fetchHomeTestimonials(), timeoutPromise]);
      console.log("Testimonials fetched successfully:", data);
      setTestimonials(data || []);
    } catch (error) {
      console.error("Error loading testimonials:", error);
      setTestimonials([]);
    } finally {
      console.log("Setting loading to false");
      setLoading(false);
    }
  };

  const toggleReadMore = (cardId) => {
    setExpandedCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  const renderText = (text, cardId) => {
    if (!text) return <p>No testimonial text</p>;
    const isLongText = text.length > READ_MORE_LIMIT;
    const isExpanded = expandedCards[cardId];

    if (!isLongText) {
      return <p>{text}</p>;
    }

    return (
      <>
        <p>
          {isExpanded ? text : `${text.slice(0, READ_MORE_LIMIT)}...`}
        </p>

        <button
          type="button"
          className="read-more-btn"
          onClick={() => toggleReadMore(cardId)}
        >
          {isExpanded ? "Read Less" : "Read More"}
        </button>
      </>
    );
  };

  const renderTestimonialCard = (testimonial, index) => {
    const cardId = `testimonial-${index}`;
    const platformIcon = PLATFORM_ICONS[testimonial.source_platform] || PLATFORM_ICONS.other;

    return (
      <div
        className={`testimonial-card ${
          expandedCards[cardId] ? "expanded-card" : ""
        }`}
        key={cardId}
      >
        {/* Platform Badge - Top Right */}
        <div className="platform-badge" title={testimonial.source_platform}>
          {platformIcon}
        </div>

        <div className="client-info">
          {(testimonial.client_image || testimonial.client_avatar_url) && (
            <img src={testimonial.client_image || testimonial.client_avatar_url} alt={testimonial.client_name} />
          )}

          <div>
            <h3>{testimonial.client_name || "Anonymous"}</h3>
            <span>{testimonial.client_title || testimonial.client_role || ""}</span>
          </div>
        </div>

        <div className="stars">
          {[...Array(testimonial.rating || 5)].map((_, i) => (
            <FaStar key={i} />
          ))}
        </div>

        <div className="testimonial-text-wrap">
          {renderText(testimonial.testimonial_text || testimonial.review_text || testimonial.review, cardId)}
        </div>
      </div>
    );
  };

  if (loading) return <section className="testimonials-section"><h2>Loading...</h2></section>;

  return (
    <section className="testimonials-section">
      <div className="testimonials-heading">
        <div className="testimonials-badge">
          <FaHandPointRight />
          <span>Testimonials</span>
        </div>

        <h2>What Our Client Say About Us</h2>
      </div>

      <div className="testimonial-rows">
        <div className="testimonial-row logo-left">
          <div className="platform-logo">
            <img
              src="https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/logos/upwork-logo.png"
              alt="Upwork"
              title="Upwork"
            />
          </div>

          <div className="testimonial-slider-window">
            <div className="testimonial-track">
              <div className="testimonial-group">
                {testimonials.map((testimonial, index) =>
                  renderTestimonialCard(testimonial, index)
                )}
              </div>

              <div className="testimonial-group" aria-hidden="true">
                {testimonials.map((testimonial, index) =>
                  renderTestimonialCard(testimonial, index)
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="testimonial-row logo-right">
          <div className="testimonial-slider-window">
            <div className="testimonial-track">
              <div className="testimonial-group">
                {testimonials.map((testimonial, index) =>
                  renderTestimonialCard(testimonial, index)
                )}
              </div>

              <div className="testimonial-group" aria-hidden="true">
                {testimonials.map((testimonial, index) =>
                  renderTestimonialCard(testimonial, index)
                )}
              </div>
            </div>
          </div>

          <div className="platform-logo">
            <img
              src="https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/logos/fiverr-logo.png"
              alt="Fiverr"
              title="Fiverr"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;