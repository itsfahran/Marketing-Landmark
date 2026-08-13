-- Initialize Supabase schema for full CMS + SSR + Admin Panel

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- Core Page Management
-- ============================================================================

CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  template_type TEXT NOT NULL CHECK (template_type IN ('home', 'seo', 'geo', 'local', 'static', 'blog_index')),
  status TEXT NOT NULL CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
  meta_title VARCHAR(255),
  meta_description TEXT,
  meta_keywords TEXT,
  og_title VARCHAR(255),
  og_description TEXT,
  og_image_url TEXT,
  canonical_url TEXT,
  schema_types TEXT[] DEFAULT ARRAY[]::TEXT[],
  robots_directive VARCHAR(50) DEFAULT 'index,follow',
  show_in_navbar BOOLEAN DEFAULT false,
  show_in_footer BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_pages_status ON pages(status);
CREATE INDEX idx_pages_template_type ON pages(template_type);

-- ============================================================================
-- Page Content Sections
-- ============================================================================

CREATE TABLE page_hero (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  heading TEXT,
  subheading TEXT,
  description TEXT,
  marquee_text TEXT,
  cta_primary_text VARCHAR(100),
  cta_primary_link VARCHAR(255),
  cta_secondary_text VARCHAR(100),
  cta_secondary_link VARCHAR(255),
  show_contact_form BOOLEAN DEFAULT false,
  video_embed_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(page_id)
);

CREATE TABLE page_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  value VARCHAR(100) NOT NULL,
  suffix VARCHAR(10),
  label VARCHAR(100),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_page_stats_page_id ON page_stats(page_id);

-- ============================================================================
-- Pricing & Features
-- ============================================================================

CREATE TABLE pricing_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  subtitle VARCHAR(255),
  price VARCHAR(50),
  currency VARCHAR(10) DEFAULT 'PKR',
  billing_period VARCHAR(50) DEFAULT 'Month',
  unit_label VARCHAR(100),
  is_popular BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_pricing_packages_page_id ON pricing_packages(page_id);

CREATE TABLE pricing_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID NOT NULL REFERENCES pricing_packages(id) ON DELETE CASCADE,
  feature_text TEXT NOT NULL,
  is_disabled BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_pricing_features_package_id ON pricing_features(package_id);

-- ============================================================================
-- Process & Tools
-- ============================================================================

CREATE TABLE process_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  icon_name VARCHAR(100),
  title VARCHAR(100),
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_process_steps_page_id ON process_steps(page_id);

CREATE TABLE tool_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('cms', 'tool', 'platform')),
  title VARCHAR(100),
  icon_name VARCHAR(100),
  icon_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_tool_items_page_id ON tool_items(page_id);
CREATE INDEX idx_tool_items_category ON tool_items(category);

-- ============================================================================
-- Scope Cards
-- ============================================================================

CREATE TABLE page_scope_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  number VARCHAR(10),
  title VARCHAR(100),
  description TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_page_scope_cards_page_id ON page_scope_cards(page_id);

-- ============================================================================
-- Global Reusable Content
-- ============================================================================

CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name VARCHAR(100),
  client_role VARCHAR(100),
  client_avatar_url TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  source_platform TEXT CHECK (source_platform IN ('fiverr', 'upwork', 'linkedin', 'google')),
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_testimonials_is_featured ON testimonials(is_featured);

CREATE TABLE video_testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_url TEXT NOT NULL,
  profile_image_url TEXT,
  title VARCHAR(255),
  subtitle VARCHAR(255),
  caption TEXT,
  link TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE choose_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon_name VARCHAR(100),
  title VARCHAR(100),
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_faqs_page_id ON faqs(page_id);

CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100),
  logo_url TEXT NOT NULL,
  website_url TEXT,
  row_group TEXT CHECK (row_group IN ('top', 'bottom')),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- Portfolio & Blog
-- ============================================================================

CREATE TABLE portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  image_url TEXT,
  description TEXT,
  project_url TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_case_study BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_portfolio_items_status ON portfolio_items(status);
CREATE INDEX idx_portfolio_items_category ON portfolio_items(category);

CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT,
  content TEXT,
  featured_image_url TEXT,
  author_name VARCHAR(100),
  category VARCHAR(100),
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  meta_title VARCHAR(255),
  meta_description TEXT,
  og_image_url TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'scheduled')) DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at);

-- ============================================================================
-- About Page Content
-- ============================================================================

CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100),
  role VARCHAR(100),
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon_name VARCHAR(100),
  icon_url TEXT,
  value_label VARCHAR(50),
  title VARCHAR(100),
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE mission_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon_url TEXT,
  title VARCHAR(100),
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- Fiverr/Hire Section
-- ============================================================================

CREATE TABLE gigs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT,
  title VARCHAR(255),
  rating VARCHAR(10),
  review_count VARCHAR(50),
  price_label VARCHAR(100),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- Contact & Forms
-- ============================================================================

CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  service_interested VARCHAR(255),
  budget_range VARCHAR(100),
  message TEXT,
  source_page_slug VARCHAR(255),
  status TEXT NOT NULL CHECK (status IN ('new', 'contacted', 'closed')) DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX idx_contact_submissions_email ON contact_submissions(email);

CREATE TABLE service_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label VARCHAR(100) NOT NULL,
  form_context TEXT NOT NULL CHECK (form_context IN ('primary', 'secondary')),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- Navigation & Footer
-- ============================================================================

CREATE TABLE navbar_menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label VARCHAR(100) NOT NULL,
  url VARCHAR(255) NOT NULL,
  parent_id UUID REFERENCES navbar_menu_items(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  open_in_new_tab BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE footer_columns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  heading VARCHAR(100),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE footer_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  column_id UUID NOT NULL REFERENCES footer_columns(id) ON DELETE CASCADE,
  label VARCHAR(100),
  url VARCHAR(255),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_footer_links_column_id ON footer_links(column_id);

-- ============================================================================
-- Admin & Site Config
-- ============================================================================

CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_title VARCHAR(255),
  default_meta_description TEXT,
  default_og_image_url TEXT,
  logo_url TEXT,
  favicon_url TEXT,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  contact_address TEXT,
  social_links JSONB DEFAULT '{}'::jsonb,
  google_analytics_id VARCHAR(50),
  google_tag_manager_id VARCHAR(50),
  google_search_console_verification VARCHAR(255),
  robots_txt_extra_rules TEXT,
  llms_txt_content TEXT,
  header_scripts TEXT,
  footer_scripts TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE redirects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_path VARCHAR(255) UNIQUE NOT NULL,
  to_path VARCHAR(255) NOT NULL,
  status_code INTEGER DEFAULT 301 CHECK (status_code IN (301, 302)),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE media_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_url TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  uploaded_by VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- Auth Profiles
-- ============================================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(255),
  role TEXT NOT NULL CHECK (role IN ('admin', 'editor')) DEFAULT 'editor',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- Auto-update Triggers for updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_pages_updated_at BEFORE UPDATE ON pages FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_page_hero_updated_at BEFORE UPDATE ON page_hero FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_page_stats_updated_at BEFORE UPDATE ON page_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_pricing_packages_updated_at BEFORE UPDATE ON pricing_packages FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_pricing_features_updated_at BEFORE UPDATE ON pricing_features FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_process_steps_updated_at BEFORE UPDATE ON process_steps FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_tool_items_updated_at BEFORE UPDATE ON tool_items FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_page_scope_cards_updated_at BEFORE UPDATE ON page_scope_cards FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_video_testimonials_updated_at BEFORE UPDATE ON video_testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_choose_features_updated_at BEFORE UPDATE ON choose_features FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_faqs_updated_at BEFORE UPDATE ON faqs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_brands_updated_at BEFORE UPDATE ON brands FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_portfolio_items_updated_at BEFORE UPDATE ON portfolio_items FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_team_members_updated_at BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_achievements_updated_at BEFORE UPDATE ON achievements FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_mission_cards_updated_at BEFORE UPDATE ON mission_cards FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_gigs_updated_at BEFORE UPDATE ON gigs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_contact_submissions_updated_at BEFORE UPDATE ON contact_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_service_options_updated_at BEFORE UPDATE ON service_options FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_navbar_menu_items_updated_at BEFORE UPDATE ON navbar_menu_items FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_footer_columns_updated_at BEFORE UPDATE ON footer_columns FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_footer_links_updated_at BEFORE UPDATE ON footer_links FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_redirects_updated_at BEFORE UPDATE ON redirects FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
