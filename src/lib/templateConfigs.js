/**
 * Template-specific layout configurations
 * Defines which components to show and in what order for each template
 */

export const TEMPLATE_CONFIGS = {
  seo: {
    name: 'SEO Template',
    color: '#2563eb',
    components: [
      'hero',
      'stats',
      'pricing',
      'scopeCards',
      'processSteps',
      'testimonials',
      'brands',
      'chooseFeatures',
      'contact',
    ],
    heroStyle: 'seo',
  },
  geo: {
    name: 'GEO Template',
    color: '#7c3aed',
    components: [
      'hero',
      'stats',
      'pricing',
      'scopeCards',
      'processSteps',
      'brands',
      'chooseFeatures',
      'testimonials',
      'contact',
    ],
    heroStyle: 'geo',
  },
  local: {
    name: 'Local SEO Template',
    color: '#059669',
    components: [
      'hero',
      'stats',
      'pricing',
      'scopeCards',
      'processSteps',
      'testimonials',
      'chooseFeatures',
      'brands',
      'contact',
    ],
    heroStyle: 'local',
  },
};

export function getTemplateConfig(templateType) {
  return TEMPLATE_CONFIGS[templateType] || TEMPLATE_CONFIGS.seo;
}
