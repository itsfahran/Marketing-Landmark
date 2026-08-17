import React, { useEffect, useState } from "react";
import "./Brand.css";
import { fetchBrands } from "../../lib/supabase-queries";
import { hasDbData } from "../../lib/dataHandler";

// Hardcoded defaults
const DEFAULT_BRANDS = [
  { name: "Brand 1", logo_url: "https://via.placeholder.com/120?text=Brand+1", row_group: "top" },
  { name: "Brand 2", logo_url: "https://via.placeholder.com/120?text=Brand+2", row_group: "top" },
  { name: "Brand 3", logo_url: "https://via.placeholder.com/120?text=Brand+3", row_group: "top" },
  { name: "Brand 4", logo_url: "https://via.placeholder.com/120?text=Brand+4", row_group: "bottom" },
  { name: "Brand 5", logo_url: "https://via.placeholder.com/120?text=Brand+5", row_group: "bottom" },
  { name: "Brand 6", logo_url: "https://via.placeholder.com/120?text=Brand+6", row_group: "bottom" },
];

const DEFAULT_BRANDS_SECTION = {
  badge: "Brands",
  heading: "Brands I've Worked With",
};

const Brand = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      const data = await fetchBrands();
      // Database-first: if data exists, use it; otherwise use defaults
      if (hasDbData(data)) {
        setBrands(data);
      } else {
        setBrands(DEFAULT_BRANDS);
      }
    } catch (error) {
      console.error("Error loading brands, using defaults:", error);
      setBrands(DEFAULT_BRANDS);
    } finally {
      setLoading(false);
    }
  };

  const topBrands = brands.filter(b => b.row_group === 'top');
  const bottomBrands = brands.filter(b => b.row_group === 'bottom');

  return (
    <section className="brand-section">
      <div className="brand-container">
        <div className="brand-heading">
          <span>{DEFAULT_BRANDS_SECTION.badge}</span>
          <h2>{DEFAULT_BRANDS_SECTION.heading}</h2>
        </div>

        {/* Top Row */}
        {topBrands && topBrands.length > 0 && (
          <div className="brand-slider">
            <div className="brand-track brand-track-left">
              {[...topBrands, ...topBrands].map((brand, index) => (
                <div className="brand-card" key={`top-${index}`}>
                  {brand.logo_url && (
                    <img src={brand.logo_url} alt={brand.name || 'Brand logo'} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Row */}
        {bottomBrands && bottomBrands.length > 0 && (
          <div className="brand-slider">
            <div className="brand-track brand-track-right">
              {[...bottomBrands, ...bottomBrands].map((brand, index) => (
                <div className="brand-card" key={`bottom-${index}`}>
                  {brand.logo_url && (
                    <img src={brand.logo_url} alt={brand.name || 'Brand logo'} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Brand;
