-- ============================================
-- COMPLETE SEED DATA - HOME & ABOUT PAGES
-- Generated automatically with Supabase image URLs
-- ============================================

-- ============================================
-- HOME PAGE DATA
-- ============================================

-- 1. HERO SECTION (Home)
DELETE FROM hero;
INSERT INTO hero (heading, subheading, description, cta_text, cta_link, image_url) VALUES (
  'Professional SEO Expert In Pakistan',
  'Unlock AI-Driven Growth With Expert SEO, GEO, And Local SEO Services',
  'Farhan Ali is an Experienced and Certified Professional SEO Expert in Pakistan with specialized Expertise in GEO / AEO / AI Search Engine Optimization and Local SEO. Over the Past 5 Years, I''ve Completed 150+ Projects, Collaborating with Top Global IT & Digital Marketing Companies and International Clients.',
  'Get Started',
  '/contact',
  'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/team/hero.png'
);

-- 2. SERVICES (Home)
DELETE FROM services;
INSERT INTO services (name, description, icon_name, sort_order) VALUES
('SEO Optimization', 'Search Engine Optimization to rank higher on Google', 'FaSearch', 0),
('Local SEO', 'Local business optimization for Google Maps and local results', 'FaMapMarkerAlt', 1),
('GEO Ranking', 'Generative Engine Optimization for AI search results', 'FaBrain', 2),
('Web Development', 'Custom website development and design', 'FaCode', 3),
('Content Marketing', 'Strategic content creation and optimization', 'FaPen', 4),
('Link Building', 'High-quality backlink acquisition and management', 'FaLink', 5);

-- 3. ABOUT SECTION (Home)
DELETE FROM about;
INSERT INTO about (heading, description, image_url, years_experience, total_projects, satisfaction_rate) VALUES (
  'About Me',
  'I am a certified SEO expert with 5+ years of experience helping businesses rank higher and get more leads.',
  'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/team/hero.png',
  5,
  150,
  90
);

-- 4. PROCESS STEPS (Home)
DELETE FROM process_steps;
INSERT INTO process_steps (title, description, icon_name, sort_order) VALUES
('Keyword Research', 'In-depth keyword research and competitor analysis', 'FaSearch', 0),
('On-Page Optimization', 'Optimize your website content and structure', 'FaFileAlt', 1),
('Link Building', 'Build high-quality backlinks from authority sites', 'FaLink', 2),
('Tracking & Reporting', 'Monthly reports and progress tracking', 'FaChartLine', 3);

-- 5. HIRE GIGS (Home)
DELETE FROM hire_gigs;
INSERT INTO hire_gigs (title, image_url, rating, reviews, price, sort_order) VALUES
('I''ll Be Your Full Time SEO Manager, Manage Your Complete Project With My Team', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/logos/upwork-logo.png', 4.8, 22, '$150', 0),
('I''ll Rank Your Site On Ai Engines With Generative Engine Optimization And Voice SEO', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/logos/upwork-logo.png', 4.9, 26, '$50', 1),
('I''ll Be Your Linkedin Marketing Manager, Outreach Expert, Run Ads And Generate Leads', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/logos/linkedin-logo.png', 5.0, 6, '$50', 2),
('I''ll Do Google Business Profile Optimization For Local SEO Ranking', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/logos/fiverr-logo.png', 5.0, 10, '$30', 3),
('I''ll Do Complete Monthly SEO Of Your Website And Google Business Profile In One Order', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/logos/fiverr-logo.png', 5.0, 10, '$200', 4),
('I''ll Do Monthly Wordpress SEO With Full On Page, Off Page, And Technical Optimization', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/logos/upwork-logo.png', 5.0, 10, '$100', 5),
('I''ll Be Your Monthly Off Page SEO Expert, Create Manual High Authority Backlinks', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/logos/upwork-logo.png', 5.0, 10, '$100', 6),
('I Will Do Advance Monthly Shopify Ecommerce SEO Optimization For Top Rankings On Google', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/logos/fiverr-logo.png', 5.0, 10, '$150', 7);

-- 6. HOME TESTIMONIALS
DELETE FROM home_testimonials;
INSERT INTO home_testimonials (client_name, client_title, client_avatar_url, testimonial_text, rating, source_platform, sort_order) VALUES
('Johnson', 'Manager', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/team/hero.png', 'Farhan''s SEO services helped us rank #1 for our main keywords. Highly recommended!', 5, 'fiverr', 0),
('Sarah Johnson', 'Marketing Manager', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/team/osman.png', 'Professional, responsive, and results-driven. Our organic traffic increased by 300%.', 5, 'upwork', 1),
('Ahmed Ali', 'E-Commerce Owner', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/team/fareed.png', 'Best SEO expert I''ve worked with. ROI was amazing within 3 months.', 5, 'google', 2),
('Ali Khan', 'Business Owner', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/team/maria.png', 'Excellent service with outstanding results. Highly professional team.', 5, 'linkedin', 3),
('Fatima Ahmed', 'CEO', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/team/ayesha.png', 'One of the best decisions for our business. Transparent and results-focused.', 4.8, 'fiverr', 4);

-- 7. BRANDS (Home)
DELETE FROM brands;
INSERT INTO brands (name, logo_url, website_url, row_group, sort_order) VALUES
('Upwork', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/logos/upwork-logo.png', 'https://upwork.com', 'top', 0),
('Fiverr', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/logos/fiverr-logo.png', 'https://fiverr.com', 'top', 1),
('LinkedIn', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/logos/linkedin-logo.png', 'https://linkedin.com', 'top', 2),
('Google', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/logos/upwork-logo.png', 'https://google.com', 'bottom', 3),
('Facebook', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/logos/fiverr-logo.png', 'https://facebook.com', 'bottom', 4);

-- 8. CHOOSE FEATURES (Why Choose Me - Home)
DELETE FROM choose_features;
INSERT INTO choose_features (title, description, icon_name, sort_order) VALUES
('10+ Years Experience', 'Proven track record with 10+ years in digital marketing', 'FaAward', 0),
('150+ Successful Projects', 'Delivered results for 150+ satisfied clients worldwide', 'FaCheckCircle', 1),
('Certified Expert', 'Google Certified and continuously updated with latest SEO trends', 'FaCertificate', 2),
('24/7 Support', 'Round-the-clock support and quick response time', 'FaHeadset', 3),
('Transparent Reporting', 'Monthly reports with detailed analytics and insights', 'FaChartBar', 4),
('Custom Strategy', 'Tailored SEO strategies based on your business goals', 'FaUserTie', 5);

-- 9. HOME PORTFOLIO ITEMS
DELETE FROM home_portfolio_items;
INSERT INTO home_portfolio_items (title, description, category, image_url, project_url, sort_order, status) VALUES
('E-Commerce Store - 300% Traffic Growth', 'Increased organic traffic from 5K to 20K monthly visitors through comprehensive SEO optimization', 'E-Commerce', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/team/hero.png', NULL, 0, 'published'),
('B2B Company - Top 3 Rankings', 'Ranked in top 3 for 15+ high-value keywords, resulting in 150% increase in qualified leads', 'B2B', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/team/osman.png', NULL, 1, 'published'),
('Local Service Business - Local Domination', 'Dominated local search results in 5 cities with 95% increase in local enquiries', 'Local', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/team/fareed.png', NULL, 2, 'published'),
('SaaS Platform - Revenue Growth', 'Increased monthly recurring revenue by 200% through targeted SEO strategy', 'SaaS', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/team/maria.png', NULL, 3, 'published');

-- 10. CONTACT SECTION (Home)
DELETE FROM contact_section;
INSERT INTO contact_section (heading, description, phone, email, address, whatsapp_number, cta_text) VALUES (
  'Get In Touch',
  'Ready to rank higher? Contact me today for a free consultation. I''m available 24/7 to discuss your SEO needs.',
  '+92-300-1234567',
  'farhan@example.com',
  'Karachi, Pakistan',
  '+923001234567',
  'Send Message'
);

-- ============================================
-- ABOUT PAGE DATA
-- ============================================

-- 11. ABOUT PAGE HERO
DELETE FROM about_page_hero;
INSERT INTO about_page_hero (badge, heading, description, stat_1_value, stat_1_label, stat_2_value, stat_2_label, stat_3_value, stat_3_label, button_1_text, button_1_link, button_2_text, button_2_link, image_url) VALUES
('About SEO Professional', 'About', 'Farhan Ali is an experienced and certified Professional SEO Expert in Pakistan with over 5 years of experience in SEO, with expertise in GEO, AEO, AI Search Engine Optimization, and Local SEO. I''ve worked with top global IT and digital marketing companies as an SEO Expert, as well as international clients, helping to rank websites on Google''s 1st page, completing 150+ projects focused on improving online visibility, organic traffic, and business growth.', '5+', 'Years Experience', '150+', 'Projects Completed', '1st', 'Page Ranking', 'Portfolio', '/portfolio', 'Services', '/#services', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/team/hero.png');

-- 12. ABOUT PAGE MARQUEE
DELETE FROM about_page_marquee;
INSERT INTO about_page_marquee (text, sort_order) VALUES
('Professional SEO Expert', 0),
('Local SEO Services', 1),
('Generative AI Search Engine Optimization', 2),
('Google Ranking Expert', 3),
('AI SEO Optimization', 4);

-- 13. ABOUT PAGE MISSION/VISION/VALUES
DELETE FROM about_page_mission_values;
INSERT INTO about_page_mission_values (type, icon_url, title, description, sort_order) VALUES
('mission', 'https://cdn-icons-png.flaticon.com/512/1828/1828911.png', 'Our Mission', 'Provide transparent and result-driven services to help businesses grow online, improve visibility, and achieve measurable success.', 0),
('vision', 'https://cdn-icons-png.flaticon.com/512/3135/3135706.png', 'Our Vision', 'Help businesses achieve digital growth, generate sales, and build strong brand value through proven SEO, GEO, Local SEO, and Digital Marketing strategies.', 1),
('values', 'https://cdn-icons-png.flaticon.com/512/3588/3588614.png', 'Our Values', 'We value transparency, integrity, and client success, delivering high-quality, innovative solutions that drive measurable results and long-term digital growth.', 2);

-- 14. ABOUT PAGE TEAM
DELETE FROM about_page_team;
INSERT INTO about_page_team (name, role, image_url, sort_order) VALUES
('Farhan Ali', 'Professional SEO Expert', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/team/hero.png', 0),
('Osman', 'Saas App Developer', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/team/osman.png', 1),
('Fareed Ahmed', 'Off-Page SEO Specialist', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/team/fareed.png', 2),
('Neha Naz', 'Support Assistant', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/team/maria.png', 3),
('Ayesha Zulfiqar', 'Web Developer', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/team/ayesha.png', 4),
('Maria', 'Content Writer', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/team/maria.png', 5);

-- 15. ABOUT PAGE ACHIEVEMENTS
DELETE FROM about_page_achievements;
INSERT INTO about_page_achievements (icon, value, label, sort_order) VALUES
('fi', 'Top Rated', 'Top Rated on Fiverr', 0),
('★', '4.9/5', '4.9/5 Overall Rating', 1),
('150+', '150+', '150+ Projects Complete', 2);
