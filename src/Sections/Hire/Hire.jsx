import React, { useEffect, useState } from "react";
import "./Hire.css";
import { FaStar } from "react-icons/fa";
import { fetchHireGigs } from "../../lib/supabase-queries";

const Hire = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGigs();
  }, []);

  const loadGigs = async () => {
    try {
      const data = await fetchHireGigs();
      setGigs(data);
    } catch (error) {
      console.error("Error loading gigs:", error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <section className="hire-section"><h2>Hire Me On Fiverr</h2><p>Loading...</p></section>;
  }

  return (
    <section className="hire-section">
      <h2>Hire Me On Fiverr</h2>

      <div className="hire-slider">
        <div className="hire-track">
          <div className="hire-group">
            {gigs.map((gig, index) => (
              <div className="hire-card" key={`first-${index}`}>
                <div className="hire-img">
                  <img src={gig.image_url} alt={gig.title} />
                </div>

                <div className="hire-content">
                  <h3>{gig.title}</h3>

                  <div className="hire-rating">
                    <FaStar />
                    <span>
                      {gig.rating} ({gig.reviews})
                    </span>
                  </div>

                  <h4>From {gig.price}</h4>
                </div>
              </div>
            ))}
          </div>

          <div className="hire-group">
            {gigs.map((gig, index) => (
              <div className="hire-card" key={`second-${index}`}>
                <div className="hire-img">
                  <img src={gig.image_url} alt={gig.title} />
                </div>

                <div className="hire-content">
                  <h3>{gig.title}</h3>

                  <div className="hire-rating">
                    <FaStar />
                    <span>
                      {gig.rating} ({gig.reviews})
                    </span>
                  </div>

                  <h4>From {gig.price}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hire;