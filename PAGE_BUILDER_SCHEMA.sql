-- ============================================================================
-- PAGE BUILDER SCHEMA
-- ============================================================================
-- Supports mixing components from 3 templates (SEO, GEO, Local)
-- Users can select different layout variants for each of 10 components

-- Create pages table (idempotent - safe to run multiple times)
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',

  -- Component layout configuration stored as JSONB
  -- Structure: { components: [{ id, name, layout, enabled, order }, ...] }
  layout_config JSONB DEFAULT '{}'::jsonb,

  -- SEO metadata
  meta_title VARCHAR(255),
  meta_description TEXT,
  meta_keywords TEXT,
  og_title VARCHAR(255),
  og_description TEXT,
  og_image_url TEXT,
  canonical_url TEXT,
  robots_directive VARCHAR(100) DEFAULT 'index,follow',

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_status ON pages(status);

-- Enable RLS
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- RLS Policies (drop existing first to avoid conflicts)
DROP POLICY IF EXISTS pages_public_read ON pages;
DROP POLICY IF EXISTS pages_admin_all ON pages;

-- Public can read published pages
CREATE POLICY pages_public_read ON pages
  FOR SELECT
  USING (status = 'published');

-- Authenticated users (admins) can do everything
CREATE POLICY pages_admin_all ON pages
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================================
-- COMPONENT DATA TABLES
-- ============================================================================
-- These tables store the actual content for each component type

-- Hero section data
CREATE TABLE IF NOT EXISTS page_hero (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,

  heading TEXT,
  subheading TEXT,
  description TEXT,
  badge_text VARCHAR(255),
  video_url TEXT,

  cta_primary_text VARCHAR(100),
  cta_primary_link VARCHAR(255),
  cta_secondary_text VARCHAR(100),
  cta_secondary_link VARCHAR(255),

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- About section data
CREATE TABLE IF NOT EXISTS page_about (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,

  heading TEXT,
  subheading TEXT,
  description TEXT,
  image_url TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Services/Scope section data
CREATE TABLE IF NOT EXISTS page_scope (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,

  heading TEXT,
  badge_text VARCHAR(255),
  description TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Scope cards
CREATE TABLE IF NOT EXISTS page_scope_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scope_id UUID REFERENCES page_scope(id) ON DELETE CASCADE,

  icon_name VARCHAR(100),
  title VARCHAR(255),
  description TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Pricing section data
CREATE TABLE IF NOT EXISTS page_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,

  heading TEXT,
  badge_text VARCHAR(255),
  description TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Pricing packages
CREATE TABLE IF NOT EXISTS page_pricing_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pricing_id UUID REFERENCES page_pricing(id) ON DELETE CASCADE,

  name VARCHAR(255),
  subtitle TEXT,
  price VARCHAR(50),
  currency VARCHAR(10) DEFAULT 'PKR',
  billing_period VARCHAR(50),
  unit_label VARCHAR(100),
  is_popular BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Pricing features
CREATE TABLE IF NOT EXISTS page_pricing_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID REFERENCES page_pricing_packages(id) ON DELETE CASCADE,

  feature_text TEXT,
  is_disabled BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Process section data
CREATE TABLE IF NOT EXISTS page_process (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,

  heading TEXT,
  badge_text VARCHAR(255),
  description TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Process steps
CREATE TABLE IF NOT EXISTS page_process_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  process_id UUID REFERENCES page_process(id) ON DELETE CASCADE,

  icon_name VARCHAR(100),
  title VARCHAR(255),
  description TEXT,
  sort_order INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Features section data
CREATE TABLE IF NOT EXISTS page_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,

  heading TEXT,
  badge_text VARCHAR(255),
  description TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Feature items
CREATE TABLE IF NOT EXISTS page_feature_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  features_id UUID REFERENCES page_features(id) ON DELETE CASCADE,

  icon_name VARCHAR(100),
  icon_url TEXT,
  title VARCHAR(255),
  description TEXT,
  sort_order INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Testimonials section data
CREATE TABLE IF NOT EXISTS page_testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,

  heading TEXT,
  badge_text VARCHAR(255),
  description TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Individual testimonials
CREATE TABLE IF NOT EXISTS page_testimonial_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  testimonials_id UUID REFERENCES page_testimonials(id) ON DELETE CASCADE,

  client_name VARCHAR(255),
  client_role VARCHAR(255),
  rating INTEGER,
  review_text TEXT,
  avatar_url TEXT,
  sort_order INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- CTA section data
CREATE TABLE IF NOT EXISTS page_cta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,

  heading TEXT,
  description TEXT,
  cta_text VARCHAR(100),
  cta_link VARCHAR(255),
  background_image_url TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Footer section data
CREATE TABLE IF NOT EXISTS page_footer (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,

  description TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Footer links
CREATE TABLE IF NOT EXISTS page_footer_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  footer_id UUID REFERENCES page_footer(id) ON DELETE CASCADE,

  column_title VARCHAR(100),
  link_text VARCHAR(255),
  link_url VARCHAR(255),
  sort_order INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all component tables
ALTER TABLE page_hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_about ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_scope ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_scope_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_pricing_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_pricing_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_process ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_process_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_feature_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_testimonial_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_cta ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_footer ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_footer_links ENABLE ROW LEVEL SECURITY;

-- Add default allow-all policies for component tables (for now)
-- These will be restricted as needed based on your security requirements
-- Policy names are table-specific to avoid conflicts

DROP POLICY IF EXISTS page_hero_read ON page_hero;
DROP POLICY IF EXISTS page_about_read ON page_about;
DROP POLICY IF EXISTS page_scope_read ON page_scope;
DROP POLICY IF EXISTS page_scope_cards_read ON page_scope_cards;
DROP POLICY IF EXISTS page_pricing_read ON page_pricing;
DROP POLICY IF EXISTS page_pricing_packages_read ON page_pricing_packages;
DROP POLICY IF EXISTS page_pricing_features_read ON page_pricing_features;
DROP POLICY IF EXISTS page_process_read ON page_process;
DROP POLICY IF EXISTS page_process_steps_read ON page_process_steps;
DROP POLICY IF EXISTS page_features_read ON page_features;
DROP POLICY IF EXISTS page_feature_items_read ON page_feature_items;
DROP POLICY IF EXISTS page_testimonials_read ON page_testimonials;
DROP POLICY IF EXISTS page_testimonial_items_read ON page_testimonial_items;
DROP POLICY IF EXISTS page_cta_read ON page_cta;
DROP POLICY IF EXISTS page_footer_read ON page_footer;
DROP POLICY IF EXISTS page_footer_links_read ON page_footer_links;

CREATE POLICY page_hero_read ON page_hero FOR SELECT USING (true);
CREATE POLICY page_about_read ON page_about FOR SELECT USING (true);
CREATE POLICY page_scope_read ON page_scope FOR SELECT USING (true);
CREATE POLICY page_scope_cards_read ON page_scope_cards FOR SELECT USING (true);
CREATE POLICY page_pricing_read ON page_pricing FOR SELECT USING (true);
CREATE POLICY page_pricing_packages_read ON page_pricing_packages FOR SELECT USING (true);
CREATE POLICY page_pricing_features_read ON page_pricing_features FOR SELECT USING (true);
CREATE POLICY page_process_read ON page_process FOR SELECT USING (true);
CREATE POLICY page_process_steps_read ON page_process_steps FOR SELECT USING (true);
CREATE POLICY page_features_read ON page_features FOR SELECT USING (true);
CREATE POLICY page_feature_items_read ON page_feature_items FOR SELECT USING (true);
CREATE POLICY page_testimonials_read ON page_testimonials FOR SELECT USING (true);
CREATE POLICY page_testimonial_items_read ON page_testimonial_items FOR SELECT USING (true);
CREATE POLICY page_cta_read ON page_cta FOR SELECT USING (true);
CREATE POLICY page_footer_read ON page_footer FOR SELECT USING (true);
CREATE POLICY page_footer_links_read ON page_footer_links FOR SELECT USING (true);

-- Grant permissions (adjust based on your auth setup)
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
