/**
 * Route Loaders - Fetch data from Supabase
 * Used by React Router to load data before rendering pages
 */

import { getSupabaseClient } from './supabase';

/**
 * Load service/page data by slug
 * Returns all data needed to render a dynamic service page
 */
export async function loadServiceBySlug(slug) {
  try {
    const supabase = getSupabaseClient();

    console.log('🔍 Loading service with slug:', slug);

    // Fetch the page
    const { data: page, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .single();

    console.log('📄 Page data:', page);
    console.log('❌ Query error:', error);

    if (!page) {
      console.error('Page not found for slug:', slug);
      return { error: 'Page not found', status: 404 };
    }

    // Fetch all related data in parallel
    const [
      { data: hero, error: heroError },
      { data: stats },
      { data: pricing },
      { data: scopeCards },
      { data: processSteps },
      { data: testimonials },
      { data: brands },
      { data: chooseFeatures },
      { data: faqs },
    ] = await Promise.all([
      supabase.from('page_hero').select('*').eq('page_id', page.id).single(),
      supabase.from('page_stats').select('*').eq('page_id', page.id).order('sort_order'),
      supabase
        .from('pricing_packages')
        .select(`
          *,
          pricing_features(*)
        `)
        .eq('page_id', page.id)
        .order('sort_order'),
      supabase.from('page_scope_cards').select('*').eq('page_id', page.id).order('sort_order'),
      supabase.from('process_steps').select('*').eq('page_id', page.id).order('sort_order'),
      supabase
        .from('testimonials')
        .select('*')
        .eq('page_id', page.id)
        .order('sort_order')
        .limit(3),
      supabase.from('brands').select('*').eq('page_id', page.id).order('sort_order'),
      supabase.from('choose_features').select('*').eq('page_id', page.id).order('sort_order'),
      supabase
        .from('faqs')
        .select('*')
        .or(`page_id.eq.${page.id},page_id.is.null`)
        .order('sort_order'),
    ]);

    console.log('🦸 Hero data:', hero, 'Error:', heroError);
    console.log('📊 Stats:', stats?.length || 0);
    console.log('💰 Pricing:', pricing?.length || 0);

    if (heroError) {
      console.warn('⚠️ No hero found for page:', page.id, '- Using empty object');
    }

    return {
      page,
      hero: hero && !heroError ? hero : {},
      stats: stats || [],
      pricing: pricing || [],
      scopeCards: scopeCards || [],
      processSteps: processSteps || [],
      testimonials: testimonials || [],
      brands: brands || [],
      chooseFeatures: chooseFeatures || [],
      faqs: faqs || [],
    };
  } catch (error) {
    console.error('Error loading service:', error);
    return { error: 'Failed to load page', status: 500 };
  }
}
