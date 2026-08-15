import React from "react";
import "./LocalPricing.css";

const pricingData = [
  {
    tag: "Starter",
    title: "Basic",
    price: "29,999",
    locations: "For 1 Location Profile",
    features: [
      "Setup Google Business Profile",
      "Complete GBP Audit",
      "Competitor GBP Research",
      "NAP Details Optimization",
      "Business Logo & Cover Image",
      "Primary & Secondary Categories",
      "Opening Hours Setup",
      "Optimized Business Description",
      "Service Areas Setup",
      "Monthly Audit",
      "Publish 1 Location Page",
      "Create 50 Local Citations",
    ],
  },
  {
    tag: "Popular",
    title: "Standard",
    price: "49,999",
    locations: "Up to 2 Location Profiles",
    popular: true,
    features: [
      "Everything in Basic",
      "2 Location Pages On Website",
      "Social Media Profiles Setup",
      "Instant WhatsApp Contact",
      "Interior Images/Videos",
      "Respond to All Reviews",
      "FAQ Keyword Research",
      "Q&A Content",
      "Track Keywords Performance",
      "Monthly 8 Update Posts",
      "Create 100 Local Citations",
    ],
  },
  {
    tag: "Advanced",
    title: "Premium",
    price: "89,999",
    locations: "Up to 4 Location Profiles",
    features: [
      "Everything in Standard",
      "4 Location Pages On Website",
      "Advanced GBP Optimization",
      "Products & Services Optimization",
      "Monthly 12 Update Posts",
      "150 Local Citations",
      "Priority Support",
      "Growth Strategy Consultation",
      "Performance Tracking",
      "Full Local SEO Management",
    ],
  },
];

const LocalPricing = ({ pricing, heading, description }) => {
  const displayPricing = pricing && pricing.length > 0 ? pricing : pricingData;
  const displayHeading = heading || 'Local SEO Packages In Pakistan';
  const displayDescription = description || 'Choose the right package to improve your Google Maps visibility, business profile ranking and local customer reach.';

  return (
    <section className="localPricingSection">
      <div className="localPricingContainer">
        <div className="localPricingHeader">
          <span>✦ Pricing</span>
          <h2>{displayHeading}</h2>
          <p>{displayDescription}</p>
        </div>

        <div className="localPricingGrid">
          {displayPricing.map((plan, index) => {
            const planName = plan.name || plan.title || 'Untitled';
            const planSubtitle = plan.subtitle || plan.tag || '';
            const planUnit = plan.unit_label || plan.locations || '';
            const isPopular = plan.is_popular || plan.popular || false;
            const billingPeriod = plan.billing_period || 'Month';

            return (
            <div
              className={`localPricingCard ${isPopular ? "popularPlan" : ""}`}
              key={index}
            >
              {isPopular && <div className="popularBadge">Most Popular</div>}

              <div className="pricingTop">
                <span>{planSubtitle}</span>
                <h3>{planName}</h3>
                <p>{planUnit}</p>
              </div>

              <div className="pricingPrice">
                <small>PKR</small>
                <h4>{plan.price}</h4>
                <span>/ {billingPeriod}</span>
              </div>

              <ul className="pricingFeatures">
                {(plan.features || []).map((feature, i) => {
                  const featureText = typeof feature === 'string' ? feature : feature.feature_text;
                  const isDisabled = typeof feature === 'object' && feature.is_disabled;
                  return (
                    <li key={i} className={isDisabled ? 'disabled' : ''}>
                      <span>{isDisabled ? '×' : '✓'}</span>
                      {featureText}
                    </li>
                  );
                })}
              </ul>

              <a href="#" className="pricingBtn">
                Order Now
              </a>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LocalPricing;