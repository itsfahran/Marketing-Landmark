/**
 * Component Extractor - Maps template components to extracted implementations
 * Imports properly extracted sub-components with exact CSS and styling
 */

import React from 'react';

// Import extracted SEO components
import SeoHero from '../Components/Extracted/SeoHero';
import SeoScope from '../Pages/Seo/SeoScope';
import Geo_Scope from '../Pages/Geo/Geo_Scope';
import Geo_Pricing from '../Pages/Geo/Geo_Pricing';
import Geo_Process from '../Pages/Geo/Geo_Process';
import Geo_Benefits from '../Pages/Geo/Geo_Benefits';

// Import extracted GEO components
import GeoHero from '../Components/Extracted/GeoHero';
import SeoProcess from '../Components/Extracted/SeoProcess';
import SeoCMS from '../Components/Extracted/SeoCMS';
import SeoHire from '../Components/Extracted/SeoHire';
import GeoHire from '../Components/Extracted/GeoHire';
import SeoCaseStudies from '../Components/Extracted/SeoCaseStudies';
import GeoAbout from '../Components/Extracted/GeoAbout';
import VideoTestimonials from '../Components/Extracted/VideoTestimonials';

// Import extracted LOCAL components
import LocalHeroExt from '../Components/Extracted/LocalHeroExt';
import LocalScope from '../Pages/Local-Seo/LocalScope';
import LocalPricing from '../Pages/Local-Seo/LocalPricing';

// Import shared components
import Testimonials from '../Sections/Testimonials/Testimonials';
import Choose from '../Sections/Choose/Choose';
import SeoContact from '../Pages/Seo/SeoContact';
import GeoContact from '../Pages/Geo/GeoContact';
import SeoFaqs from '../Pages/Seo/SeoFaqs';
import Brand from '../Sections/Brand/Brand';

// =====================================================
// COMPONENT IMPLEMENTATIONS
// =====================================================

// === SEO HERO ===
export const SeoHeroComponent = ({ data }) => {
  return <SeoHero data={data} />;
};

// === SEO SCOPE ===
export const SeoScopeComponent = ({ data }) => {
  return <SeoScope scopeCards={data?.scopeCards} heading={data?.heading} description={data?.description} />;
};

// === SEO PRICING ===
export const SeoPricingComponent = ({ data }) => {
  return <Geo_Pricing pricing={data?.pricing} heading={data?.heading} description={data?.description} />;
};

// === SEO PROCESS ===
export const SeoProcessComponent = ({ data }) => {
  return <SeoProcess processSteps={data?.processSteps} heading={data?.heading} description={data?.description} />;
};

// === SEO FEATURES ===
export const SeoFeaturesComponent = ({ data }) => {
  return <Geo_Benefits benefits={data?.benefits} />;
};

// === SEO TESTIMONIALS ===
export const SeoTestimonialsComponent = ({ data }) => {
  return <Testimonials />;
};

// === SEO CTA ===
export const SeoCTAComponent = ({ data }) => {
  return <Choose />;
};

// === SEO CONTACT ===
export const SeoContactComponent = ({ data }) => {
  return <SeoContact />;
};

// === SEO ABOUT ===
export const SeoAboutComponent = ({ data }) => {
  return <Brand />;
};

// === SEO CMS ===
export const SeoCmsComponent = ({ data }) => {
  return <SeoCMS items={data?.items} heading={data?.heading} description={data?.description} />;
};

// === GEO CMS ===
export const GeoCmsComponent = ({ data }) => {
  return <SeoCMS items={data?.items} heading={data?.heading} description={data?.description} />;
};

// === LOCAL CMS ===
export const LocalCmsComponent = ({ data }) => {
  return <SeoCMS items={data?.items} heading={data?.heading} description={data?.description} />;
};

// === SEO HIRE ===
export const SeoHireComponent = ({ data }) => {
  return <SeoHire data={data} />;
};

// === GEO HIRE ===
export const GeoHireComponent = ({ data }) => {
  return <GeoHire data={data} />;
};

// === LOCAL HIRE ===
export const LocalHireComponent = ({ data }) => {
  return <GeoHire data={data} />;
};

// === SEO CASE STUDIES ===
export const SeoCaseStudiesComponent = ({ data }) => {
  return <SeoCaseStudies data={data} />;
};

// === GEO CASE STUDIES ===
export const GeoCaseStudiesComponent = ({ data }) => {
  return <SeoCaseStudies data={data} />;
};

// === LOCAL CASE STUDIES ===
export const LocalCaseStudiesComponent = ({ data }) => {
  return <SeoCaseStudies data={data} />;
};

// === SEO VIDEO TESTIMONIALS ===
export const SeoVideoTestimonialsComponent = ({ data }) => {
  return <VideoTestimonials data={data} />;
};

// === GEO VIDEO TESTIMONIALS ===
export const GeoVideoTestimonialsComponent = ({ data }) => {
  return <VideoTestimonials data={data} />;
};

// === LOCAL VIDEO TESTIMONIALS ===
export const LocalVideoTestimonialsComponent = ({ data }) => {
  return <VideoTestimonials data={data} />;
};

// =====================================================

// === GEO HERO ===
export const GeoHeroComponent = ({ data }) => {
  return <GeoHero data={data} />;
};

// === GEO SCOPE ===
export const GeoScopeComponent = ({ data }) => {
  return <Geo_Scope scopeCards={data?.scopeCards} heading={data?.heading} description={data?.description} />;
};

// === GEO PRICING ===
export const GeoPricingComponent = ({ data }) => {
  return <Geo_Pricing pricing={data?.pricing} heading={data?.heading} description={data?.description} />;
};

// === GEO PROCESS ===
export const GeoProcessComponent = ({ data }) => {
  return <Geo_Process processSteps={data?.processSteps} heading={data?.heading} description={data?.description} />;
};

// === GEO FEATURES ===
export const GeoFeaturesComponent = ({ data }) => {
  return <Geo_Benefits benefits={data?.benefits} />;
};

// === GEO TESTIMONIALS ===
export const GeoTestimonialsComponent = ({ data }) => {
  return <Testimonials />;
};

// === GEO CTA ===
export const GeoCTAComponent = ({ data }) => {
  return <Choose />;
};

// === GEO CONTACT ===
export const GeoContactComponent = ({ data }) => {
  return <GeoContact />;
};

// === GEO ABOUT ===
export const GeoAboutComponent = ({ data }) => {
  return <GeoAbout data={data} />;
};

// =====================================================

// === LOCAL HERO ===
export const LocalHeroComponent = ({ data }) => {
  return <LocalHeroExt data={data} />;
};

// === LOCAL SCOPE ===
export const LocalScopeComponent = ({ data }) => {
  return <LocalScope scopeCards={data?.scopeCards} serviceId={data?.id} heading={data?.heading} description={data?.description} />;
};

// === LOCAL PRICING ===
export const LocalPricingComponent = ({ data }) => {
  return <LocalPricing pricing={data?.pricing} heading={data?.heading} description={data?.description} />;
};

// === LOCAL PROCESS ===
export const LocalProcessComponent = ({ data }) => {
  return <Geo_Process processSteps={data?.processSteps} heading={data?.heading} description={data?.description} />;
};

// === LOCAL FEATURES ===
export const LocalFeaturesComponent = ({ data }) => {
  return <Geo_Benefits benefits={data?.benefits} />;
};

// === LOCAL TESTIMONIALS ===
export const LocalTestimonialsComponent = ({ data }) => {
  return <Testimonials />;
};

// === LOCAL CTA ===
export const LocalCTAComponent = ({ data }) => {
  return <Choose />;
};

// === LOCAL CONTACT ===
export const LocalContactComponent = ({ data }) => {
  return <SeoContact />;
};

// === LOCAL ABOUT ===
export const LocalAboutComponent = ({ data }) => {
  return <Brand />;
};

// =====================================================
// COMPONENT RENDERER MAP
// =====================================================

export const COMPONENT_RENDERER_MAP = {
  hero: {
    SEO: SeoHeroComponent,
    GEO: GeoHeroComponent,
    LOCAL: LocalHeroComponent,
  },
  scope: {
    SEO: SeoScopeComponent,
    GEO: GeoScopeComponent,
    LOCAL: LocalScopeComponent,
  },
  pricing: {
    SEO: SeoPricingComponent,
    GEO: GeoPricingComponent,
    LOCAL: LocalPricingComponent,
  },
  process: {
    SEO: SeoProcessComponent,
    GEO: GeoProcessComponent,
    LOCAL: LocalProcessComponent,
  },
  features: {
    SEO: SeoFeaturesComponent,
    GEO: GeoFeaturesComponent,
    LOCAL: LocalFeaturesComponent,
  },
  testimonials: {
    SEO: SeoTestimonialsComponent,
    GEO: GeoTestimonialsComponent,
    LOCAL: LocalTestimonialsComponent,
  },
  cta: {
    SEO: SeoCTAComponent,
    GEO: GeoCTAComponent,
    LOCAL: LocalCTAComponent,
  },
  contact: {
    SEO: SeoContactComponent,
    GEO: GeoContactComponent,
    LOCAL: LocalContactComponent,
  },
  about: {
    SEO: SeoAboutComponent,
    GEO: GeoAboutComponent,
    LOCAL: LocalAboutComponent,
  },
  cms: {
    SEO: SeoCmsComponent,
    GEO: GeoCmsComponent,
    LOCAL: LocalCmsComponent,
  },
  hire: {
    SEO: SeoHireComponent,
    GEO: GeoHireComponent,
    LOCAL: LocalHireComponent,
  },
  casestudies: {
    SEO: SeoCaseStudiesComponent,
    GEO: GeoCaseStudiesComponent,
    LOCAL: LocalCaseStudiesComponent,
  },
  videotestimonials: {
    SEO: SeoVideoTestimonialsComponent,
    GEO: GeoVideoTestimonialsComponent,
    LOCAL: LocalVideoTestimonialsComponent,
  },
};
