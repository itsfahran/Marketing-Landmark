import React, { useEffect, useState } from "react";
import "./LocalHero.css";
import { getSupabaseClient } from "../../lib/supabase";

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

const LocalHero = ({ heroData, businessFeatures, serviceId }) => {
  const heading = heroData?.hero_heading || "Best Local SEO Services In Pakistan By SEO Professional";
  const subheading = heroData?.hero_subheading || "Grow your local business visibility, rank higher on Google Maps, attract nearby customers, and build a strong online presence with result-driven Local SEO strategies.";
  const cta1Text = heroData?.cta1_text || "Get Free SEO Audit";
  const cta1Link = heroData?.cta1_link || "/seo";
  const cta2Text = heroData?.cta2_text || "View Services";
  const cta2Link = heroData?.cta2_link || "/geo";

  const [features, setFeatures] = useState(businessFeatures || []);

  useEffect(() => {
    // If features prop is provided, use it
    if (businessFeatures && businessFeatures.length > 0) {
      setFeatures(businessFeatures);
    }
    // Otherwise if serviceId is provided, fetch from database
    else if (serviceId) {
      fetchBusinessFeatures();
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
      }
    } catch (err) {
      console.log('Using default business features');
    }
  };

  // Default business features if none from database
  const defaultFeatures = [
    { number: '01', title: 'Google Maps Visibility', description: 'Rank higher for nearby searches and attract local buyers.' },
    { number: '02', title: 'Business Profile Optimization', description: 'Improve your Google Business Profile for better trust.' },
    { number: '03', title: 'High-Intent Traffic', description: 'Bring customers who are ready to call, visit or purchase.' },
    { number: '04', title: 'Local Brand Authority', description: 'Build credibility through reviews, citations and signals.' },
  ];

  const displayFeatures = features.length > 0 ? features : defaultFeatures;

  return (
    <>
      <section className="localHeroSection">
        <div className="localHeroGlow"></div>

        <div className="localHeroContent">
          {/* <span className="localHeroBadge">✦ Our Services</span> */}

          <h1>{heading}</h1>

          <p>{subheading}</p>

          <div className="localHeroButtons">
            <a href={cta1Link} className="localPrimaryBtn">
              {cta1Text}
            </a>
            <a href={cta2Link} className="localSecondaryBtn">
              {cta2Text}
            </a>
            <a href="/portfolio" className="localSecondaryBtn">
              Portfolio
            </a>
          </div>

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
      <section className="localBusinessSection">
      <div className="localBusinessContainer">
        <div className="localVideoCard">
          <div className="videoTopBar">
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div className="videoBox">
            <iframe
              src={heroData?.business_video_url || "https://www.youtube.com/embed/YOUR_VIDEO_ID"}
              title="SEO For Local Businesses"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        <div className="localBusinessContent">
          <span className="sectionMiniTag">Local Business Growth</span>

          <h2>
            {heroData?.business_heading || "SEO For Local Businesses That Want More Calls, Visits & Customers"}
          </h2>

          <p>
            {heroData?.business_subheading || "Local SEO helps your business appear in Google Search and Google Maps when nearby customers are actively searching for your products or services. We optimize your online presence to improve visibility, trust, traffic and conversions."}
          </p>

          <div className="localBusinessGrid">
            {displayFeatures.map((feature) => (
              <div key={feature.id || feature.number} className="businessFeature">
                <h4>{feature.number}</h4>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default LocalHero;
