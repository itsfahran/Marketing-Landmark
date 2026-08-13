-- Simple Page Builder Migration
-- Run this in Supabase SQL Editor

-- Create pages table with layout_config
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  layout_config JSONB DEFAULT '{}'::jsonb,
  meta_title VARCHAR(255),
  meta_description TEXT,
  og_title VARCHAR(255),
  og_description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index on slug for faster queries
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_status ON pages(status);

-- Enable RLS
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist
DROP POLICY IF EXISTS pages_public_read ON pages;
DROP POLICY IF EXISTS pages_admin_all ON pages;

-- Create new policies
CREATE POLICY pages_public_read ON pages
  FOR SELECT
  USING (status = 'published');

CREATE POLICY pages_admin_all ON pages
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Grant permissions
GRANT ALL ON pages TO authenticated;
GRANT ALL ON pages TO service_role;
GRANT SELECT ON pages TO anon;

-- Done!
