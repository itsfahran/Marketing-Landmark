// API Routes for Blog & Page Management
// These can be called from components or hooks

import { getSupabaseClient } from '../lib/supabase';

const supabase = getSupabaseClient();

// ============================================================================
// BLOG API ROUTES
// ============================================================================

export const blogAPI = {
  // Get all blog posts with pagination
  async list({ status = null, category = null, limit = 50, offset = 0 } = {}) {
    try {
      let query = supabase
        .from('blog_posts')
        .select(`
          id,
          title,
          slug,
          excerpt,
          featured_image_url,
          category:blog_categories(name),
          author:blog_authors(name),
          status,
          published_at,
          seo_score,
          view_count,
          word_count,
          reading_time_minutes
        `, { count: 'exact' });

      if (status) query = query.eq('status', status);
      if (category) query = query.eq('category_id', category);

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { data, count, error: null };
    } catch (error) {
      console.error('Error listing blog posts:', error);
      return { data: null, count: 0, error: error.message };
    }
  },

  // Get single blog post with all relations
  async get(id) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          category:blog_categories(*),
          author:blog_authors(*),
          faqs:blog_faqs(*, order(sort_order)),
          schema:blog_schema(*),
          keywords:page_seo_keywords(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching blog post:', error);
      return { data: null, error: error.message };
    }
  },

  // Create new blog post
  async create(postData) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([postData])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creating blog post:', error);
      return { data: null, error: error.message };
    }
  },

  // Update blog post
  async update(id, postData) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .update(postData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating blog post:', error);
      return { data: null, error: error.message };
    }
  },

  // Delete blog post
  async delete(id) {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      console.error('Error deleting blog post:', error);
      return { success: false, error: error.message };
    }
  },

  // Bulk update status
  async updateStatus(ids, status) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .update({ status })
        .in('id', ids)
        .select();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating blog status:', error);
      return { data: null, error: error.message };
    }
  },

  // Search blog posts
  async search(query, { limit = 20 } = {}) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt')
        .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`)
        .limit(limit);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error searching blog posts:', error);
      return { data: null, error: error.message };
    }
  },

  // Increment view count
  async incrementViews(id) {
    try {
      const { data: currentPost, error: fetchError } = await supabase
        .from('blog_posts')
        .select('view_count')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      const newCount = (currentPost?.view_count || 0) + 1;

      const { data, error } = await supabase
        .from('blog_posts')
        .update({ view_count: newCount })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error incrementing views:', error);
      return { data: null, error: error.message };
    }
  }
};

// ============================================================================
// PAGE API ROUTES
// ============================================================================

export const pageAPI = {
  // Get all pages with pagination
  async list({ status = null, template = null, limit = 50, offset = 0 } = {}) {
    try {
      let query = supabase
        .from('pages')
        .select(`
          id,
          title,
          slug,
          template_type,
          status,
          seo_score,
          view_count,
          show_in_navbar,
          show_in_footer,
          created_at
        `, { count: 'exact' });

      if (status) query = query.eq('status', status);
      if (template) query = query.eq('template_type', template);

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { data, count, error: null };
    } catch (error) {
      console.error('Error listing pages:', error);
      return { data: null, count: 0, error: error.message };
    }
  },

  // Get single page with all relations
  async get(id) {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select(`
          *,
          metadata:page_seo_metadata(*),
          schema:page_schema(*),
          keywords:page_seo_keywords(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching page:', error);
      return { data: null, error: error.message };
    }
  },

  // Get page by slug
  async getBySlug(slug) {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select(`
          *,
          metadata:page_seo_metadata(*),
          schema:page_schema(*),
          keywords:page_seo_keywords(*)
        `)
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching page by slug:', error);
      return { data: null, error: error.message };
    }
  },

  // Create new page
  async create(pageData) {
    try {
      const { data, error } = await supabase
        .from('pages')
        .insert([pageData])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creating page:', error);
      return { data: null, error: error.message };
    }
  },

  // Update page
  async update(id, pageData) {
    try {
      const { data, error } = await supabase
        .from('pages')
        .update(pageData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating page:', error);
      return { data: null, error: error.message };
    }
  },

  // Delete page
  async delete(id) {
    try {
      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      console.error('Error deleting page:', error);
      return { success: false, error: error.message };
    }
  },

  // Update SEO metadata
  async updateSEOMetadata(pageId, metadata) {
    try {
      const { data, error } = await supabase
        .from('page_seo_metadata')
        .upsert({
          page_id: pageId,
          ...metadata,
          last_seo_check: new Date().toISOString()
        }, { onConflict: 'page_id' })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating SEO metadata:', error);
      return { data: null, error: error.message };
    }
  },

  // Bulk update status
  async updateStatus(ids, status) {
    try {
      const { data, error } = await supabase
        .from('pages')
        .update({ status })
        .in('id', ids)
        .select();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating page status:', error);
      return { data: null, error: error.message };
    }
  },

  // Increment view count
  async incrementViews(id) {
    try {
      const { data: currentPage, error: fetchError } = await supabase
        .from('pages')
        .select('view_count')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      const newCount = (currentPage?.view_count || 0) + 1;

      const { data, error } = await supabase
        .from('pages')
        .update({ view_count: newCount })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error incrementing page views:', error);
      return { data: null, error: error.message };
    }
  },

  // Get pages for navigation
  async getNavPages() {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('id, title, slug, show_in_navbar')
        .eq('status', 'published')
        .eq('show_in_navbar', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching nav pages:', error);
      return { data: null, error: error.message };
    }
  },

  // Get pages for footer
  async getFooterPages() {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('id, title, slug, show_in_footer')
        .eq('status', 'published')
        .eq('show_in_footer', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching footer pages:', error);
      return { data: null, error: error.message };
    }
  }
};

// ============================================================================
// UTILITY API ROUTES
// ============================================================================

export const utilityAPI = {
  // Get all categories
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return { data: null, error: error.message };
    }
  },

  // Get all authors
  async getAuthors() {
    try {
      const { data, error } = await supabase
        .from('blog_authors')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching authors:', error);
      return { data: null, error: error.message };
    }
  },

  // Get SEO dashboard stats
  async getDashboardStats() {
    try {
      const [
        blogsResult,
        pagesResult,
        lowSEOBlogsResult,
        lowSEOPagesResult
      ] = await Promise.all([
        supabase.from('blog_posts').select('id', { count: 'exact' }).eq('status', 'published'),
        supabase.from('pages').select('id', { count: 'exact' }).eq('status', 'published'),
        supabase.from('blog_posts').select('id', { count: 'exact' }).eq('status', 'published').lt('seo_score', 60),
        supabase.from('pages').select('id', { count: 'exact' }).eq('status', 'published').lt('seo_score', 60)
      ]);

      return {
        data: {
          totalBlogs: blogsResult.count,
          totalPages: pagesResult.count,
          lowSEOBlogs: lowSEOBlogsResult.count,
          lowSEOPages: lowSEOPagesResult.count
        },
        error: null
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return { data: null, error: error.message };
    }
  },

  // Get recent blog posts
  async getRecentBlogs(limit = 5) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, published_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching recent blogs:', error);
      return { data: null, error: error.message };
    }
  }
};
