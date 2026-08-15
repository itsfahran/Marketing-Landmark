// Page Builder Configuration
// Defines all available components and their settings

export const COMPONENTS = {
  hero: {
    id: 'hero',
    name: 'Hero',
    description: 'Hero section with heading and CTA',
    icon: '🎯',
    order: 1,
  },
  about: {
    id: 'about',
    name: 'About',
    description: 'About section',
    icon: '📝',
    order: 2,
  },
  scope: {
    id: 'scope',
    name: 'Services/Scope',
    description: 'Services scope with cards',
    icon: '🔧',
    order: 3,
  },
  pricing: {
    id: 'pricing',
    name: 'Pricing',
    description: 'Pricing packages',
    icon: '💰',
    order: 4,
  },
  process: {
    id: 'process',
    name: 'Process',
    description: 'Process/workflow steps',
    icon: '📊',
    order: 5,
  },
  features: {
    id: 'features',
    name: 'Features',
    description: 'Features/benefits',
    icon: '⭐',
    order: 6,
  },
  testimonials: {
    id: 'testimonials',
    name: 'Testimonials',
    description: 'Client testimonials',
    icon: '💬',
    order: 7,
  },
  cta: {
    id: 'cta',
    name: 'CTA',
    description: 'Call to action',
    icon: '🚀',
    order: 8,
  },
  contact: {
    id: 'contact',
    name: 'Contact',
    description: 'Contact section',
    icon: '📧',
    order: 9,
  },
  cms: {
    id: 'cms',
    name: 'CMS',
    description: 'CMS platforms we support',
    icon: '💻',
    order: 10,
  },
  hire: {
    id: 'hire',
    name: 'Hire/Gigs',
    description: 'Hire me / Fiverr gigs section',
    icon: '💼',
    order: 11,
  },
  casestudies: {
    id: 'casestudies',
    name: 'Case Studies',
    description: 'Portfolio and case studies',
    icon: '📸',
    order: 12,
  },
  videotestimonials: {
    id: 'videotestimonials',
    name: 'Video Testimonials',
    description: 'Client video testimonials and reviews',
    icon: '🎥',
    order: 13,
  },
};

export const TEMPLATE_VARIANTS = {
  hero: ['SEO', 'GEO', 'LOCAL'],
  scope: ['SEO', 'GEO', 'LOCAL'],
  pricing: ['SEO', 'GEO', 'LOCAL'],
  process: ['SEO', 'GEO', 'LOCAL'],
  features: ['SEO', 'GEO', 'LOCAL'],
  testimonials: ['SEO', 'GEO', 'LOCAL'],
  about: ['SEO', 'GEO', 'LOCAL'],
  cta: ['SEO', 'GEO', 'LOCAL'],
  contact: ['SEO', 'GEO', 'LOCAL'],
  cms: ['SEO', 'GEO', 'LOCAL'],
  hire: ['SEO', 'GEO', 'LOCAL'],
  casestudies: ['SEO', 'GEO', 'LOCAL'],
  videotestimonials: ['SEO', 'GEO', 'LOCAL'],
};

// Get all available components
export const getAvailableComponents = () => {
  return Object.values(COMPONENTS).sort((a, b) => a.order - b.order);
};

// Validate page configuration
export const validatePageConfig = (config) => {
  if (!config || !Array.isArray(config)) return false;
  return config.every(comp => comp.id && comp.enabled !== undefined);
};

// Create default config (all components enabled)
export const createDefaultConfig = () => {
  return getAvailableComponents().map((comp, idx) => ({
    id: comp.id,
    enabled: true,
    order: idx,
    template: 'SEO',
  }));
};
