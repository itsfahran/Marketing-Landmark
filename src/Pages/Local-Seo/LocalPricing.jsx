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
          {displayPricing.map((plan, index) => (
            <div
              className={`localPricingCard ${plan.popular ? "popularPlan" : ""}`}
              key={index}
            >
              {plan.popular && <div className="popularBadge">Most Popular</div>}

              <div className="pricingTop">
                <span>{plan.tag}</span>
                <h3>{plan.title}</h3>
                <p>{plan.locations}</p>
              </div>

              <div className="pricingPrice">
                <small>PKR</small>
                <h4>{plan.price}</h4>
                <span>/ Month</span>
              </div>

              <ul className="pricingFeatures">
                {plan.features.map((feature, i) => (
                  <li key={i}>
                    <span>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <a href="#" className="pricingBtn">
                Order Now
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LocalPricing;