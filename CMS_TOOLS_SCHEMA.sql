-- CMS Component Tables
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

-- Tools Component Tables
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

-- Disable RLS for now
ALTER TABLE component_cms DISABLE ROW LEVEL SECURITY;
ALTER TABLE component_cms_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE component_tools DISABLE ROW LEVEL SECURITY;
ALTER TABLE component_tools_items DISABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_component_cms_page_id ON component_cms(page_id);
CREATE INDEX idx_component_cms_items_cms_id ON component_cms_items(cms_id);
CREATE INDEX idx_component_tools_page_id ON component_tools(page_id);
CREATE INDEX idx_component_tools_items_tools_id ON component_tools_items(tools_id);
