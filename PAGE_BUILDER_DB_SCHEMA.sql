-- ============================================================================
-- PAGE BUILDER DATABASE SCHEMA
-- Supports mixing components from 3 templates (SEO, GEO, LOCAL)
-- ============================================================================

-- Main Pages Table
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  description TEXT,

  -- Store component configuration as JSON
  components_config JSONB DEFAULT '[]'::jsonb,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- COMPONENT DATA TABLES
-- ============================================================================

-- HERO Component
CREATE TABLE IF NOT EXISTS component_hero (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,

  -- Hero specific fields
  heading TEXT,
  subheading TEXT,
  description TEXT,
  cta_text VARCHAR(100),
  cta_link VARCHAR(255),
  background_image_url TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ABOUT Component
CREATE TABLE IF NOT EXISTS component_about (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,

  heading TEXT,
  description TEXT,
  image_url TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- SERVICES/SCOPE Component
CREATE TABLE IF NOT EXISTS component_scope (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,

  heading TEXT,
  description TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Scope Cards (items under scope)
CREATE TABLE IF NOT EXISTS component_scope_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scope_id UUID REFERENCES component_scope(id) ON DELETE CASCADE,

  number VARCHAR(10),
  title VARCHAR(255),
  description TEXT,
  icon_name VARCHAR(100),

  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- PRICING Component
CREATE TABLE IF NOT EXISTS component_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,

  heading TEXT,
  description TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Pricing Packages
CREATE TABLE IF NOT EXISTS component_pricing_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pricing_id UUID REFERENCES component_pricing(id) ON DELETE CASCADE,

  name VARCHAR(255),
  price VARCHAR(50),
  currency VARCHAR(10) DEFAULT 'PKR',
  billing_period VARCHAR(50),
  description TEXT,
  is_popular BOOLEAN DEFAULT false,

  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Pricing Features
CREATE TABLE IF NOT EXISTS component_pricing_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID REFERENCES component_pricing_packages(id) ON DELETE CASCADE,

  feature_text TEXT,
  is_included BOOLEAN DEFAULT true,

  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- PROCESS Component
CREATE TABLE IF NOT EXISTS component_process (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,

  heading TEXT,
  description TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Process Steps
CREATE TABLE IF NOT EXISTS component_process_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  process_id UUID REFERENCES component_process(id) ON DELETE CASCADE,

  title VARCHAR(255),
  description TEXT,
  icon_name VARCHAR(100),

  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- FEATURES/BENEFITS Component
CREATE TABLE IF NOT EXISTS component_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,

  heading TEXT,
  description TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Feature Items
CREATE TABLE IF NOT EXISTS component_feature_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  features_id UUID REFERENCES component_features(id) ON DELETE CASCADE,

  title VARCHAR(255),
  description TEXT,
  icon_name VARCHAR(100),
  icon_url TEXT,

  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- TESTIMONIALS Component
CREATE TABLE IF NOT EXISTS component_testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,

  heading TEXT,
  description TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Testimonial Items
CREATE TABLE IF NOT EXISTS component_testimonial_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  testimonials_id UUID REFERENCES component_testimonials(id) ON DELETE CASCADE,

  client_name VARCHAR(255),
  client_role VARCHAR(255),
  client_image_url TEXT,
  review_text TEXT,
  rating INTEGER DEFAULT 5,

  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- CTA Component
CREATE TABLE IF NOT EXISTS component_cta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,

  heading TEXT,
  description TEXT,
  button_text VARCHAR(100),
  button_link VARCHAR(255),
  background_image_url TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- CONTACT Component
CREATE TABLE IF NOT EXISTS component_contact (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,

  heading TEXT,
  description TEXT,
  email VARCHAR(255),
  phone VARCHAR(20),

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_status ON pages(status);
CREATE INDEX IF NOT EXISTS idx_component_hero_page ON component_hero(page_id);
CREATE INDEX IF NOT EXISTS idx_component_about_page ON component_about(page_id);
CREATE INDEX IF NOT EXISTS idx_component_scope_page ON component_scope(page_id);
CREATE INDEX IF NOT EXISTS idx_component_pricing_page ON component_pricing(page_id);
CREATE INDEX IF NOT EXISTS idx_component_process_page ON component_process(page_id);
CREATE INDEX IF NOT EXISTS idx_component_features_page ON component_features(page_id);
CREATE INDEX IF NOT EXISTS idx_component_testimonials_page ON component_testimonials(page_id);
CREATE INDEX IF NOT EXISTS idx_component_cta_page ON component_cta(page_id);
CREATE INDEX IF NOT EXISTS idx_component_contact_page ON component_contact(page_id);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE component_hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE component_about ENABLE ROW LEVEL SECURITY;
ALTER TABLE component_scope ENABLE ROW LEVEL SECURITY;
ALTER TABLE component_scope_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE component_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE component_pricing_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE component_pricing_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE component_process ENABLE ROW LEVEL SECURITY;
ALTER TABLE component_process_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE component_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE component_feature_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE component_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE component_testimonial_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE component_cta ENABLE ROW LEVEL SECURITY;
ALTER TABLE component_contact ENABLE ROW LEVEL SECURITY;

-- Drop old policies if exist
DROP POLICY IF EXISTS pages_public_read ON pages;
DROP POLICY IF EXISTS pages_auth_all ON pages;

-- Allow public to read published pages
CREATE POLICY pages_public_read ON pages
  FOR SELECT
  USING (status = 'published');

-- Allow authenticated users to do everything
CREATE POLICY pages_auth_all ON pages
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Component tables - allow all for authenticated
CREATE POLICY component_read ON component_hero FOR SELECT USING (true);
CREATE POLICY component_read_about ON component_about FOR SELECT USING (true);
CREATE POLICY component_read_scope ON component_scope FOR SELECT USING (true);
CREATE POLICY component_read_scope_cards ON component_scope_cards FOR SELECT USING (true);
CREATE POLICY component_read_pricing ON component_pricing FOR SELECT USING (true);
CREATE POLICY component_read_pricing_packages ON component_pricing_packages FOR SELECT USING (true);
CREATE POLICY component_read_pricing_features ON component_pricing_features FOR SELECT USING (true);
CREATE POLICY component_read_process ON component_process FOR SELECT USING (true);
CREATE POLICY component_read_process_steps ON component_process_steps FOR SELECT USING (true);
CREATE POLICY component_read_features ON component_features FOR SELECT USING (true);
CREATE POLICY component_read_feature_items ON component_feature_items FOR SELECT USING (true);
CREATE POLICY component_read_testimonials ON component_testimonials FOR SELECT USING (true);
CREATE POLICY component_read_testimonial_items ON component_testimonial_items FOR SELECT USING (true);
CREATE POLICY component_read_cta ON component_cta FOR SELECT USING (true);
CREATE POLICY component_read_contact ON component_contact FOR SELECT USING (true);

-- Grants
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
