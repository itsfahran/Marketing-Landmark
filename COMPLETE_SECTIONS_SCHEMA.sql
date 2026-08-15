-- ===== CMS COMPONENT =====
CREATE TABLE IF NOT EXISTS component_cms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  template text NOT NULL,
  heading text,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS component_cms_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cms_id uuid NOT NULL REFERENCES component_cms(id) ON DELETE CASCADE,
  title text NOT NULL,
  icon_url text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ===== TOOLS COMPONENT =====
CREATE TABLE IF NOT EXISTS component_tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  template text NOT NULL,
  heading text,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS component_tools_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tools_id uuid NOT NULL REFERENCES component_tools(id) ON DELETE CASCADE,
  title text NOT NULL,
  icon_url text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ===== HIRE/GIGS COMPONENT =====
CREATE TABLE IF NOT EXISTS component_hire (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  template text NOT NULL,
  heading text,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS component_hire_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hire_id uuid NOT NULL REFERENCES component_hire(id) ON DELETE CASCADE,
  title text NOT NULL,
  image_url text,
  rating numeric(3,1),
  review_count integer,
  price_label text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ===== CASE STUDIES COMPONENT =====
CREATE TABLE IF NOT EXISTS component_casestudies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  template text NOT NULL,
  heading text,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS component_casestudies_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  casestudies_id uuid NOT NULL REFERENCES component_casestudies(id) ON DELETE CASCADE,
  title text NOT NULL,
  category text,
  image_url text,
  description text,
  project_url text,
  is_featured boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ===== DISABLE RLS =====
ALTER TABLE component_cms DISABLE ROW LEVEL SECURITY;
ALTER TABLE component_cms_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE component_tools DISABLE ROW LEVEL SECURITY;
ALTER TABLE component_tools_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE component_hire DISABLE ROW LEVEL SECURITY;
ALTER TABLE component_hire_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE component_casestudies DISABLE ROW LEVEL SECURITY;
ALTER TABLE component_casestudies_items DISABLE ROW LEVEL SECURITY;

-- ===== INDEXES =====
CREATE INDEX idx_component_cms_page_id ON component_cms(page_id);
CREATE INDEX idx_component_cms_items_cms_id ON component_cms_items(cms_id);
CREATE INDEX idx_component_tools_page_id ON component_tools(page_id);
CREATE INDEX idx_component_tools_items_tools_id ON component_tools_items(tools_id);
CREATE INDEX idx_component_hire_page_id ON component_hire(page_id);
CREATE INDEX idx_component_hire_items_hire_id ON component_hire_items(hire_id);
CREATE INDEX idx_component_casestudies_page_id ON component_casestudies(page_id);
CREATE INDEX idx_component_casestudies_items_casestudies_id ON component_casestudies_items(casestudies_id);
