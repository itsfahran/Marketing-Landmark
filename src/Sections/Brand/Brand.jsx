import React, { useEffect, useState } from "react";
import "./Brand.css";
import { fetchBrands } from "../../lib/supabase-queries";

const Brand = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      const data = await fetchBrands();
      setBrands(data);
    } catch (error) {
      console.error("Error loading brands:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <section className="brand-section"><h2>Loading...</h2></section>;

  const topBrands = brands.filter(b => b.row_group === 'top');
  const bottomBrands = brands.filter(b => b.row_group === 'bottom');

  return (
    <section className="brand-section">
      <div className="brand-container">
        <div className="brand-heading">
          <span>Brands</span>
          <h2>Brands I've Worked With</h2>
        </div>

        {/* Top Row */}
        <div className="brand-slider">
          <div className="brand-track brand-track-left">
            {[...topBrands, ...topBrands].map((brand, index) => (
              <div className="brand-card" key={`top-${index}`}>
                <img src={brand.logo_url} alt={brand.name} />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="brand-slider">
          <div className="brand-track brand-track-right">
            {[...bottomBrands, ...bottomBrands].map((brand, index) => (
              <div className="brand-card" key={`bottom-${index}`}>
                <img src={brand.logo_url} alt={brand.name} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Brand;