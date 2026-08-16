-- Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name VARCHAR(255) NOT NULL,
  client_role VARCHAR(255),
  client_image TEXT,
  client_avatar_url TEXT,
  testimonial_text TEXT NOT NULL,
  review_text TEXT,
  rating INTEGER DEFAULT 5,
  source_platform VARCHAR(50) DEFAULT 'other',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for sorting
CREATE INDEX IF NOT EXISTS idx_testimonials_sort ON testimonials(sort_order);

-- Sample data (optional - comment out if you want to add manually)
INSERT INTO testimonials (client_name, client_role, testimonial_text, rating, source_platform, sort_order)
VALUES
  ('Ali Khan', 'Business Owner', 'Excellent service with outstanding results. Highly professional team.', 5, 'upwork', 0),
  ('Fatima Ahmed', 'CEO', 'One of the best decisions for our business. Transparent and results-focused.', 5, 'fiverr', 1),
  ('Johnson', 'Manager', 'Farhan''s SEO services helped us rank #1 for our main keywords. Highly recommended!', 5, 'google', 2),
  ('Sarah Johnson', 'Marketing Manager', 'Professional, responsive, and results-driven. Our organic traffic increased by 300%.', 5, 'linkedin', 3),
  ('Ahmed Ali', 'E-Commerce Owner', 'Best SEO expert I''ve worked with. ROI was amazing within 3 months.', 5, 'other', 4)
ON CONFLICT DO NOTHING;
