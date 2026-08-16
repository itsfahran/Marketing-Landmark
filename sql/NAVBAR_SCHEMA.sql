-- Navbar Menu Items Table
CREATE TABLE IF NOT EXISTS navbar_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label VARCHAR(100) NOT NULL,
  url VARCHAR(255) NOT NULL,
  icon VARCHAR(50),
  icon_url TEXT,
  order_position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  open_in_new_tab BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_navbar_items_order ON navbar_items(order_position);

-- Sample navbar items
INSERT INTO navbar_items (label, url, icon, order_position, is_active)
VALUES
  ('Home', '/', '🏠', 0, true),
  ('Services', '/services', '💼', 1, true),
  ('Portfolio', '/portfolio', '🎨', 2, true),
  ('About', '/about', '👤', 3, true),
  ('Blog', '/blog', '📝', 4, true),
  ('Contact', '/contact', '📧', 5, true)
ON CONFLICT DO NOTHING;
