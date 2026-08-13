-- ============================================
-- FIX BLOG POSTS TABLE
-- Drop old table and recreate with all columns
-- ============================================

-- Drop existing table if it exists
DROP TABLE IF EXISTS blog_posts CASCADE;

-- Create blog_posts table with all columns
CREATE TABLE blog_posts (
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

-- Add indexes
CREATE INDEX idx_blog_slug ON blog_posts(slug);
CREATE INDEX idx_blog_category ON blog_posts(category);
CREATE INDEX idx_blog_status ON blog_posts(status);

-- ============================================
-- SEED DATA
-- ============================================

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

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "allow_read_blog_posts" ON blog_posts
FOR SELECT
USING (status = 'published' OR auth.role() = 'authenticated');

CREATE POLICY "allow_insert_blog_posts_admin" ON blog_posts
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "allow_update_blog_posts_admin" ON blog_posts
FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "allow_delete_blog_posts_admin" ON blog_posts
FOR DELETE
USING (auth.role() = 'authenticated');

-- Verify
SELECT COUNT(*) as total_posts FROM blog_posts;
