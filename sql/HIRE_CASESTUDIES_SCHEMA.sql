-- Hire/Gigs Component Tables
CREATE TABLE IF NOT EXISTS component_hire (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  template VARCHAR(50) NOT NULL,
  heading VARCHAR(255),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page_id, template)
);

CREATE TABLE IF NOT EXISTS component_hire_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hire_id UUID NOT NULL REFERENCES component_hire(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  image_url TEXT,
  rating DECIMAL(3,1) DEFAULT 4.5,
  review_count INTEGER DEFAULT 0,
  price_label VARCHAR(100),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Case Studies Component Tables
CREATE TABLE IF NOT EXISTS component_casestudies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  template VARCHAR(50) NOT NULL,
  heading VARCHAR(255),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page_id, template)
);

CREATE TABLE IF NOT EXISTS component_casestudies_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  casestudies_id UUID NOT NULL REFERENCES component_casestudies(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  image_url TEXT NOT NULL,
  description TEXT,
  project_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_component_hire_page ON component_hire(page_id);
CREATE INDEX IF NOT EXISTS idx_component_hire_items_hire ON component_hire_items(hire_id);
CREATE INDEX IF NOT EXISTS idx_component_casestudies_page ON component_casestudies(page_id);
CREATE INDEX IF NOT EXISTS idx_component_casestudies_items_case ON component_casestudies_items(casestudies_id);
