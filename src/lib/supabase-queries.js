/**
 * Supabase Query Utilities
 * Reusable functions for common database operations
 * Used by both admin panel and public site
 */

import { getSupabaseClient } from './supabase';

/**
 * PAGES
 */

export async function fetchPages() {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('pages')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });
  if (error) console.error('Error fetching pages:', error);
  return data || [];
}

export async function fetchPageBySlug(slug) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
  if (error) console.error(`Error fetching page ${slug}:`, error);
  return data;
}

export async function fetchAllPages() {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('pages')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) console.error('Error fetching all pages:', error);
  return data || [];
}

export async function createPage(pageData) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('pages')
    .insert([pageData])
    .select();
  if (error) console.error('Error creating page:', error);
  return data?.[0];
}

export async function updatePage(id, updates) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('pages')
    .update(updates)
    .eq('id', id)
    .select();
  if (error) console.error('Error updating page:', error);
  return data?.[0];
}

export async function deletePage(id) {
  const supabaseClient = getSupabaseClient();
  const { error } = await supabaseClient
    .from('pages')
    .delete()
    .eq('id', id);
  if (error) console.error('Error deleting page:', error);
  return !error;
}

/**
 * PAGE CONTENT (Hero, Stats, etc.)
 */

export async function fetchPageHero(pageId) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('page_hero')
    .select('*')
    .eq('page_id', pageId)
    .single();
  if (error) console.error('Error fetching hero:', error);
  return data;
}

export async function createPageHero(heroData) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('page_hero')
    .insert([heroData])
    .select();
  if (error) console.error('Error creating hero:', error);
  return data?.[0];
}

export async function updatePageHero(pageId, updates) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('page_hero')
    .update(updates)
    .eq('page_id', pageId)
    .select();
  if (error) console.error('Error updating hero:', error);
  return data?.[0];
}

export async function fetchPageStats(pageId) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('page_stats')
    .select('*')
    .eq('page_id', pageId)
    .order('sort_order');
  if (error) console.error('Error fetching stats:', error);
  return data || [];
}

export async function fetchPricingPackages(pageId) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('pricing_packages')
    .select(`
      *,
      pricing_features(id, feature_text, is_disabled, sort_order)
    `)
    .eq('page_id', pageId)
    .order('sort_order');
  if (error) console.error('Error fetching pricing:', error);
  return data || [];
}

export async function fetchProcessSteps(pageId = null) {
  const supabaseClient = getSupabaseClient();
  let query = supabaseClient
    .from('process_steps')
    .select('*');

  if (pageId) {
    query = query.eq('page_id', pageId);
  }

  const { data, error } = await query.order('sort_order');
  if (error) console.error('Error fetching process steps:', error);
  return data || [];
}

export async function fetchToolItems(pageId, category = null) {
  const supabaseClient = getSupabaseClient();
  let query = supabaseClient
    .from('tool_items')
    .select('*')
    .eq('page_id', pageId);

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query.order('sort_order');
  if (error) console.error('Error fetching tools:', error);
  return data || [];
}

export async function fetchPageScopeCards(pageId) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('page_scope_cards')
    .select('*')
    .eq('page_id', pageId)
    .order('sort_order');
  if (error) console.error('Error fetching scope cards:', error);
  return data || [];
}

export async function createPageScopeCard(cardData) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('page_scope_cards')
    .insert([cardData])
    .select();
  if (error) console.error('Error creating scope card:', error);
  return data?.[0];
}

export async function createPageStats(statsData) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('page_stats')
    .insert([statsData])
    .select();
  if (error) console.error('Error creating stats:', error);
  return data?.[0];
}

/**
 * GLOBAL CONTENT
 */

export async function fetchTestimonials(limit = null) {
  const supabaseClient = getSupabaseClient();
  let query = supabaseClient
    .from('testimonials')
    .select('*')
    .order('sort_order');

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) console.error('Error fetching testimonials:', error);
  return data || [];
}

export async function fetchVideoTestimonials(limit = null) {
  const supabaseClient = getSupabaseClient();
  let query = supabaseClient
    .from('video_testimonials')
    .select('*')
    .order('sort_order');

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) console.error('Error fetching video testimonials:', error);
  return data || [];
}

export async function fetchChooseFeatures() {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('choose_features')
    .select('*')
    .order('sort_order');
  if (error) console.error('Error fetching choose features:', error);
  return data || [];
}

export async function fetchFAQs(pageId = null) {
  const supabaseClient = getSupabaseClient();
  let query = supabaseClient.from('faqs').select('*');

  if (pageId) {
    query = query.or(`page_id.eq.${pageId},page_id.is.null`);
  } else {
    query = query.is('page_id', null);
  }

  const { data, error } = await query.order('sort_order');
  if (error) console.error('Error fetching FAQs:', error);
  return data || [];
}

export async function fetchBrands() {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('brands')
    .select('*')
    .order('row_group, sort_order');
  if (error) console.error('Error fetching brands:', error);
  return data || [];
}

/**
 * PORTFOLIO & BLOG
 */

export async function fetchPortfolioItems(status = 'published') {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('portfolio_items')
    .select('*')
    .eq('status', status)
    .order('sort_order');
  if (error) console.error('Error fetching portfolio:', error);
  return data || [];
}

export async function fetchBlogPosts(status = 'published', limit = null) {
  const supabaseClient = getSupabaseClient();
  let query = supabaseClient
    .from('blog_posts')
    .select('*')
    .eq('status', status)
    .order('published_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) console.error('Error fetching blog posts:', error);
  return data || [];
}

export async function fetchBlogPostBySlug(slug) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
  if (error) console.error(`Error fetching blog post ${slug}:`, error);
  return data;
}

/**
 * ABOUT PAGE
 */

export async function fetchTeamMembers() {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('team_members')
    .select('*')
    .order('sort_order');
  if (error) console.error('Error fetching team members:', error);
  return data || [];
}

export async function fetchAchievements() {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('achievements')
    .select('*')
    .order('sort_order');
  if (error) console.error('Error fetching achievements:', error);
  return data || [];
}

export async function fetchMissionCards() {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('mission_cards')
    .select('*')
    .order('sort_order');
  if (error) console.error('Error fetching mission cards:', error);
  return data || [];
}

/**
 * HIRE SECTION
 */

export async function fetchGigs() {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('gigs')
    .select('*')
    .order('sort_order');
  if (error) console.error('Error fetching gigs:', error);
  return data || [];
}

/**
 * SITE NAVIGATION & CONFIG
 */

export async function fetchNavbarMenuItems() {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('navbar_menu_items')
    .select('*')
    .order('sort_order');
  if (error) console.error('Error fetching navbar:', error);
  return data || [];
}

export async function fetchFooterColumns() {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('footer_columns')
    .select(`
      *,
      footer_links(id, label, url, sort_order)
    `)
    .order('sort_order');
  if (error) console.error('Error fetching footer:', error);
  return data || [];
}

export async function fetchSiteSettings() {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('site_settings')
    .select('*')
    .single();
  if (error) console.error('Error fetching site settings:', error);
  return data;
}

export async function fetchServiceOptions() {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('service_options')
    .select('*')
    .order('sort_order');
  if (error) console.error('Error fetching service options:', error);
  return data || [];
}

/**
 * BATCH OPERATIONS FOR ADMIN
 */

export async function createPricingPackage(packageData) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('pricing_packages')
    .insert([packageData])
    .select();
  if (error) console.error('Error creating package:', error);
  return data?.[0];
}

export async function createPricingFeatures(features) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('pricing_features')
    .insert(features)
    .select();
  if (error) console.error('Error creating features:', error);
  return data || [];
}

export async function updatePricingPackage(id, updates) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('pricing_packages')
    .update(updates)
    .eq('id', id)
    .select();
  if (error) console.error('Error updating package:', error);
  return data?.[0];
}

export async function deletePricingPackage(id) {
  const supabaseClient = getSupabaseClient();
  const { error } = await supabaseClient
    .from('pricing_packages')
    .delete()
    .eq('id', id);
  if (error) console.error('Error deleting package:', error);
  return !error;
}

/**
 * BLOG OPERATIONS
 */

export async function createBlogPost(postData) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('blog_posts')
    .insert([postData])
    .select();
  if (error) console.error('Error creating blog post:', error);
  return data?.[0];
}

export async function updateBlogPost(id, updates) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('blog_posts')
    .update(updates)
    .eq('id', id)
    .select();
  if (error) console.error('Error updating blog post:', error);
  return data?.[0];
}

export async function deleteBlogPost(id) {
  const supabaseClient = getSupabaseClient();
  const { error } = await supabaseClient
    .from('blog_posts')
    .delete()
    .eq('id', id);
  if (error) console.error('Error deleting blog post:', error);
  return !error;
}

/**
 * PORTFOLIO OPERATIONS
 */

export async function createPortfolioItem(itemData) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('portfolio_items')
    .insert([itemData])
    .select();
  if (error) console.error('Error creating portfolio item:', error);
  return data?.[0];
}

export async function updatePortfolioItem(id, updates) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('portfolio_items')
    .update(updates)
    .eq('id', id)
    .select();
  if (error) console.error('Error updating portfolio item:', error);
  return data?.[0];
}

export async function deletePortfolioItem(id) {
  const supabaseClient = getSupabaseClient();
  const { error } = await supabaseClient
    .from('portfolio_items')
    .delete()
    .eq('id', id);
  if (error) console.error('Error deleting portfolio item:', error);
  return !error;
}

/**
 * GENERIC CREATE/UPDATE/DELETE
 */

export async function createRecord(table, data) {
  const supabaseClient = getSupabaseClient();
  const { data: result, error } = await supabaseClient
    .from(table)
    .insert([data])
    .select();
  if (error) console.error(`Error creating ${table}:`, error);
  return result?.[0];
}

export async function updateRecord(table, id, updates) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from(table)
    .update(updates)
    .eq('id', id)
    .select();
  if (error) console.error(`Error updating ${table}:`, error);
  return data?.[0];
}

export async function deleteRecord(table, id) {
  const supabaseClient = getSupabaseClient();
  const { error } = await supabaseClient
    .from(table)
    .delete()
    .eq('id', id);
  if (error) console.error(`Error deleting from ${table}:`, error);
  return !error;
}

/**
 * HOME PAGE COMPONENTS
 */

// HERO
export async function fetchHero() {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('hero')
    .select('*')
    .limit(1);
  if (error) console.error('Error fetching hero:', error);
  return data?.[0];
}

export async function updateHero(updates) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('hero')
    .update(updates)
    .select();
  if (error) console.error('Error updating hero:', error);
  return data?.[0];
}

// SERVICES
export async function fetchServices() {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('services')
    .select('*')
    .order('sort_order');
  if (error) console.error('Error fetching services:', error);
  return data || [];
}

export async function createService(serviceData) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('services')
    .insert([serviceData])
    .select();
  if (error) console.error('Error creating service:', error);
  return data?.[0];
}

export async function updateService(id, updates) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('services')
    .update(updates)
    .eq('id', id)
    .select();
  if (error) console.error('Error updating service:', error);
  return data?.[0];
}

export async function deleteService(id) {
  const supabaseClient = getSupabaseClient();
  const { error } = await supabaseClient
    .from('services')
    .delete()
    .eq('id', id);
  if (error) console.error('Error deleting service:', error);
  return !error;
}

// ABOUT
export async function fetchAbout() {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('about')
    .select('*')
    .limit(1);
  if (error) console.error('Error fetching about:', error);
  return data?.[0];
}

export async function updateAbout(updates) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('about')
    .update(updates)
    .select();
  if (error) console.error('Error updating about:', error);
  return data?.[0];
}

// HIRE GIGS
export async function fetchHireGigs() {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('hire_gigs')
    .select('*')
    .order('sort_order');
  if (error) console.error('Error fetching hire gigs:', error);
  return data || [];
}

export async function createHireGig(gigData) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('hire_gigs')
    .insert([gigData])
    .select();
  if (error) console.error('Error creating gig:', error);
  return data?.[0];
}

export async function updateHireGig(id, updates) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('hire_gigs')
    .update(updates)
    .eq('id', id)
    .select();
  if (error) console.error('Error updating gig:', error);
  return data?.[0];
}

export async function deleteHireGig(id) {
  const supabaseClient = getSupabaseClient();
  const { error } = await supabaseClient
    .from('hire_gigs')
    .delete()
    .eq('id', id);
  if (error) console.error('Error deleting gig:', error);
  return !error;
}

// CONTACT
export async function fetchContactSection() {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('contact')
    .select('*')
    .limit(1);
  if (error) console.error('Error fetching contact:', error);
  return data?.[0];
}

// ========== ABOUT PAGE QUERIES ==========

export async function fetchAboutPageHero() {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('about_page_hero')
    .select('*')
    .limit(1);
  if (error) console.error('Error fetching about hero:', error);
  return data?.[0];
}

export async function fetchAboutPageMarquee() {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('about_page_marquee')
    .select('*')
    .order('sort_order');
  if (error) console.error('Error fetching marquee:', error);
  return data || [];
}

export async function fetchAboutPageMissionValues() {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('about_page_mission_values')
    .select('*')
    .order('sort_order');
  if (error) console.error('Error fetching mission values:', error);
  return data || [];
}

export async function fetchAboutPageTeam() {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('about_page_team')
    .select('*')
    .order('sort_order');
  if (error) console.error('Error fetching team:', error);
  return data || [];
}

export async function fetchAboutPageAchievements() {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('about_page_achievements')
    .select('*')
    .order('sort_order');
  if (error) console.error('Error fetching achievements:', error);
  return data || [];
}

export async function updateContactSection(updates) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('contact')
    .update(updates)
    .select();
  if (error) console.error('Error updating contact:', error);
  return data?.[0];
}


// TESTIMONIALS (HOME PAGE)
export async function fetchHomeTestimonials() {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('testimonials')
    .select('*')
    .order('sort_order');
  if (error) console.error('Error fetching testimonials:', error);
  return data || [];
}

export async function createTestimonial(testimonialData) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('testimonials')
    .insert([testimonialData])
    .select();
  if (error) console.error('Error creating testimonial:', error);
  return data?.[0];
}

export async function updateTestimonial(id, updates) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('testimonials')
    .update(updates)
    .eq('id', id)
    .select();
  if (error) console.error('Error updating testimonial:', error);
  return data?.[0];
}

export async function deleteTestimonial(id) {
  const supabaseClient = getSupabaseClient();
  const { error } = await supabaseClient
    .from('testimonials')
    .delete()
    .eq('id', id);
  if (error) console.error('Error deleting testimonial:', error);
  return !error;
}

export async function createVideoTestimonial(videoData) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('video_testimonials')
    .insert([videoData])
    .select();
  if (error) console.error('Error creating video testimonial:', error);
  return data?.[0];
}

export async function updateVideoTestimonial(id, updates) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('video_testimonials')
    .update(updates)
    .eq('id', id)
    .select();
  if (error) console.error('Error updating video testimonial:', error);
  return data?.[0];
}

export async function deleteVideoTestimonial(id) {
  const supabaseClient = getSupabaseClient();
  const { error } = await supabaseClient
    .from('video_testimonials')
    .delete()
    .eq('id', id);
  if (error) console.error('Error deleting video testimonial:', error);
  return !error;
}

// PORTFOLIO ITEMS (HOME PAGE)
export async function fetchHomePortfolioItems() {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('portfolio_items')
    .select('*')
    .order('sort_order');
  if (error) console.error('Error fetching portfolio items:', error);
  return data || [];
}

export async function createPortfolioItemHome(itemData) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('portfolio_items')
    .insert([itemData])
    .select();
  if (error) console.error('Error creating portfolio item:', error);
  return data?.[0];
}

export async function updatePortfolioItemHome(id, updates) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('portfolio_items')
    .update(updates)
    .eq('id', id)
    .select();
  if (error) console.error('Error updating portfolio item:', error);
  return data?.[0];
}

export async function deletePortfolioItemHome(id) {
  const supabaseClient = getSupabaseClient();
  const { error } = await supabaseClient
    .from('portfolio_items')
    .delete()
    .eq('id', id);
  if (error) console.error('Error deleting portfolio item:', error);
  return !error;
}

// ============================================
// PORTFOLIO PAGE (Page for /portfolio route)
// ============================================

export async function fetchPortfolioPageHero() {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('portfolio_page_hero')
    .select('*')
    .single();
  if (error) console.error('Error fetching portfolio hero:', error);
  return data;
}

export async function updatePortfolioPageHero(updates) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('portfolio_page_hero')
    .update(updates)
    .select();
  if (error) console.error('Error updating portfolio hero:', error);
  return data?.[0];
}

export async function fetchPortfolioCategories() {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('portfolio_categories')
    .select('*')
    .order('sort_order');
  if (error) console.error('Error fetching portfolio categories:', error);
  return data || [];
}

export async function createPortfolioCategory(categoryData) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('portfolio_categories')
    .insert([categoryData])
    .select();
  if (error) console.error('Error creating category:', error);
  return data?.[0];
}

export async function updatePortfolioCategory(id, updates) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('portfolio_categories')
    .update(updates)
    .eq('id', id)
    .select();
  if (error) console.error('Error updating category:', error);
  return data?.[0];
}

export async function deletePortfolioCategory(id) {
  const supabaseClient = getSupabaseClient();
  const { error } = await supabaseClient
    .from('portfolio_categories')
    .delete()
    .eq('id', id);
  if (error) console.error('Error deleting category:', error);
  return !error;
}

export async function fetchPortfolioProjects() {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('portfolio_projects')
    .select('*')
    .order('sort_order');
  if (error) console.error('Error fetching portfolio projects:', error);
  return data || [];
}

export async function createPortfolioProject(projectData) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('portfolio_projects')
    .insert([projectData])
    .select();
  if (error) console.error('Error creating project:', error);
  return data?.[0];
}

export async function updatePortfolioProject(id, updates) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('portfolio_projects')
    .update(updates)
    .eq('id', id)
    .select();
  if (error) console.error('Error updating project:', error);
  return data?.[0];
}

export async function deletePortfolioProject(id) {
  const supabaseClient = getSupabaseClient();
  const { error } = await supabaseClient
    .from('portfolio_projects')
    .delete()
    .eq('id', id);
  if (error) console.error('Error deleting project:', error);
  return !error;
}

// ============================================
// CONTACT SUBMISSIONS
// ============================================

export async function createContactSubmission(submissionData) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('contact_submissions')
    .insert([submissionData])
    .select();
  if (error) console.error('Error creating submission:', error);
  return data?.[0];
}

export async function fetchContactSubmissions() {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) console.error('Error fetching submissions:', error);
  return data || [];
}

export async function updateContactSubmissionStatus(id, status) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('contact_submissions')
    .update({ status })
    .eq('id', id)
    .select();
  if (error) console.error('Error updating submission:', error);
  return data?.[0];
}

export async function deleteContactSubmission(id) {
  const supabaseClient = getSupabaseClient();
  const { error } = await supabaseClient
    .from('contact_submissions')
    .delete()
    .eq('id', id);
  if (error) console.error('Error deleting submission:', error);
  return !error;
}

// SERVICES & TEMPLATES
export async function fetchTemplates() {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('templates')
    .select('*')
    .order('name');
  if (error) console.error('Error fetching templates:', error);
  return data || [];
}

export async function fetchTemplateById(id) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('templates')
    .select('*')
    .eq('id', id)
    .single();
  if (error) console.error('Error fetching template:', error);
  return data;
}

export async function fetchTemplateSections(templateId) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('template_sections')
    .select('*')
    .eq('template_id', templateId)
    .order('display_order');
  if (error) console.error('Error fetching template sections:', error);
  return data || [];
}

export async function fetchServiceBySlug(slug) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('services')
    .select('*, templates(id, name, label)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
  if (error) console.error('Error fetching service:', error);
  return data;
}

export async function fetchServiceById(id) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('services')
    .select('*, templates(id, name, label)')
    .eq('id', id)
    .single();
  if (error) console.error('Error fetching service:', error);
  return data;
}

// SERVICE PRICING
export async function fetchServicePricing(serviceId) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('service_pricing')
    .select('*')
    .eq('service_id', serviceId)
    .order('sort_order');
  if (error) console.error('Error fetching pricing:', error);

  // Fetch features for each pricing package
  if (data && data.length > 0) {
    for (let pkg of data) {
      const { data: features } = await supabaseClient
        .from('pricing_features')
        .select('*')
        .eq('pricing_id', pkg.id)
        .order('sort_order');
      pkg.features = features || [];
    }
  }

  return data || [];
}

export async function createServicePricing(pricingData) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('service_pricing')
    .insert([pricingData])
    .select();
  if (error) console.error('Error creating pricing:', error);
  return data?.[0];
}

export async function updateServicePricing(id, updates) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('service_pricing')
    .update(updates)
    .eq('id', id)
    .select();
  if (error) console.error('Error updating pricing:', error);
  return data?.[0];
}

export async function deleteServicePricing(id) {
  const supabaseClient = getSupabaseClient();
  const { error } = await supabaseClient
    .from('service_pricing')
    .delete()
    .eq('id', id);
  if (error) console.error('Error deleting pricing:', error);
  return !error;
}

// SERVICE PROCESS STEPS
export async function fetchServiceProcessSteps(serviceId) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('service_process_steps')
    .select('*')
    .eq('service_id', serviceId)
    .order('sort_order');
  if (error) console.error('Error fetching process steps:', error);
  return data || [];
}

export async function createServiceProcessStep(stepData) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('service_process_steps')
    .insert([stepData])
    .select();
  if (error) console.error('Error creating process step:', error);
  return data?.[0];
}

export async function deleteServiceProcessStep(id) {
  const supabaseClient = getSupabaseClient();
  const { error } = await supabaseClient
    .from('service_process_steps')
    .delete()
    .eq('id', id);
  if (error) console.error('Error deleting process step:', error);
  return !error;
}

// SERVICE TOOLS
export async function fetchServiceTools(serviceId) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('service_tools')
    .select('*')
    .eq('service_id', serviceId)
    .order('sort_order');
  if (error) console.error('Error fetching tools:', error);
  return data || [];
}

export async function createServiceTool(toolData) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('service_tools')
    .insert([toolData])
    .select();
  if (error) console.error('Error creating tool:', error);
  return data?.[0];
}

export async function deleteServiceTool(id) {
  const supabaseClient = getSupabaseClient();
  const { error } = await supabaseClient
    .from('service_tools')
    .delete()
    .eq('id', id);
  if (error) console.error('Error deleting tool:', error);
  return !error;
}

// SERVICE SCOPE CARDS
export async function fetchServiceScopeCards(serviceId) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('service_scope_cards')
    .select('*')
    .eq('service_id', serviceId)
    .order('sort_order');
  if (error) console.error('Error fetching scope cards:', error);
  return data || [];
}

export async function createServiceScopeCard(cardData) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('service_scope_cards')
    .insert([cardData])
    .select();
  if (error) console.error('Error creating scope card:', error);
  return data?.[0];
}

export async function deleteServiceScopeCard(id) {
  const supabaseClient = getSupabaseClient();
  const { error } = await supabaseClient
    .from('service_scope_cards')
    .delete()
    .eq('id', id);
  if (error) console.error('Error deleting scope card:', error);
  return !error;
}

// SERVICE FAQs
export async function fetchServiceFAQs(serviceId) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('service_faqs')
    .select('*')
    .eq('service_id', serviceId)
    .order('sort_order');
  if (error) console.error('Error fetching FAQs:', error);
  return data || [];
}

export async function createServiceFAQ(faqData) {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('service_faqs')
    .insert([faqData])
    .select();
  if (error) console.error('Error creating FAQ:', error);
  return data?.[0];
}

export async function deleteServiceFAQ(id) {
  const supabaseClient = getSupabaseClient();
  const { error } = await supabaseClient
    .from('service_faqs')
    .delete()
    .eq('id', id);
  if (error) console.error('Error deleting FAQ:', error);
  return !error;
}
