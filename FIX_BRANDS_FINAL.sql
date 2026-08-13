-- ============================================
-- FINAL FIX FOR BRANDS TABLE
-- Add all missing columns and seed data
-- ============================================

-- Add missing columns to brands table
ALTER TABLE brands
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS row_group TEXT DEFAULT 'top';

-- Clear existing data
DELETE FROM brands;

-- Insert updated brands data with all columns
INSERT INTO brands (name, logo_url, website_url, row_group, sort_order) VALUES
('Upwork', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/logos/upwork-logo.png', 'https://upwork.com', 'top', 0),
('Fiverr', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/logos/fiverr-logo.png', 'https://fiverr.com', 'top', 1),
('LinkedIn', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/logos/linkedin-logo.png', 'https://linkedin.com', 'top', 2),
('Google', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/logos/upwork-logo.png', 'https://google.com', 'bottom', 3),
('Facebook', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/logos/fiverr-logo.png', 'https://facebook.com', 'bottom', 4);

-- Verify
SELECT * FROM brands ORDER BY sort_order;
