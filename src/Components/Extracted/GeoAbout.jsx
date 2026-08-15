import React from 'react';
import './GeoAbout.css';

const GeoAbout = ({ data }) => {
  const heading = data?.heading || 'How GEO Helps Modern Websites';
  const subheading = data?.subheading || 'Rank In AI Search Results';
  const description = data?.description || 'AI-powered search engines like Google\'s AI Overviews, ChatGPT, Perplexity and other answer engines now select content based on trust, clarity, authority and structure. GEO helps your website become easier for AI systems to understand, summarize and recommend.';

  const items = [
    { number: '01', text: data?.item_1 || 'Structured content for AI engines' },
    { number: '02', text: data?.item_2 || 'Better visibility in generated answers' },
    { number: '03', text: data?.item_3 || 'Authority-driven optimization strategy' },
  ];

  const videoUrl = data?.video_url || 'https://www.youtube.com/embed/YOUR_VIDEO_ID';
  const badgeTitle = data?.badge_title || 'GEO';
  const badgeSubtitle = data?.badge_subtitle || 'AI Search Ready';

  return (
    <section className="geoModernInfo">
      <div className="geoModernWrap">
        <div className="geoModernText">
          <h2>
            {heading}
            <span>{subheading}</span>
          </h2>

          <p>{description}</p>

          <div className="geoModernPoints">
            {items.map((item, idx) => (
              <div key={idx}>
                <strong>{item.number}</strong>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="geoModernMedia">
          <div className="geoVideoCard">
            <iframe
              src={videoUrl}
              title="GEO Video"
              allowFullScreen
            ></iframe>
          </div>

          <div className="geoFloatingBadge">
            <strong>{badgeTitle}</strong>
            <span>{badgeSubtitle}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GeoAbout;
