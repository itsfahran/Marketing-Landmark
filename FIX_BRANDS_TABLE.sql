-- ============================================
-- FIX BRANDS TABLE SCHEMA
-- Add missing row_group column
-- ============================================

-- Add row_group column if it doesn't exist
ALTER TABLE brands
ADD COLUMN IF NOT EXISTS row_group TEXT DEFAULT 'top';

-- Update existing brands data
UPDATE brands SET row_group = 'top' WHERE sort_order < 3;
UPDATE brands SET row_group = 'bottom' WHERE sort_order >= 3;

-- Recreate brands with proper Supabase URLs
DELETE FROM brands;

INSERT INTO brands (name, logo_url, website_url, row_group, sort_order) VALUES
('Upwork', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/logos/upwork-logo.png', 'https://upwork.com', 'top', 0),
('Fiverr', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/logos/fiverr-logo.png', 'https://fiverr.com', 'top', 1),
('LinkedIn', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/logos/linkedin-logo.png', 'https://linkedin.com', 'top', 2),
('Google', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/logos/upwork-logo.png', 'https://google.com', 'bottom', 3),
('Facebook', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/logos/fiverr-logo.png', 'https://facebook.com', 'bottom', 4);

-- Verify data
SELECT * FROM brands ORDER BY sort_order;
