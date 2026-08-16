-- Services Management Table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  icon_url TEXT,
  page_url VARCHAR(255),
  show_on_homepage BOOLEAN DEFAULT true,
  show_in_navbar BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for filtering
CREATE INDEX IF NOT EXISTS idx_services_homepage ON services(show_on_homepage, is_active);
CREATE INDEX IF NOT EXISTS idx_services_navbar ON services(show_in_navbar, is_active);
CREATE INDEX IF NOT EXISTS idx_services_order ON services(sort_order);

-- Sample services (3 existing services)
INSERT INTO services (title, description, icon, page_url, show_on_homepage, show_in_navbar, is_active, sort_order)
VALUES
  ('SEO Services', 'Search Engine Optimization for your business', '🔍', '/seo', true, true, true, 0),
  ('GEO Services', 'Geographic targeting and local optimization', '🌍', '/geo', true, true, true, 1),
  ('Local SEO', 'Local search optimization and business listing management', '📍', '/local', true, true, true, 2)
ON CONFLICT DO NOTHING;
