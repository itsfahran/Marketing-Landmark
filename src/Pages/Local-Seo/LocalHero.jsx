import React, { useEffect, useState } from "react";
import "./LocalHero.css";
import { getSupabaseClient } from "../../lib/supabase";
import { hasDbData } from "../../lib/dataHandler";

const Counter = ({ end, suffix }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1600;
    const increment = end / (duration / 20);

    const timer = setInterval(() => {
      start += increment;

      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 20);

    return () => clearInterval(timer);
  }, [end]);

  return (
    <>
      {count}
      {suffix}
    </>
  );
};

// Hardcoded defaults
const DEFAULT_LOCAL_HERO = {
  hero_heading: "Best Local SEO Services In Pakistan By SEO Professional",
  hero_subheading: "Grow your local business visibility, rank higher on Google Maps, attract nearby customers, and build a strong online presence with result-driven Local SEO strategies.",
  cta1_text: "Get Free SEO Audit",
  cta1_link: "/seo",
  cta2_text: "View Services",
  cta2_link: "/geo",
};

const DEFAULT_BUSINESS_SECTION = {
  business_video_url: "https://www.youtube.com/embed/YOUR_VIDEO_ID",
  business_heading: "SEO For Local Businesses That Want More Calls, Visits & Customers",
  business_subheading: "Local SEO helps your business appear in Google Search and Google Maps when nearby customers are actively searching for your products or services. We optimize your online presence to improve visibility, trust, traffic and conversions.",
};

const DEFAULT_BUSINESS_FEATURES = [
  { number: '01', title: 'Google Maps Visibility', description: 'Rank higher for nearby searches and attract local buyers.' },
  { number: '02', title: 'Business Profile Optimization', description: 'Improve your Google Business Profile for better trust.' },
  { number: '03', title: 'High-Intent Traffic', description: 'Bring customers who are ready to call, visit or purchase.' },
  { number: '04', title: 'Local Brand Authority', description: 'Build credibility through reviews, citations and signals.' },
];

const LocalHero = ({ heroData, businessFeatures, serviceId }) => {
  const [features, setFeatures] = useState(businessFeatures || []);

  // Database-first approach: Use DB data if exists, otherwise use defaults
  const displayHeroData = hasDbData(heroData) ? heroData : DEFAULT_LOCAL_HERO;
  const displayBusinessData = hasDbData(heroData) ? heroData : DEFAULT_BUSINESS_SECTION;

  useEffect(() => {
    // If features prop is provided and valid, use it
    if (businessFeatures && businessFeatures.length > 0) {
      setFeatures(businessFeatures);
    }
    // Otherwise if serviceId is provided, fetch from database
    else if (serviceId) {
      fetchBusinessFeatures();
    } else {
      // No features from prop or DB, use defaults
      setFeatures(DEFAULT_BUSINESS_FEATURES);
    }
  }, [businessFeatures, serviceId]);

  const fetchBusinessFeatures = async () => {
    try {
      const supabase = getSupabaseClient();
      const { data } = await supabase
        .from('service_business_features')
        .select('*')
        .eq('service_id', serviceId)
        .order('sort_order');

      if (data && data.length > 0) {
        setFeatures(data);
      } else {
        // No DB data, use defaults
        setFeatures(DEFAULT_BUSINESS_FEATURES);
      }
    } catch (err) {
      console.log('Using default business features');
      setFeatures(DEFAULT_BUSINESS_FEATURES);
    }
  };

  return (
    <>
      {/* HERO SECTION */}
      <section className="localHeroSection">
        <div className="localHeroGlow"></div>

        <div className="localHeroContent">
          {/* Only show heading if it exists */}
          {displayHeroData.hero_heading && (
            <h1>{displayHeroData.hero_heading}</h1>
          )}

          {/* Only show subheading if it exists */}
          {displayHeroData.hero_subheading && (
            <p>{displayHeroData.hero_subheading}</p>
          )}

          {/* Only show buttons if CTA text exists */}
          {(displayHeroData.cta1_text || displayHeroData.cta2_text) && (
            <div className="localHeroButtons">
              {displayHeroData.cta1_text && (
                <a href={displayHeroData.cta1_link || "/seo"} className="localPrimaryBtn">
                  {displayHeroData.cta1_text}
                </a>
              )}
              {displayHeroData.cta2_text && (
                <a href={displayHeroData.cta2_link || "/geo"} className="localSecondaryBtn">
                  {displayHeroData.cta2_text}
                </a>
              )}
              <a href="/portfolio" className="localSecondaryBtn">
                Portfolio
              </a>
            </div>
          )}

          {/* Stats section */}
          <div className="localStats">
            <div>
              <h3>
                <Counter end={5} suffix="+" />
              </h3>
              <p>Years Experience</p>
            </div>

            <div>
              <h3>
                <Counter end={150} suffix="+" />
              </h3>
              <p>Projects Completed</p>
            </div>

            <div>
              <h3>
                <Counter end={90} suffix="%" />
              </h3>
              <p>Return Clients</p>
            </div>
          </div>
        </div>
      </section>

      {/* BUSINESS SECTION */}
      {(displayBusinessData.business_heading || displayBusinessData.business_subheading) && (
        <section className="localBusinessSection">
          <div className="localBusinessContainer">
            {/* Video */}
            {displayBusinessData.business_video_url && (
              <div className="localVideoCard">
                <div className="videoTopBar">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <div className="videoBox">
                  <iframe
                    src={displayBusinessData.business_video_url}
                    title="SEO For Local Businesses"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="localBusinessContent">
              <span className="sectionMiniTag">Local Business Growth</span>

              {displayBusinessData.business_heading && (
                <h2>{displayBusinessData.business_heading}</h2>
              )}

              {displayBusinessData.business_subheading && (
                <p>{displayBusinessData.business_subheading}</p>
              )}

              {/* Features Grid */}
              {features.length > 0 && (
                <div className="localBusinessGrid">
                  {features.map((feature) => (
                    <div key={feature.id || feature.number} className="businessFeature">
                      {feature.number && <h4>{feature.number}</h4>}
                      {feature.title && <h3>{feature.title}</h3>}
                      {feature.description && <p>{feature.description}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default LocalHero;
