-- ============================================
-- PORTFOLIO PAGE TABLES & SEED DATA
-- Create tables and populate portfolio data
-- ============================================

-- 1. PORTFOLIO PAGE HERO TABLE
CREATE TABLE IF NOT EXISTS portfolio_page_hero (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  breadcrumb_label TEXT DEFAULT 'Portfolio',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PORTFOLIO CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS portfolio_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. PORTFOLIO PROJECTS TABLE
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  description TEXT,
  results_link TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SEED DATA
-- ============================================

-- 1. PORTFOLIO PAGE HERO
DELETE FROM portfolio_page_hero;
INSERT INTO portfolio_page_hero (title, breadcrumb_label) VALUES
('Portfolio', 'Portfolio');

-- 2. PORTFOLIO CATEGORIES
DELETE FROM portfolio_categories;
INSERT INTO portfolio_categories (name, sort_order) VALUES
('Search Engine Optimization', 0),
('Generative Engine Optimization', 1),
('Web Development', 2),
('Graphic Design', 3);

-- 3. PORTFOLIO PROJECTS
DELETE FROM portfolio_projects;
INSERT INTO portfolio_projects (title, category, image_url, description, results_link, sort_order) VALUES
(
  'New E-Commerce Store 3-Month SEO Growth From Scratch',
  'Search Engine Optimization',
  'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/team/hero.png',
  'Within just 3 months, We achieved 117K impressions and 1.75K organic clicks for this new e-Commerce store, Our approach helped the store establish a strong foundation for long-term organic success.',
  '/portfolio',
  0
),
(
  '30 Days Shopify Store SEO Result I Received 134 Organic Orders',
  'Search Engine Optimization',
  'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/team/osman.png',
  'By using advanced keyword research, on-page SEO, technical optimization, and high-quality backlinks, We successfully increased sales and positioned this Shopify perfume store for long-term organic growth.',
  '/portfolio',
  1
),
(
  'GEO / Ai Search Optimization For Small Business Coach',
  'Generative Engine Optimization',
  'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/team/fareed.png',
  'Through latest GEO techniques, AI search optimization, and content enhancement, we achieved higher ranking results within just 1 month across multiple AI search engines for Small Business Coach.',
  '/portfolio',
  2
),
(
  'E-Commerce Website Development & Optimization',
  'Web Development',
  'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/team/maria.png',
  'Built a fully responsive e-commerce website with advanced SEO optimization, resulting in 40% increase in online sales within 6 months.',
  '/portfolio',
  3
),
(
  'Brand Identity & Logo Design',
  'Graphic Design',
  'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/team/ayesha.png',
  'Created comprehensive brand identity including logo, color palette, and brand guidelines for a growing digital marketing agency.',
  '/portfolio',
  4
);

-- ============================================
-- VERIFY DATA
-- ============================================
-- SELECT COUNT(*) as hero_count FROM portfolio_page_hero;
-- SELECT COUNT(*) as categories_count FROM portfolio_categories;
-- SELECT COUNT(*) as projects_count FROM portfolio_projects;
