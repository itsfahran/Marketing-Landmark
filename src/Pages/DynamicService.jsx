/**
 * Dynamic Service Page
 * Renders any service (SEO, GEO, Local, Web Dev, etc.) from Supabase
 * Uses the template_type to determine layout
 */

import React from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Hero from '../Sections/Hero/Hero';
import Process from '../Sections/Process/Process';
import Testimonials from '../Sections/Testimonials/Testimonials';
import Brand from '../Sections/Brand/Brand';
import Choose from '../Sections/Choose/Choose';
import Contact_Section from '../Sections/Contact_Section/Contact_Section';
import { getTemplateConfig } from '../lib/templateConfigs';

export default function DynamicService() {
  const loaderData = useLoaderData();
  const navigate = useNavigate();

  // Handle errors
  if (loaderData?.error) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h1>404 - Page Not Found</h1>
        <p>{loaderData.error}</p>
        <button
          onClick={() => navigate('/')}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#252381',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Back to Home
        </button>
      </div>
    );
  }

  const {
    page,
    hero,
    stats,
    pricing,
    scopeCards,
    processSteps,
    testimonials,
    brands,
    chooseFeatures,
    faqs,
  } = loaderData;

  // Prepare hero data for Hero component
  const heroData = {
    heading: hero?.heading || page.title,
    subheading: hero?.subheading || '',
    description: hero?.description || '',
    marqueeText: hero?.marquee_text || '',
    primaryBtn: {
      text: hero?.cta_primary_text || 'Get Started',
      link: hero?.cta_primary_link || '/contact',
    },
    secondaryBtn: {
      text: hero?.cta_secondary_text || 'Learn More',
      link: hero?.cta_secondary_link || '#',
    },
    videoLink: hero?.video_embed_url || '',
  };

  // Prepare stats data
  const statsData = stats.map((s) => ({
    end: parseInt(s.value),
    suffix: s.suffix,
    label: s.label,
  }));

  // Prepare pricing data
  const pricingData = pricing.map((p) => ({
    id: p.id,
    name: p.name,
    subtitle: p.subtitle,
    price: p.price,
    currency: p.currency,
    unitLabel: p.unit_label,
    isPopular: p.is_popular,
    features: p.pricing_features
      ? p.pricing_features.map((f) => ({
          text: f.feature_text,
          included: !f.is_disabled,
        }))
      : [],
  }));

  // Prepare scope data
  const scopeData = scopeCards.map((c) => ({
    number: c.number,
    title: c.title,
    description: c.description,
  }));

  // Prepare process data
  const processData = processSteps.map((p) => ({
    icon: p.icon_name,
    title: p.title,
    description: p.description,
  }));

  const templateConfig = getTemplateConfig(page.template_type);

  const componentsMap = {
    hero: (
      Object.keys(hero).length > 0 && (
        <Hero
          heading={heroData.heading}
          subheading={heroData.subheading}
          description={heroData.description}
          marqueeText={heroData.marqueeText}
          primaryBtn={heroData.primaryBtn}
          secondaryBtn={heroData.secondaryBtn}
          showStats={statsData.length > 0}
          stats={statsData}
          videoLink={heroData.videoLink}
          showContactForm={hero?.show_contact_form || false}
          templateType={page.template_type}
        />
      )
    ),
    stats: statsData.length > 0 && (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2>Our Stats</h2>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {statsData.map((stat, i) => (
            <div key={i} style={{ minWidth: '200px' }}>
              <h3>{stat.end}{stat.suffix}</h3>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    ),
    pricing: pricingData.length > 0 && (
      <div style={{ padding: '60px 20px' }}>
        <h2 style={{ textAlign: 'center' }}>Pricing Plans</h2>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {pricingData.map((pkg) => (
            <div key={pkg.id} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', minWidth: '250px' }}>
              <h3>{pkg.name}</h3>
              <p>{pkg.subtitle}</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{pkg.price} {pkg.currency}</p>
            </div>
          ))}
        </div>
      </div>
    ),
    scopeCards: scopeData.length > 0 && (
      <div style={{ padding: '60px 20px' }}>
        <h2 style={{ textAlign: 'center' }}>What's Included</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          {scopeData.map((card) => (
            <div key={card.number} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
              <h3>{card.number}. {card.title}</h3>
              <p>{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    ),
    processSteps: processData.length > 0 && <Process steps={processData} />,
    testimonials: testimonials.length > 0 && <Testimonials testimonials={testimonials} />,
    brands: brands.length > 0 && <Brand brands={brands} />,
    chooseFeatures: chooseFeatures.length > 0 && <Choose features={chooseFeatures} />,
    contact: <Contact_Section />,
  };

  return (
    <>
      <Helmet>
        <title>{page.meta_title || page.title}</title>
        <meta name="description" content={page.meta_description || ''} />
        <meta name="keywords" content={page.meta_keywords || ''} />
        {page.canonical_url && <link rel="canonical" href={page.canonical_url} />}
      </Helmet>

      {/* Render components based on template config */}
      {templateConfig.components.map((componentName) => (
        <React.Fragment key={componentName}>
          {componentsMap[componentName]}
        </React.Fragment>
      ))}
    </>
  );
}
