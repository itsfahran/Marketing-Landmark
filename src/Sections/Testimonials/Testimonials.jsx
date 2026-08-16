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

// Platform logo URLs - using emoji instead of missing images
const getPlatformLogo = (platform) => {
  const logos = {
    upwork: '💼',
    fiverr: '⭐',
    linkedin: '💼',
    google: '🔍',
    freelancer: '👨‍💼',
    other: '⭐',
  };
  return logos[platform] || logos.other;
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

  // Get unique platforms and group testimonials
  const getPlatformRows = () => {
    const platformMap = {};
    testimonials.forEach((testimonial) => {
      const platform = testimonial.source_platform || 'other';
      if (!platformMap[platform]) {
        platformMap[platform] = [];
      }
      platformMap[platform].push(testimonial);
    });
    return Object.entries(platformMap);
  };

  if (loading) return <section className="testimonials-section"><h2>Loading...</h2></section>;

  const platformRows = getPlatformRows();

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
        {platformRows.map(([platform, platformTestimonials], rowIndex) => {
          const isLogoLeft = rowIndex % 2 === 0;
          const platformIcon = getPlatformLogo(platform);
          const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);

          return (
            <div key={platform} className={`testimonial-row ${isLogoLeft ? 'logo-left' : 'logo-right'}`}>
              {isLogoLeft && (
                <div className="platform-logo" style={{ fontSize: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #252381', borderRadius: '12px' }}>
                    {platformIcon}
                  </div>
                </div>
              )}

              <div className="testimonial-slider-window">
                <div className="testimonial-track">
                  <div className="testimonial-group">
                    {platformTestimonials.map((testimonial, index) =>
                      renderTestimonialCard(testimonial, `${platform}-${index}`)
                    )}
                  </div>

                  <div className="testimonial-group" aria-hidden="true">
                    {platformTestimonials.map((testimonial, index) =>
                      renderTestimonialCard(testimonial, `${platform}-${index}`)
                    )}
                  </div>
                </div>
              </div>

              {!isLogoLeft && (
                <div className="platform-logo" style={{ fontSize: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #252381', borderRadius: '12px' }}>
                    {platformIcon}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Testimonials;