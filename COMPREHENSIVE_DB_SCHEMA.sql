-- ============================================================================
-- COMPREHENSIVE PAGE BUILDER DATABASE SCHEMA
-- With proper support for SEO, GEO, and LOCAL templates
-- ============================================================================

-- ============================================================================
-- MAIN PAGES TABLE
-- ============================================================================
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  description TEXT,
  components_config JSONB DEFAULT '[]'::jsonb,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- HERO COMPONENT - All Templates
-- ============================================================================
-- Supports: SEO, GEO, LOCAL
CREATE TABLE component_hero (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  template VARCHAR(50) NOT NULL DEFAULT 'SEO',

  -- Common fields
  heading TEXT,
  subheading TEXT,
  description TEXT,
  cta_text VARCHAR(100),
  cta_link VARCHAR(255),
  cta_secondary_text VARCHAR(100),
  cta_secondary_link VARCHAR(255),

  -- SEO specific
  seo_badge VARCHAR(100),
  seo_feature_1 VARCHAR(255),
  seo_feature_2 VARCHAR(255),
  seo_feature_3 VARCHAR(255),

  -- GEO specific
  geo_heading_accent VARCHAR(255),
  geo_feature_1 VARCHAR(255),
  geo_feature_2 VARCHAR(255),
  geo_feature_3 VARCHAR(255),
  geo_cta1_text VARCHAR(100),
  geo_cta1_link VARCHAR(255),
  geo_cta2_text VARCHAR(100),
  geo_cta2_link VARCHAR(255),

  -- LOCAL specific
  local_stat_1_value VARCHAR(50),
  local_stat_1_label VARCHAR(100),
  local_stat_2_value VARCHAR(50),
  local_stat_2_label VARCHAR(100),

  background_image_url TEXT,
  video_url TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- SCOPE/SERVICES COMPONENT - All Templates
-- ============================================================================
CREATE TABLE component_scope (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  template VARCHAR(50) NOT NULL DEFAULT 'SEO',

  heading TEXT,
  description TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Scope Cards (sub-items)
CREATE TABLE component_scope_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scope_id UUID REFERENCES component_scope(id) ON DELETE CASCADE,

  number VARCHAR(10),
  title VARCHAR(255),
  description TEXT,
  icon_name VARCHAR(100),
  icon_url TEXT,

  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- PRICING COMPONENT - All Templates
-- ============================================================================
CREATE TABLE component_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  template VARCHAR(50) NOT NULL DEFAULT 'SEO',

  heading TEXT,
  description TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Pricing Packages
CREATE TABLE component_pricing_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pricing_id UUID REFERENCES component_pricing(id) ON DELETE CASCADE,

  -- Common fields
  name VARCHAR(255),
  subtitle TEXT,
  price VARCHAR(50),
  currency VARCHAR(10) DEFAULT 'PKR',
  billing_period VARCHAR(50),
  description TEXT,
  is_popular BOOLEAN DEFAULT false,

  -- SEO/GEO specific
  pages VARCHAR(100), -- "Upto 10 Pages"
  locations VARCHAR(100), -- For LOCAL
  unit_label VARCHAR(100),

  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Pricing Features (items in package)
CREATE TABLE component_pricing_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID REFERENCES component_pricing_packages(id) ON DELETE CASCADE,

  feature_text TEXT,
  is_included BOOLEAN DEFAULT true,

  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- PROCESS COMPONENT - All Templates
-- ============================================================================
CREATE TABLE component_process (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  template VARCHAR(50) NOT NULL DEFAULT 'SEO',

  heading TEXT,
  description TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Process Steps
CREATE TABLE component_process_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  process_id UUID REFERENCES component_process(id) ON DELETE CASCADE,

  title VARCHAR(255),
  description TEXT,
  icon_name VARCHAR(100),
  icon_url TEXT,
  step_number INTEGER,

  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- FEATURES/BENEFITS COMPONENT - All Templates
-- ============================================================================
CREATE TABLE component_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  template VARCHAR(50) NOT NULL DEFAULT 'SEO',

  heading TEXT,
  description TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Feature Items
CREATE TABLE component_feature_items (
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

-- ============================================================================
-- TESTIMONIALS COMPONENT - All Templates (Shared)
-- ============================================================================
CREATE TABLE component_testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,

  heading TEXT,
  description TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Testimonial Items
CREATE TABLE component_testimonial_items (
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

-- ============================================================================
-- CTA COMPONENT - All Templates
-- ============================================================================
CREATE TABLE component_cta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  template VARCHAR(50) NOT NULL DEFAULT 'SEO',

  heading TEXT,
  description TEXT,
  button_text VARCHAR(100),
  button_link VARCHAR(255),
  background_image_url TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- CONTACT COMPONENT - All Templates
-- ============================================================================
CREATE TABLE component_contact (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  template VARCHAR(50) NOT NULL DEFAULT 'SEO',

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
CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_pages_status ON pages(status);
CREATE INDEX idx_component_hero_page ON component_hero(page_id);
CREATE INDEX idx_component_scope_page ON component_scope(page_id);
CREATE INDEX idx_component_pricing_page ON component_pricing(page_id);
CREATE INDEX idx_component_process_page ON component_process(page_id);
CREATE INDEX idx_component_features_page ON component_features(page_id);
CREATE INDEX idx_component_testimonials_page ON component_testimonials(page_id);
CREATE INDEX idx_component_cta_page ON component_cta(page_id);
CREATE INDEX idx_component_contact_page ON component_contact(page_id);

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Confirm schema created successfully
SELECT COUNT(*) as table_count FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
