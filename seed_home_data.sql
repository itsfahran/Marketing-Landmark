-- ============================================
-- SEED DATA FOR HOME PAGE COMPONENTS
-- Run this in Supabase SQL Editor to populate existing data
-- ============================================

-- 1. HERO SECTION
INSERT INTO hero (heading, subheading, description, cta_text, cta_link, image_url) VALUES (
  'Professional SEO Expert In Pakistan',
  'Unlock AI-Driven Growth With Expert SEO, GEO, And Local SEO Services',
  'Farhan Ali is an Experienced and Certified Professional SEO Expert in Pakistan with specialized Expertise in GEO / AEO / AI Search Engine Optimization and Local SEO. Over the Past 5 Years, I''ve Completed 150+ Projects, Collaborating with Top Global IT & Digital Marketing Companies and International Clients.',
  'Get Started',
  '/contact',
  NULL
);

-- 2. SERVICES (Example services - adjust based on your actual services)
INSERT INTO services (name, description, icon_name, sort_order) VALUES
('SEO Optimization', 'Search Engine Optimization to rank higher on Google', 'FaSearch', 0),
('Local SEO', 'Local business optimization for Google Maps and local results', 'FaMapMarkerAlt', 1),
('GEO Ranking', 'Generative Engine Optimization for AI search results', 'FaBrain', 2),
('Web Development', 'Custom website development and design', 'FaCode', 3);

-- 3. ABOUT SECTION
INSERT INTO about (heading, description, image_url, years_experience, total_projects, satisfaction_rate) VALUES (
  'About Me',
  'I am a certified SEO expert with 5+ years of experience helping businesses rank higher and get more leads.',
  NULL,
  5,
  150,
  90
);

-- 4. HIRE ME GIGS (From your Hire component)
INSERT INTO hire_gigs (title, description, image_url, rating, reviews, price, sort_order) VALUES
('I''ll Be Your Full Time SEO Manager, Manage Your Complete Project With My Team', 'Full-time SEO management and project handling', 'gig1.png', 4.8, 22, '$150', 0),
('I''ll Rank Your Site On Ai Engines With Generative Engine Optimization And Voice SEO', 'AI engine ranking and voice search optimization', 'gig2.png', 4.9, 26, '$50', 1),
('I''ll Be Your Linkedin Marketing Manager, Outreach Expert, Run Ads And Generate Leads', 'LinkedIn marketing and lead generation', 'gig3.png', 5.0, 6, '$50', 2),
('I''ll Do Google Business Profile Optimization For Local SEO Ranking', 'Google Business Profile optimization', 'gig4.png', 5.0, 10, '$30', 3),
('I''ll Do Complete Monthly SEO Of Your Website And Google Business Profile In One Order', 'Complete monthly SEO package', 'gig5.png', 5.0, 10, '$200', 4),
('I''ll Do Monthly Wordpress SEO With Full On Page, Off Page, And Technical Optimization', 'WordPress SEO optimization', 'gig6.png', 5.0, 10, '$100', 5),
('I''ll Be Your Monthly Off Page SEO Expert, Create Manual High Authority Backlinks', 'Off-page SEO and backlink building', 'gig7.png', 5.0, 10, '$100', 6),
('I Will Do Advance Monthly Shopify Ecommerce SEO Optimization For Top Rankings On Google', 'Shopify eCommerce SEO', 'gig8.png', 5.0, 10, '$150', 7);

-- 5. PROCESS STEPS
INSERT INTO process_steps (step_number, title, description, icon_name, sort_order) VALUES
(1, 'Keyword Research', 'In-depth keyword research and competitor analysis', 'FaSearch', 0),
(2, 'On-Page Optimization', 'Optimize your website content and structure', 'FaFileAlt', 1),
(3, 'Link Building', 'Build high-quality backlinks from authority sites', 'FaLink', 2),
(4, 'Tracking & Reporting', 'Monthly reports and progress tracking', 'FaChartLine', 3);

-- 6. TESTIMONIALS
INSERT INTO testimonials (client_name, client_title, client_image, testimonial_text, rating, sort_order) VALUES
('John Smith', 'CEO at Tech Company', 'client1.jpg', 'Farhan''s SEO services helped us rank #1 for our main keywords. Highly recommended!', 5, 0),
('Sarah Johnson', 'Marketing Manager', 'client2.jpg', 'Professional, responsive, and results-driven. Our organic traffic increased by 300%.', 5, 1),
('Ahmed Ali', 'E-Commerce Owner', 'client3.jpg', 'Best SEO expert I''ve worked with. ROI was amazing within 3 months.', 5, 2);

-- 7. BRANDS/CLIENTS (Add your client logos)
INSERT INTO brands (name, logo_url, link_url, sort_order) VALUES
('Tech Startup Inc', 'brand1.png', NULL, 0),
('Digital Agency Pro', 'brand2.png', NULL, 1),
('E-Commerce Store', 'brand3.png', NULL, 2),
('SaaS Company', 'brand4.png', NULL, 3);

-- 8. CHOOSE FEATURES (Why Choose Me)
INSERT INTO choose_features (title, description, icon_name, sort_order) VALUES
('10+ Years Experience', 'Proven track record with 10+ years in digital marketing', 'FaAward', 0),
('150+ Successful Projects', 'Delivered results for 150+ satisfied clients worldwide', 'FaCheckCircle', 1),
('Certified Expert', 'Google Certified and continuously updated with latest SEO trends', 'FaCertificate', 2),
('24/7 Support', 'Round-the-clock support and quick response time', 'FaHeadset', 3),
('Transparent Reporting', 'Monthly reports with detailed analytics and insights', 'FaChartBar', 4),
('Custom Strategy', 'Tailored SEO strategies based on your business goals', 'FaUserTie', 5);

-- 9. PORTFOLIO ITEMS (Add your portfolio projects)
INSERT INTO portfolio_items (title, description, category, image_url, link_url, sort_order) VALUES
('E-Commerce Store - 300% Traffic Growth', 'Increased organic traffic from 5K to 20K monthly visitors', 'E-Commerce', 'project1.jpg', NULL, 0),
('B2B Company - Top 3 Rankings', 'Ranked in top 3 for 15+ high-value keywords', 'B2B', 'project2.jpg', NULL, 1),
('Local Service Business - Local Domination', 'Dominated local search results in 5 cities', 'Local', 'project3.jpg', NULL, 2);

-- 10. CONTACT SECTION
INSERT INTO contact (heading, description, email, phone, address, cta_text, cta_link) VALUES (
  'Get In Touch',
  'Ready to rank higher? Contact me today for a free consultation.',
  'farhan@example.com',
  '+92-300-1234567',
  'Karachi, Pakistan',
  'Send Message',
  '/contact'
);

-- ============================================
-- VERIFY DATA WAS INSERTED
-- Run these queries to check the data
-- ============================================
-- SELECT * FROM hero;
-- SELECT * FROM services ORDER BY sort_order;
-- SELECT * FROM hire_gigs ORDER BY sort_order;
-- SELECT * FROM process_steps ORDER BY sort_order;
-- SELECT * FROM testimonials ORDER BY sort_order;
-- SELECT * FROM brands ORDER BY sort_order;
-- SELECT * FROM choose_features ORDER BY sort_order;
-- SELECT * FROM portfolio_items ORDER BY sort_order;
-- SELECT * FROM contact;
