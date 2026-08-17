import React from "react";
import "./LocalPricing.css";
import { hasDbData } from "../../lib/dataHandler";

// Hardcoded defaults
const DEFAULT_LOCAL_PLANS = [
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

const DEFAULT_LOCAL_PRICING = {
  heading: 'Local SEO Packages In Pakistan',
  description: 'Choose the right package to improve your Google Maps visibility, business profile ranking and local customer reach.',
};

const LocalPricing = ({ pricing, heading, description }) => {
  // Database-first: Use database pricing if exists, otherwise use hardcoded defaults
  const displayPricing = hasDbData(pricing) ? pricing : DEFAULT_LOCAL_PLANS;
  const displayHeading = heading || DEFAULT_LOCAL_PRICING.heading;
  const displayDescription = description || DEFAULT_LOCAL_PRICING.description;

  return (
    <section className="localPricingSection">
      <div className="localPricingContainer">
        <div className="localPricingHeader">
          <span>✦ Pricing</span>
          {displayHeading && <h2>{displayHeading}</h2>}
          {displayDescription && <p>{displayDescription}</p>}
        </div>

        {displayPricing && displayPricing.length > 0 && (
          <div className="localPricingGrid">
            {displayPricing.map((plan, index) => {
              const planName = plan.name || plan.title || '';
              const planSubtitle = plan.subtitle || plan.tag || '';
              const planUnit = plan.unit_label || plan.locations || '';
              const isPopular = plan.is_popular || plan.popular || false;
              const billingPeriod = plan.billing_period || 'Month';
              const price = plan.price || '';

              // Get features - handle both database objects and hardcoded strings
              const enabledFeatures = (plan.features || [])
                .filter(f => typeof f === 'string' || !f.is_disabled)
                .map(f => typeof f === 'string' ? f : f.feature_text);

              const disabledFeatures = (plan.features || [])
                .filter(f => typeof f === 'object' && f.is_disabled)
                .map(f => f.feature_text)
                .concat(plan.disabled || []);

              return (
                <div
                  className={`localPricingCard ${isPopular ? "popularPlan" : ""}`}
                  key={plan.id || index}
                >
                  {isPopular && <div className="popularBadge">Most Popular</div>}

                  <div className="pricingTop">
                    {planSubtitle && <span>{planSubtitle}</span>}
                    {planName && <h3>{planName}</h3>}
                    {planUnit && <p>{planUnit}</p>}
                  </div>

                  {price && (
                    <div className="pricingPrice">
                      <small>PKR</small>
                      <h4>{price}</h4>
                      <span>/ {billingPeriod}</span>
                    </div>
                  )}

                  {(enabledFeatures.length > 0 || disabledFeatures.length > 0) && (
                    <ul className="pricingFeatures">
                      {enabledFeatures.map((feature, i) => (
                        <li key={i}>
                          <span>✓</span>
                          {feature}
                        </li>
                      ))}

                      {disabledFeatures.map((feature, i) => (
                        <li key={i} className='disabled'>
                          <span>×</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}

                  <a href="#" className="pricingBtn">
                    Order Now
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default LocalPricing;
