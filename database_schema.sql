-- ============================================
-- HOME PAGE COMPONENTS DATABASE SCHEMA
-- ============================================

-- 1. HERO SECTION
CREATE TABLE hero (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  heading TEXT NOT NULL,
  subheading TEXT,
  description TEXT,
  cta_text TEXT,
  cta_link TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. SERVICES
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icon_name TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. PROCESS STEPS
CREATE TABLE process_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  step_number INT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon_name TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. ABOUT SECTION
CREATE TABLE about (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  heading TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  years_experience INT,
  total_projects INT,
  satisfaction_rate INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. HIRE ME GIGS (Cards)
CREATE TABLE hire_gigs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  rating DECIMAL(2,1) NOT NULL,
  reviews INT NOT NULL DEFAULT 0,
  price TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 6. PORTFOLIO ITEMS
CREATE TABLE portfolio_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 7. TESTIMONIALS
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  client_title TEXT,
  client_image TEXT,
  testimonial_text TEXT NOT NULL,
  rating INT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 8. BRANDS
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  link_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 9. WHY CHOOSE ME (Features)
CREATE TABLE choose_features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  icon_name TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 10. CONTACT SECTION
CREATE TABLE contact (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  heading TEXT NOT NULL,
  description TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  cta_text TEXT,
  cta_link TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- ADD THESE TO SUPABASE
-- Go to Supabase SQL Editor and run above
-- ============================================
