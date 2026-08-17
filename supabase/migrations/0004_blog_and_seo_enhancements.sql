-- Migration 0004: Blog Editor & Page SEO Enhancements
-- Adds comprehensive blog management and advanced SEO capabilities

-- ============================================================================
-- BLOG CONTENT ENHANCEMENTS
-- ============================================================================

-- Create blog_categories table
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon_name VARCHAR(100),
  color VARCHAR(7),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);

-- Create blog_authors table
CREATE TABLE IF NOT EXISTS blog_authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  avatar_url TEXT,
  role VARCHAR(100),
  bio TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_authors_email ON blog_authors(email);

-- Alter blog_posts table to add comprehensive fields for the blog editor
ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES blog_authors(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS featured_image_alt_text VARCHAR(255),
ADD COLUMN IF NOT EXISTS featured_image_title VARCHAR(255),
ADD COLUMN IF NOT EXISTS featured_image_caption TEXT,
ADD COLUMN IF NOT EXISTS focus_keyword VARCHAR(100),
ADD COLUMN IF NOT EXISTS canonical_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS robots_directive VARCHAR(50) DEFAULT 'index,follow',
ADD COLUMN IF NOT EXISTS og_title VARCHAR(255),
ADD COLUMN IF NOT EXISTS og_description TEXT,
ADD COLUMN IF NOT EXISTS twitter_card VARCHAR(50) DEFAULT 'summary_large_image',
ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
ADD COLUMN IF NOT EXISTS scheduled_publish_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS word_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS reading_time_minutes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS seo_score INTEGER DEFAULT 0;

-- Create index for new columns
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_id ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_scheduled_publish_at ON blog_posts(scheduled_publish_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_visibility ON blog_posts(visibility);

-- Create blog_faqs table for blog-specific FAQs
CREATE TABLE IF NOT EXISTS blog_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_faqs_blog_id ON blog_faqs(blog_id);

-- ============================================================================
-- PAGE SEO ENHANCEMENTS
-- ============================================================================

-- Enhance pages table with advanced SEO fields
ALTER TABLE pages
ADD COLUMN IF NOT EXISTS focus_keyword VARCHAR(100),
ADD COLUMN IF NOT EXISTS meta_keywords_secondary TEXT,
ADD COLUMN IF NOT EXISTS og_type VARCHAR(50) DEFAULT 'website',
ADD COLUMN IF NOT EXISTS twitter_card VARCHAR(50) DEFAULT 'summary_large_image',
ADD COLUMN IF NOT EXISTS twitter_creator VARCHAR(100),
ADD COLUMN IF NOT EXISTS search_preview_checked BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS seo_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS parent_page_id UUID REFERENCES pages(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
ADD COLUMN IF NOT EXISTS scheduled_publish_at TIMESTAMPTZ;

-- Create index for SEO queries
CREATE INDEX IF NOT EXISTS idx_pages_focus_keyword ON pages(focus_keyword);
CREATE INDEX IF NOT EXISTS idx_pages_visibility ON pages(visibility);
CREATE INDEX IF NOT EXISTS idx_pages_parent_page_id ON pages(parent_page_id);
CREATE INDEX IF NOT EXISTS idx_pages_scheduled_publish_at ON pages(scheduled_publish_at);
CREATE INDEX IF NOT EXISTS idx_pages_seo_score ON pages(seo_score);

-- Create page_seo_metadata table for advanced SEO tracking
CREATE TABLE IF NOT EXISTS page_seo_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL UNIQUE REFERENCES pages(id) ON DELETE CASCADE,
  h1_count INTEGER DEFAULT 0,
  h2_count INTEGER DEFAULT 0,
  h3_count INTEGER DEFAULT 0,
  internal_links_count INTEGER DEFAULT 0,
  external_links_count INTEGER DEFAULT 0,
  images_with_alt_count INTEGER DEFAULT 0,
  images_without_alt_count INTEGER DEFAULT 0,
  has_canonical BOOLEAN DEFAULT false,
  has_open_graph BOOLEAN DEFAULT false,
  has_schema_markup BOOLEAN DEFAULT false,
  last_seo_check TIMESTAMPTZ,
  keywords_in_title BOOLEAN DEFAULT false,
  keywords_in_description BOOLEAN DEFAULT false,
  keywords_in_h1 BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create page_seo_keywords table for keyword tracking
CREATE TABLE IF NOT EXISTS page_seo_keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  keyword VARCHAR(255) NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  keyword_density NUMERIC(5,2),
  positions TEXT[] DEFAULT ARRAY[]::TEXT[],
  last_updated TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(page_id, keyword)
);

CREATE INDEX IF NOT EXISTS idx_page_seo_keywords_page_id ON page_seo_keywords(page_id);
CREATE INDEX IF NOT EXISTS idx_page_seo_keywords_keyword ON page_seo_keywords(keyword);

-- ============================================================================
-- SCHEMA & STRUCTURED DATA
-- ============================================================================

-- Create page_schema table for JSON-LD structured data
CREATE TABLE IF NOT EXISTS page_schema (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL UNIQUE REFERENCES pages(id) ON DELETE CASCADE,
  schema_type VARCHAR(100) NOT NULL,
  schema_data JSONB NOT NULL,
  is_auto_generated BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create blog_schema table for JSON-LD structured data
CREATE TABLE IF NOT EXISTS blog_schema (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id UUID NOT NULL UNIQUE REFERENCES blog_posts(id) ON DELETE CASCADE,
  schema_type VARCHAR(100) NOT NULL DEFAULT 'BlogPosting',
  schema_data JSONB NOT NULL,
  is_auto_generated BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- PUBLISHING & SCHEDULING
-- ============================================================================

-- Create publishing_schedule table
CREATE TABLE IF NOT EXISTS publishing_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  blog_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  action VARCHAR(50) CHECK (action IN ('publish', 'unpublish', 'update')),
  scheduled_by VARCHAR(255),
  status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'published', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT one_of_page_or_blog CHECK (
    (page_id IS NOT NULL AND blog_id IS NULL) OR
    (page_id IS NULL AND blog_id IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS idx_publishing_schedule_scheduled_at ON publishing_schedule(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_publishing_schedule_status ON publishing_schedule(status);

-- ============================================================================
-- CONTENT DRAFTS & REVISIONS
-- ============================================================================

-- Create blog_post_revisions table
CREATE TABLE IF NOT EXISTS blog_post_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  revision_number INTEGER NOT NULL,
  title VARCHAR(255),
  content TEXT,
  featured_image_url TEXT,
  meta_title VARCHAR(255),
  meta_description TEXT,
  excerpt TEXT,
  status VARCHAR(50),
  created_by VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_post_revisions_blog_id ON blog_post_revisions(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_post_revisions_revision_number ON blog_post_revisions(blog_id, revision_number);

-- ============================================================================
-- AUTO-UPDATE TRIGGERS FOR NEW TABLES
-- ============================================================================

CREATE TRIGGER IF NOT EXISTS trigger_blog_categories_updated_at
BEFORE UPDATE ON blog_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER IF NOT EXISTS trigger_blog_authors_updated_at
BEFORE UPDATE ON blog_authors FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER IF NOT EXISTS trigger_blog_faqs_updated_at
BEFORE UPDATE ON blog_faqs FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER IF NOT EXISTS trigger_page_seo_metadata_updated_at
BEFORE UPDATE ON page_seo_metadata FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER IF NOT EXISTS trigger_page_seo_keywords_updated_at
BEFORE UPDATE ON page_seo_keywords FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER IF NOT EXISTS trigger_page_schema_updated_at
BEFORE UPDATE ON page_schema FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER IF NOT EXISTS trigger_blog_schema_updated_at
BEFORE UPDATE ON blog_schema FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER IF NOT EXISTS trigger_publishing_schedule_updated_at
BEFORE UPDATE ON publishing_schedule FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- SAMPLE DATA FOR TESTING
-- ============================================================================

-- Insert sample blog categories
INSERT INTO blog_categories (name, slug, description, sort_order) VALUES
  ('Fashion', 'fashion', 'Fashion-related content', 1),
  ('Bridal', 'bridal', 'Bridal wear and wedding fashion', 2),
  ('Trends', 'trends', 'Latest fashion trends', 3),
  ('Tips', 'tips', 'Fashion and styling tips', 4)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample blog authors
INSERT INTO blog_authors (name, email, role) VALUES
  ('Sarah Khan', 'sarah.khan@example.com', 'Fashion Editor'),
  ('Amira Ali', 'amira.ali@example.com', 'Content Writer'),
  ('Admin', 'admin@example.com', 'Administrator')
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

/*
NEW TABLES CREATED:
1. blog_categories - Blog post categories with auto-increment ordering
2. blog_authors - Blog authors with roles and metadata
3. blog_faqs - FAQ items specific to blog posts
4. page_seo_metadata - SEO analysis and metrics for pages
5. page_seo_keywords - Keyword tracking and density for pages
6. page_schema - JSON-LD schema markup for pages
7. blog_schema - JSON-LD schema markup for blog posts
8. publishing_schedule - Publishing schedule management
9. blog_post_revisions - Version history for blog posts

ENHANCED TABLES:
1. blog_posts - Added 13 new SEO and content fields
2. pages - Added 8 new SEO and visibility fields

KEY FEATURES:
- Advanced SEO tracking with keyword density and positions
- Structured data (JSON-LD) support for pages and blogs
- Publishing schedule for future content
- Blog post revisions and version history
- Multiple author support
- Visibility control (public/private)
- Comprehensive SEO score calculation
- Content metrics (word count, reading time, view count)
- Featured image metadata (alt text, title, caption)

USAGE:
- All new tables have auto-updated timestamps
- Cascade delete for referential integrity
- Comprehensive indexing for performance
- Sample categories and authors pre-inserted
*/
