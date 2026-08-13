-- ============================================
-- BLOG POSTS TABLE & SEED DATA
-- Create table and populate blog posts
-- ============================================

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  description TEXT,
  content TEXT,
  featured_image_url TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_status ON blog_posts(status);

-- ============================================
-- SEED DATA
-- ============================================

DELETE FROM blog_posts;

INSERT INTO blog_posts (title, slug, category, description, content, status) VALUES
(
  'Complete SEO Strategy for Business Growth',
  'complete-seo-strategy',
  'SEO',
  'Learn how keyword research, technical SEO and content planning help your website rank higher.',
  'A comprehensive guide to building an effective SEO strategy that drives organic growth and improves your website''s search visibility.',
  'published'
),
(
  'Generative Engine Optimization for AI Search',
  'generative-engine-optimization',
  'GEO',
  'Optimize your brand for AI search platforms like ChatGPT, Gemini and Perplexity.',
  'Discover how to optimize your content for AI-powered search engines and reach users through ChatGPT, Gemini, and Perplexity search results.',
  'published'
),
(
  'How Local SEO Brings More Customers',
  'local-seo-customers',
  'Local SEO',
  'Improve Google Maps visibility, local rankings and customer calls with smart local SEO.',
  'Master the strategies to dominate local search results, improve your Google Maps presence, and attract more customers in your area.',
  'published'
),
(
  'SEO Content Writing That Converts',
  'seo-content-writing',
  'Content',
  'Create content that ranks well and turns visitors into real business leads.',
  'Learn how to write SEO-optimized content that not only ranks on Google but also converts visitors into qualified leads for your business.',
  'published'
);

-- Verify data
SELECT COUNT(*) as total_posts FROM blog_posts;
