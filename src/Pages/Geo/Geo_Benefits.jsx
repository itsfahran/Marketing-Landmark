import React from "react";
import "./Geo_Scope.css";
import { hasDbData } from "../../lib/dataHandler";

// Hardcoded defaults
const DEFAULT_GEO_BENEFITS = [
  { number: "01", title: "Benefit 1", description: "Description for benefit 1" },
  { number: "02", title: "Benefit 2", description: "Description for benefit 2" },
  { number: "03", title: "Benefit 3", description: "Description for benefit 3" },
];

const DEFAULT_GEO_BENEFITS_SECTION = {
  heading: "Benefits of GEO Strategy",
};

const Geo_Benefits = ({ benefits, heading }) => {
  // Database-first: Use database benefits if exists, otherwise use hardcoded defaults
  const displayBenefits = hasDbData(benefits) ? benefits : DEFAULT_GEO_BENEFITS;
  const displayHeading = heading || DEFAULT_GEO_BENEFITS_SECTION.heading;

  return (
    <section className="geoScopeSection">
      <div className="geoScopeHeader">
        <span>✦ Benefits</span>
        {displayHeading && <h2>{displayHeading}</h2>}
      </div>

      {displayBenefits && displayBenefits.length > 0 && (
        <div className="geoScopeCards">
          {displayBenefits.map((item) => (
            <div className="geoScopeCard" key={item.id || item.number}>
              <div className="geoScopeContent">
                {item.number && <span className="geoScopeNumber">{item.number}</span>}
                {item.title && <h3>{item.title}</h3>}
                {item.description && <p>{item.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Geo_Benefits;
