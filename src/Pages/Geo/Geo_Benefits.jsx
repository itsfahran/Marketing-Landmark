import React from "react";
import "./Geo_Scope.css";

const geoBenefitsData = [
  { number: "01", title: "Benefit 1", description: "Description for benefit 1" },
  { number: "02", title: "Benefit 2", description: "Description for benefit 2" },
  { number: "03", title: "Benefit 3", description: "Description for benefit 3" },
];

const Geo_Benefits = ({ benefits }) => {
  // Use database benefits or fallback to hardcoded
  const displayBenefits = benefits && benefits.length > 0 ? benefits : geoBenefitsData;

  return (
    <section className="geoScopeSection">
      <div className="geoScopeHeader">
        <span>✦ Benefits</span>
        <h2>Benefits of GEO Strategy</h2>
      </div>

      <div className="geoScopeCards">
        {displayBenefits.map((item) => (
          <div className="geoScopeCard" key={item.id || item.number}>
            <div className="geoScopeContent">
              <span className="geoScopeNumber">{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Geo_Benefits;
