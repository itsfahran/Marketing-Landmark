-- ============================================================================
-- SERVICES MANAGEMENT SCHEMA
-- ============================================================================

-- Templates table (SEO, GEO, Local)
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE, -- 'seo', 'geo', 'local'
  label VARCHAR(100) NOT NULL, -- 'SEO', 'GEO', 'Local SEO'
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Services table (instances of templates)
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL, -- 'Professional SEO Service', 'Enterprise GEO Package', etc.
  slug VARCHAR(255) NOT NULL UNIQUE, -- URL slug: 'professional-seo', 'enterprise-geo'
  description TEXT,
  meta_title VARCHAR(255),
  meta_description TEXT,
  status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'published'
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_services_template_id ON services(template_id);
CREATE INDEX idx_services_slug ON services(slug);
CREATE INDEX idx_services_status ON services(status);

-- Template-specific sections (which components each template uses)
CREATE TABLE IF NOT EXISTS template_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  section_name VARCHAR(100) NOT NULL, -- 'hero', 'pricing', 'process', 'scope', 'platforms', etc.
  display_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_template_sections_template_id ON template_sections(template_id);

-- Pricing packages for services (inherits from template but customizable per service)
CREATE TABLE IF NOT EXISTS service_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL, -- 'Basic', 'Standard', 'Premium'
  subtitle VARCHAR(255),
  price VARCHAR(50),
  currency VARCHAR(10) DEFAULT 'PKR',
  billing_period VARCHAR(50) DEFAULT 'Month',
  is_popular BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_service_pricing_service_id ON service_pricing(service_id);

-- Pricing features for each package
CREATE TABLE IF NOT EXISTS service_pricing_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID NOT NULL REFERENCES service_pricing(id) ON DELETE CASCADE,
  feature_text TEXT NOT NULL,
  is_disabled BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_service_pricing_features_package_id ON service_pricing_features(package_id);

-- Process/Steps for services
CREATE TABLE IF NOT EXISTS service_process_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon_name VARCHAR(100),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_service_process_steps_service_id ON service_process_steps(service_id);

-- Tools/Platforms used by service (for SEO and GEO templates)
CREATE TABLE IF NOT EXISTS service_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  icon_name VARCHAR(100),
  icon_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_service_tools_service_id ON service_tools(service_id);

-- Scope/Overview cards (for GEO and Local templates)
CREATE TABLE IF NOT EXISTS service_scope_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_service_scope_cards_service_id ON service_scope_cards(service_id);

-- FAQs specific to service
CREATE TABLE IF NOT EXISTS service_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_service_faqs_service_id ON service_faqs(service_id);

-- ============================================================================
-- SEED INITIAL TEMPLATES
-- ============================================================================

INSERT INTO templates (name, label, description) VALUES
('seo', 'SEO', 'Search Engine Optimization - Rank higher on Google'),
('geo', 'GEO', 'Generative Engine Optimization - AI Search Visibility'),
('local', 'Local', 'Local SEO - Dominate Local Search Results')
ON CONFLICT DO NOTHING;

-- SEO Template Sections
INSERT INTO template_sections (template_id, section_name, display_order)
SELECT id, 'hero', 1 FROM templates WHERE name = 'seo'
UNION ALL
SELECT id, 'pricing', 2 FROM templates WHERE name = 'seo'
UNION ALL
SELECT id, 'process', 3 FROM templates WHERE name = 'seo'
UNION ALL
SELECT id, 'tools', 4 FROM templates WHERE name = 'seo'
UNION ALL
SELECT id, 'case_studies', 5 FROM templates WHERE name = 'seo'
UNION ALL
SELECT id, 'testimonials', 6 FROM templates WHERE name = 'seo'
UNION ALL
SELECT id, 'faqs', 7 FROM templates WHERE name = 'seo'
UNION ALL
SELECT id, 'hire', 8 FROM templates WHERE name = 'seo'
UNION ALL
SELECT id, 'choose', 9 FROM templates WHERE name = 'seo'
UNION ALL
SELECT id, 'contact', 10 FROM templates WHERE name = 'seo'
ON CONFLICT DO NOTHING;

-- GEO Template Sections
INSERT INTO template_sections (template_id, section_name, display_order)
SELECT id, 'hero', 1 FROM templates WHERE name = 'geo'
UNION ALL
SELECT id, 'scope', 2 FROM templates WHERE name = 'geo'
UNION ALL
SELECT id, 'pricing', 3 FROM templates WHERE name = 'geo'
UNION ALL
SELECT id, 'process', 4 FROM templates WHERE name = 'geo'
UNION ALL
SELECT id, 'platforms', 5 FROM templates WHERE name = 'geo'
UNION ALL
SELECT id, 'hire', 6 FROM templates WHERE name = 'geo'
UNION ALL
SELECT id, 'testimonials', 7 FROM templates WHERE name = 'geo'
UNION ALL
SELECT id, 'choose', 8 FROM templates WHERE name = 'geo'
UNION ALL
SELECT id, 'contact', 9 FROM templates WHERE name = 'geo'
ON CONFLICT DO NOTHING;

-- Local Template Sections
INSERT INTO template_sections (template_id, section_name, display_order)
SELECT id, 'hero', 1 FROM templates WHERE name = 'local'
UNION ALL
SELECT id, 'scope', 2 FROM templates WHERE name = 'local'
UNION ALL
SELECT id, 'pricing', 3 FROM templates WHERE name = 'local'
UNION ALL
SELECT id, 'testimonials', 4 FROM templates WHERE name = 'local'
UNION ALL
SELECT id, 'choose', 5 FROM templates WHERE name = 'local'
UNION ALL
SELECT id, 'faqs', 6 FROM templates WHERE name = 'local'
UNION ALL
SELECT id, 'contact', 7 FROM templates WHERE name = 'local'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_pricing_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_process_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_scope_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_faqs ENABLE ROW LEVEL SECURITY;

-- Public read for published services
CREATE POLICY "templates_public_read" ON templates FOR SELECT USING (true);
CREATE POLICY "services_public_read" ON services FOR SELECT USING (status = 'published');
CREATE POLICY "template_sections_public_read" ON template_sections FOR SELECT USING (true);
CREATE POLICY "service_pricing_public_read" ON service_pricing FOR SELECT USING (true);
CREATE POLICY "service_pricing_features_public_read" ON service_pricing_features FOR SELECT USING (true);
CREATE POLICY "service_process_steps_public_read" ON service_process_steps FOR SELECT USING (true);
CREATE POLICY "service_tools_public_read" ON service_tools FOR SELECT USING (true);
CREATE POLICY "service_scope_cards_public_read" ON service_scope_cards FOR SELECT USING (true);
CREATE POLICY "service_faqs_public_read" ON service_faqs FOR SELECT USING (true);

-- Admin full access
CREATE POLICY "services_admin_all" ON services FOR ALL USING (true);
CREATE POLICY "service_pricing_admin_all" ON service_pricing FOR ALL USING (true);
CREATE POLICY "service_pricing_features_admin_all" ON service_pricing_features FOR ALL USING (true);
CREATE POLICY "service_process_steps_admin_all" ON service_process_steps FOR ALL USING (true);
CREATE POLICY "service_tools_admin_all" ON service_tools FOR ALL USING (true);
CREATE POLICY "service_scope_cards_admin_all" ON service_scope_cards FOR ALL USING (true);
CREATE POLICY "service_faqs_admin_all" ON service_faqs FOR ALL USING (true);
