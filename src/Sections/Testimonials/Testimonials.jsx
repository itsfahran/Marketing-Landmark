import React, { useEffect, useState } from "react";
import "./Testimonials.css";
import { FaHandPointRight, FaStar } from "react-icons/fa";
import { fetchHomeTestimonials } from "../../lib/supabase-queries";
import { hasDbData } from "../../lib/dataHandler";

const READ_MORE_LIMIT = 135;

// Hardcoded defaults
const DEFAULT_TESTIMONIALS = [
  {
    id: '1',
    client_name: "John Smith",
    client_role: "Business Owner",
    client_avatar_url: "https://via.placeholder.com/48?text=JS",
    rating: 5,
    review_text: "Excellent SEO services! My website traffic increased by 300% within 6 months. Highly recommended!",
    source_platform: "google",
  },
  {
    id: '2',
    client_name: "Sarah Johnson",
    client_role: "Marketing Manager",
    client_avatar_url: "https://via.placeholder.com/48?text=SJ",
    rating: 5,
    review_text: "Professional and transparent approach to SEO. The team explained everything clearly and delivered great results.",
    source_platform: "upwork",
  },
  {
    id: '3',
    client_name: "Mike Wilson",
    client_role: "E-commerce Manager",
    client_avatar_url: "https://via.placeholder.com/48?text=MW",
    rating: 5,
    review_text: "Outstanding local SEO optimization. We now rank #1 for our target keywords in our area.",
    source_platform: "fiverr",
  },
];

const DEFAULT_TESTIMONIALS_SECTION = {
  badge: "Testimonials",
  heading: "What Our Client Say About Us",
};

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

      // Database-first: if data exists, use it; otherwise use defaults
      if (hasDbData(data)) {
        setTestimonials(data);
      } else {
        setTestimonials(DEFAULT_TESTIMONIALS);
      }
    } catch (error) {
      console.error("Error loading testimonials, using defaults:", error);
      setTestimonials(DEFAULT_TESTIMONIALS);
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

  const platformRows = getPlatformRows();

  return (
    <section className="testimonials-section">
      <div className="testimonials-heading">
        <div className="testimonials-badge">
          <FaHandPointRight />
          <span>{DEFAULT_TESTIMONIALS_SECTION.badge}</span>
        </div>

        <h2>{DEFAULT_TESTIMONIALS_SECTION.heading}</h2>
      </div>

      {testimonials && testimonials.length > 0 && (
        <div className="testimonial-rows">
          {platformRows.map(([platform, platformTestimonials], rowIndex) => {
            const isLogoLeft = rowIndex % 2 === 0;
            const platformIcon = getPlatformLogo(platform);
            const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);
            // Check if any testimonial has a custom platform_icon_url
            const customIconUrl = platformTestimonials.find(t => t.platform_icon_url)?.platform_icon_url;

            return (
              <div key={platform} className={`testimonial-row ${isLogoLeft ? 'logo-left' : 'logo-right'}`}>
                {isLogoLeft && (
                  <div className="platform-logo" style={{ fontSize: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #252381', borderRadius: '12px', overflow: 'hidden' }}>
                      {customIconUrl ? (
                        <img src={customIconUrl} alt={platformName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        platformIcon
                      )}
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
                    <div style={{ width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #252381', borderRadius: '12px', overflow: 'hidden' }}>
                      {customIconUrl ? (
                        <img src={customIconUrl} alt={platformName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        platformIcon
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default Testimonials;
