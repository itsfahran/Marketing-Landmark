-- Seed testimonials into the correct table
DELETE FROM testimonials;

INSERT INTO testimonials (client_name, client_title, client_image, testimonial_text, rating, sort_order)
VALUES
('Johnson', 'Manager', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/team/hero.png', 'Farhan''s SEO services helped us rank #1 for our main keywords. Highly recommended!', 5, 0),
('Sarah Johnson', 'Marketing Manager', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/team/osman.png', 'Professional, responsive, and results-driven. Our organic traffic increased by 300%.', 5, 1),
('Ahmed Ali', 'E-Commerce Owner', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/team/fareed.png', 'Best SEO expert I''ve worked with. ROI was amazing within 3 months.', 5, 2),
('Ali Khan', 'Business Owner', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/team/maria.png', 'Excellent service with outstanding results. Highly professional team.', 5, 3),
('Fatima Ahmed', 'CEO', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/team/ayesha.png', 'One of the best decisions for our business. Transparent and results-focused.', 5, 4);
