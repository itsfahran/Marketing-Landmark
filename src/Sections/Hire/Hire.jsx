import React, { useEffect, useState } from "react";
import "./Hire.css";
import { FaStar } from "react-icons/fa";
import { fetchHireGigs } from "../../lib/supabase-queries";
import { hasDbData } from "../../lib/dataHandler";

// Hardcoded defaults
const DEFAULT_HIRE_GIGS = [
  {
    image_url: "https://via.placeholder.com/280?text=Gig+1",
    title: "SEO Optimization Service",
    rating: "5.0",
    reviews: "120",
    price: "$99",
  },
  {
    image_url: "https://via.placeholder.com/280?text=Gig+2",
    title: "Local SEO Package",
    rating: "4.9",
    reviews: "95",
    price: "$149",
  },
  {
    image_url: "https://via.placeholder.com/280?text=Gig+3",
    title: "GEO SEO Strategy",
    rating: "5.0",
    reviews: "87",
    price: "$199",
  },
];

const DEFAULT_HIRE = {
  heading: "Hire Me On Fiverr",
};

const Hire = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGigs();
  }, []);

  const loadGigs = async () => {
    try {
      const data = await fetchHireGigs();
      // Database-first: if data exists, use it; otherwise use defaults
      if (hasDbData(data)) {
        setGigs(data);
      } else {
        setGigs(DEFAULT_HIRE_GIGS);
      }
    } catch (error) {
      console.error("Error loading gigs, using defaults:", error);
      setGigs(DEFAULT_HIRE_GIGS);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="hire-section">
      <h2>{DEFAULT_HIRE.heading}</h2>

      {gigs && gigs.length > 0 && (
        <div className="hire-slider">
          <div className="hire-track">
            <div className="hire-group">
              {gigs.map((gig, index) => (
                <div className="hire-card" key={`first-${index}`}>
                  {gig.image_url && (
                    <div className="hire-img">
                      <img src={gig.image_url} alt={gig.title || 'Gig'} />
                    </div>
                  )}

                  <div className="hire-content">
                    {gig.title && <h3>{gig.title}</h3>}

                    {(gig.rating || gig.reviews) && (
                      <div className="hire-rating">
                        <FaStar />
                        <span>
                          {gig.rating} ({gig.reviews})
                        </span>
                      </div>
                    )}

                    {gig.price && <h4>From {gig.price}</h4>}
                  </div>
                </div>
              ))}
            </div>

            <div className="hire-group">
              {gigs.map((gig, index) => (
                <div className="hire-card" key={`second-${index}`}>
                  {gig.image_url && (
                    <div className="hire-img">
                      <img src={gig.image_url} alt={gig.title || 'Gig'} />
                    </div>
                  )}

                  <div className="hire-content">
                    {gig.title && <h3>{gig.title}</h3>}

                    {(gig.rating || gig.reviews) && (
                      <div className="hire-rating">
                        <FaStar />
                        <span>
                          {gig.rating} ({gig.reviews})
                        </span>
                      </div>
                    )}

                    {gig.price && <h4>From {gig.price}</h4>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hire;
