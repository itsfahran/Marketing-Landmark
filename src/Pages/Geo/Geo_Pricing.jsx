import React from "react";
import "./Geo_Pricing.css";
import { hasDbData } from "../../lib/dataHandler";

// Hardcoded defaults
const DEFAULT_GEO_PLANS = [
  {
    tag: "Starter",
    title: "Basic",
    desc: "Best for Startups and Small Businesses",
    price: "59,999",
    pages: "Upto 10 Page Website GEO",
    popular: false,
    features: [
      "On-Page & Technical GEO Audit",
      "Fix On-Page & Technical GEO Issues",
      "Featured Snippet Keyword Research",
      "Optimize Content for Conversational AI",
      "Add 10 FAQs Content in Each Page",
      "5 Brand Mention Listicles",
      "Add GEO/FAQ/How-To/Schema Markup",
      "Add Local Business Schema",
      "Update Robots.txt & LLMs.txt Files",
      "Ping in AI Search Engines",
      "Update Meta Data for AI Search Engine",
      "AI Answer Snippet Targeting",
      "Performance Monitoring & Reporting",
    ],
    disabled: [
      "Optimize Google Business Profile",
      "Smart Internal Linking",
      "AI/NLP Tools Integration",
      "User Intent Mapping",
      "Voice Search Optimization",
    ],
  },
  {
    tag: "Growth",
    title: "Standard",
    desc: "Best for Growing Businesses",
    price: "99,999",
    pages: "Upto 20 Pages Website SEO",
    popular: false,
    features: [
      "On-Page & Technical GEO Audit",
      "Fix On-Page & Technical GEO Issues",
      "Featured Snippet Keyword Research",
      "Optimize Content for Conversational AI",
      "Add 10 FAQs Content in Each Page",
      "10 Brand Mention Listicles",
      "Add GEO/FAQ/How-To/Schema Markup",
      "Add Local Business Schema",
      "Update Robots.txt & LLMs.txt Files",
      "Ping in AI Search Engines",
      "Update Meta Data for AI Search Engine",
      "AI Answer Snippet Targeting",
      "Performance Monitoring & Reporting",
      "Optimize Google Business Profile",
      "Smart Internal Linking",
    ],
    disabled: [
      "AI/NLP Tools Integration",
      "User Intent Mapping",
      "Voice Search Optimization",
    ],
  },
  {
    tag: "Elite",
    title: "Premium",
    desc: "Best for Established Brands",
    price: "149,999",
    pages: "Upto 30 Page Website SEO",
    popular: false,
    features: [
      "On-Page & Technical GEO Audit",
      "Fix On-Page & Technical GEO Issues",
      "Featured Snippet Keyword Research",
      "Optimize Content for Conversational AI",
      "Add 10 FAQs Content in Each Page",
      "20 Brand Mention Listicles",
      "Add GEO/FAQ/How-To/Schema Markup",
      "Add Local Business Schema",
      "Update Robots.txt & LLMs.txt Files",
      "Ping in AI Search Engines",
      "Update Meta Data for AI Search Engine",
      "AI Answer Snippet Targeting",
      "Performance Monitoring & Reporting",
      "Optimize Google Business Profile",
      "Smart Internal Linking",
      "AI/NLP Tools Integration",
      "User Intent Mapping",
      "Voice Search Optimization",
    ],
    disabled: [],
  },
];

const DEFAULT_GEO_PRICING = {
  heading: 'GEO Packages In Pakistan',
  description: 'Choose a GEO plan designed to improve AI search visibility, authority, and ranking potential.',
};

const Geo_Pricing = ({ pricing, heading, description }) => {
  // Database-first: Use database pricing if exists, otherwise use hardcoded defaults
  const displayPricing = hasDbData(pricing) ? pricing : DEFAULT_GEO_PLANS;
  const displayHeading = heading || DEFAULT_GEO_PRICING.heading;
  const displayDescription = description || DEFAULT_GEO_PRICING.description;

  return (
    <section className="geoPricingSection">
      <div className="geoPricingHeader">
        <span>✦ Pricing</span>
        {displayHeading && <h2>{displayHeading}</h2>}
        {displayDescription && <p>{displayDescription}</p>}
      </div>

      {displayPricing && displayPricing.length > 0 && (
        <div className="geoPricingGrid">
          {displayPricing.map((plan) => {
            // Handle both database and hardcoded formats
            const tag = plan.tag || '';
            const title = plan.name || plan.title || '';
            const desc = plan.subtitle || plan.desc || '';
            const price = plan.price || '';
            const currency = plan.currency || 'PKR';
            const billingPeriod = plan.billing_period || 'Month';
            const pages = plan.unit_label || plan.pages || '';
            const isPopular = plan.is_popular || plan.popular || false;

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
                className={`geoPricingCard ${isPopular ? "geoPricingPopular" : ""}`}
                key={plan.id || plan.title}
              >
                {isPopular && <div className="geoPricingBadge">Most Popular</div>}

                <div className="geoPricingTop">
                  {tag && <span>{tag}</span>}
                  {title && <h3>{title}</h3>}
                  {desc && <p>{desc}</p>}
                </div>

                {(price || currency) && (
                  <div className="geoPricingPriceBox">
                    {currency && <small>{currency}</small>}
                    {price && <strong>{price}</strong>}
                    <span>/ {billingPeriod}</span>
                  </div>
                )}

                {pages && <div className="geoPricingPages">{pages}</div>}

                {(enabledFeatures.length > 0 || disabledFeatures.length > 0) && (
                  <ul className="geoPricingList">
                    {enabledFeatures.map((feature, index) => (
                      <li className="geoPricingActive" key={index}>
                        <i>✓</i>
                        {feature}
                      </li>
                    ))}

                    {disabledFeatures.map((feature, index) => (
                      <li className="geoPricingDisabled" key={index}>
                        <i>×</i>
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}

                <button className="geoPricingBtn">Order Now</button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default Geo_Pricing;
