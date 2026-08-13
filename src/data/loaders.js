/**
 * Loaders for fetching page data from Supabase
 * Runs server-side (in entry-server.jsx) and serializes to client
 *
 * Each loader fetches related tables in parallel using Promise.all
 */

import { getServerSupabaseClient } from '../lib/supabase';

const supabase = getServerSupabaseClient();

/**
 * Load all data for a page by slug (used for dynamic /:slug route)
 */
export async function loadPageBySlug(slug) {
  try {
    // Fetch the page itself
    const { data: page, error: pageError } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (pageError || !page) {
      return null;
    }

    // Fetch all related content in parallel
    const [hero, stats, pricing, process, tools, scopeCards, faqs] = await Promise.all([
      supabase
        .from('page_hero')
        .select('*')
        .eq('page_id', page.id)
        .single()
        .then(({ data }) => data),

      supabase
        .from('page_stats')
        .select('*')
        .eq('page_id', page.id)
        .order('sort_order'),

      supabase
        .from('pricing_packages')
        .select(
          `
          id,
          name,
          subtitle,
          price,
          currency,
          billing_period,
          unit_label,
          is_popular,
          sort_order,
          pricing_features(id, feature_text, is_disabled, sort_order)
        `
        )
        .eq('page_id', page.id)
        .order('sort_order'),

      supabase
        .from('process_steps')
        .select('*')
        .eq('page_id', page.id)
        .order('sort_order'),

      supabase
        .from('tool_items')
        .select('*')
        .eq('page_id', page.id)
        .order('category, sort_order'),

      supabase
        .from('page_scope_cards')
        .select('*')
        .eq('page_id', page.id)
        .order('sort_order'),

      supabase
        .from('faqs')
        .select('*')
        .or(`page_id.eq.${page.id},page_id.is.null`)
        .order('sort_order'),
    ]);

    return {
      page,
      hero,
      stats: stats.data || [],
      pricing: pricing.data || [],
      process: process.data || [],
      tools: tools.data || [],
      scopeCards: scopeCards.data || [],
      faqs: faqs.data || [],
    };
  } catch (error) {
    console.error(`Error loading page ${slug}:`, error);
    return null;
  }
}

/**
 * Load home page data (composed of multiple sections)
 */
export async function loadHomePage() {
  try {
    const [testimonials, brands, chooseFeatures, gigs, portfolioItems] = await Promise.all([
      supabase
        .from('testimonials')
        .select('*')
        .order('sort_order'),

      supabase
        .from('brands')
        .select('*')
        .order('row_group, sort_order'),

      supabase
        .from('choose_features')
        .select('*')
        .order('sort_order'),

      supabase
        .from('gigs')
        .select('*')
        .order('sort_order'),

      supabase
        .from('portfolio_items')
        .select('*')
        .eq('status', 'published')
        .order('sort_order'),
    ]);

    return {
      testimonials: testimonials.data || [],
      brands: brands.data || [],
      chooseFeatures: chooseFeatures.data || [],
      gigs: gigs.data || [],
      portfolioItems: portfolioItems.data || [],
    };
  } catch (error) {
    console.error('Error loading home page:', error);
    return {
      testimonials: [],
      brands: [],
      chooseFeatures: [],
      gigs: [],
      portfolioItems: [],
    };
  }
}

/**
 * Load blog index (list of published posts)
 */
export async function loadBlogIndex() {
  try {
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('id, slug, title, excerpt, featured_image_url, category, tags, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    return {
      posts: posts || [],
    };
  } catch (error) {
    console.error('Error loading blog index:', error);
    return { posts: [] };
  }
}

/**
 * Load a single blog post by slug
 */
export async function loadBlogPostBySlug(slug) {
  try {
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error || !post) {
      return null;
    }

    return post;
  } catch (error) {
    console.error(`Error loading blog post ${slug}:`, error);
    return null;
  }
}

/**
 * Load global data (site settings, nav, footer)
 * Used on every page
 */
export async function loadGlobalData() {
  try {
    const [
      siteSettings,
      navItems,
      footerColumnsData,
      serviceOptions,
    ] = await Promise.all([
      supabase
        .from('site_settings')
        .select('*')
        .single()
        .then(({ data }) => data),

      supabase
        .from('navbar_menu_items')
        .select('*')
        .is('parent_id', true)
        .order('sort_order')
        .then(({ data }) => data || []),

      supabase
        .from('footer_columns')
        .select(
          `
          id,
          heading,
          sort_order,
          footer_links(id, label, url, sort_order)
        `
        )
        .order('sort_order')
        .then(({ data }) => data || []),

      supabase
        .from('service_options')
        .select('*')
        .order('sort_order')
        .then(({ data }) => data || []),
    ]);

    return {
      siteSettings,
      navItems,
      footerColumns: footerColumnsData,
      serviceOptions,
    };
  } catch (error) {
    console.error('Error loading global data:', error);
    return {
      siteSettings: null,
      navItems: [],
      footerColumns: [],
      serviceOptions: [],
    };
  }
}

/**
 * Load all published pages (for sitemap, nav, etc.)
 */
export async function loadAllPages() {
  try {
    const { data: pages } = await supabase
      .from('pages')
      .select('slug, updated_at, show_in_navbar, show_in_footer')
      .eq('status', 'published');

    return pages || [];
  } catch (error) {
    console.error('Error loading all pages:', error);
    return [];
  }
}

/**
 * Load all published blog posts (for sitemap)
 */
export async function loadAllBlogPosts() {
  try {
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('status', 'published');

    return posts || [];
  } catch (error) {
    console.error('Error loading all blog posts:', error);
    return [];
  }
}
