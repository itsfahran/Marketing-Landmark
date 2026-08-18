-- ============================================================================
-- ADD MISSING COLUMNS TO EXISTING blog_posts TABLE
-- ============================================================================

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
ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public',
ADD COLUMN IF NOT EXISTS scheduled_publish_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS word_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS reading_time_minutes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS seo_score INTEGER DEFAULT 0;

-- ============================================================================
-- ADD MISSING COLUMNS TO EXISTING pages TABLE
-- ============================================================================

ALTER TABLE pages
ADD COLUMN IF NOT EXISTS focus_keyword VARCHAR(100),
ADD COLUMN IF NOT EXISTS og_type VARCHAR(50) DEFAULT 'website',
ADD COLUMN IF NOT EXISTS twitter_card VARCHAR(50) DEFAULT 'summary_large_image',
ADD COLUMN IF NOT EXISTS twitter_creator VARCHAR(100),
ADD COLUMN IF NOT EXISTS seo_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS parent_page_id UUID REFERENCES pages(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public',
ADD COLUMN IF NOT EXISTS scheduled_publish_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS show_in_navbar BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS show_in_footer BOOLEAN DEFAULT false;

-- ============================================================================
-- CREATE blog_categories TABLE
-- ============================================================================
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

-- ============================================================================
-- CREATE blog_authors TABLE
-- ============================================================================
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

-- ============================================================================
-- CREATE blog_faqs TABLE
-- ============================================================================
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
-- CREATE blog_schema TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS blog_schema (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id UUID NOT NULL UNIQUE REFERENCES blog_posts(id) ON DELETE CASCADE,
  schema_type VARCHAR(100) NOT NULL DEFAULT 'BlogPosting',
  schema_data JSONB NOT NULL,
  is_auto_generated BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_schema_blog_id ON blog_schema(blog_id);

-- ============================================================================
-- CREATE blog_post_revisions TABLE
-- ============================================================================
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

-- ============================================================================
-- CREATE page_seo_metadata TABLE
-- ============================================================================
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
  keywords_in_title BOOLEAN DEFAULT false,
  keywords_in_description BOOLEAN DEFAULT false,
  keywords_in_h1 BOOLEAN DEFAULT false,
  last_seo_check TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_page_seo_metadata_page_id ON page_seo_metadata(page_id);

-- ============================================================================
-- CREATE page_seo_keywords TABLE
-- ============================================================================
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

-- ============================================================================
-- CREATE page_schema TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS page_schema (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL UNIQUE REFERENCES pages(id) ON DELETE CASCADE,
  schema_type VARCHAR(100) NOT NULL,
  schema_data JSONB NOT NULL,
  is_auto_generated BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_page_schema_page_id ON page_schema(page_id);

-- ============================================================================
-- CREATE publishing_schedule TABLE
-- ============================================================================
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
-- CREATE TRIGGERS FOR AUTO-UPDATE TIMESTAMPS
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_blog_categories_updated_at ON blog_categories;
CREATE TRIGGER trigger_blog_categories_updated_at
BEFORE UPDATE ON blog_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trigger_blog_authors_updated_at ON blog_authors;
CREATE TRIGGER trigger_blog_authors_updated_at
BEFORE UPDATE ON blog_authors FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trigger_blog_faqs_updated_at ON blog_faqs;
CREATE TRIGGER trigger_blog_faqs_updated_at
BEFORE UPDATE ON blog_faqs FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trigger_blog_schema_updated_at ON blog_schema;
CREATE TRIGGER trigger_blog_schema_updated_at
BEFORE UPDATE ON blog_schema FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trigger_page_seo_metadata_updated_at ON page_seo_metadata;
CREATE TRIGGER trigger_page_seo_metadata_updated_at
BEFORE UPDATE ON page_seo_metadata FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trigger_page_seo_keywords_updated_at ON page_seo_keywords;
CREATE TRIGGER trigger_page_seo_keywords_updated_at
BEFORE UPDATE ON page_seo_keywords FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trigger_page_schema_updated_at ON page_schema;
CREATE TRIGGER trigger_page_schema_updated_at
BEFORE UPDATE ON page_schema FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trigger_publishing_schedule_updated_at ON publishing_schedule;
CREATE TRIGGER trigger_publishing_schedule_updated_at
BEFORE UPDATE ON publishing_schedule FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- INSERT SAMPLE DATA
-- ============================================================================

INSERT INTO blog_categories (name, slug, description, icon_name, color, sort_order) VALUES
('Fashion', 'fashion', 'Fashion-related content', 'FaShirt', '#FF6B6B', 1),
('Bridal', 'bridal', 'Bridal wear and wedding fashion', 'FaDress', '#FF69B4', 2),
('Trends', 'trends', 'Latest fashion trends', 'FaStar', '#FFD700', 3),
('Tips & Guides', 'tips-guides', 'Fashion and styling tips', 'FaBook', '#4169E1', 4),
('DIY', 'diy', 'Do-it-yourself fashion projects', 'FaHammer', '#FF8C00', 5)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO blog_authors (name, email, avatar_url, role, bio, is_active) VALUES
('Sarah Khan', 'sarah.khan@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', 'Fashion Editor', 'Fashion expert with 10+ years experience in Pakistani fashion industry', true),
('Amira Ali', 'amira.ali@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amira', 'Content Writer', 'Passionate about fashion storytelling and trend analysis', true),
('Admin', 'admin@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin', 'Administrator', 'Content administrator and moderator', true)
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- SETUP COMPLETE!
-- ============================================================================
