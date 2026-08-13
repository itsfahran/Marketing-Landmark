-- ============================================
-- REBUILD BRANDS TABLE FROM SCRATCH
-- Drop and recreate with proper schema
-- ============================================

-- Drop the old brands table
DROP TABLE IF EXISTS brands CASCADE;

-- Create new brands table with correct schema
CREATE TABLE brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  row_group TEXT DEFAULT 'top',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert brands data
INSERT INTO brands (name, logo_url, website_url, row_group, sort_order) VALUES
('Upwork', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/logos/upwork-logo.png', 'https://upwork.com', 'top', 0),
('Fiverr', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/logos/fiverr-logo.png', 'https://fiverr.com', 'top', 1),
('LinkedIn', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/logos/linkedin-logo.png', 'https://linkedin.com', 'top', 2),
('Google', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/logos/upwork-logo.png', 'https://google.com', 'bottom', 3),
('Facebook', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/logos/fiverr-logo.png', 'https://facebook.com', 'bottom', 4);

-- Verify data was inserted
SELECT COUNT(*) as total_brands FROM brands;
SELECT * FROM brands ORDER BY sort_order;
