import React from "react";
import LocalHero from "../../Pages/Local-Seo/LocalHero";

/**
 * Extracted LOCAL Hero Section - Uses existing LocalHero component
 */
const LocalHeroExt = ({ data }) => {
  return (
    <LocalHero
      heroData={data}
      businessFeatures={data?.businessFeatures}
      serviceId={data?.id}
    />
  );
};

export default LocalHeroExt;
