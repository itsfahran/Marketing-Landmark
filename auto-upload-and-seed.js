import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env.local
dotenv.config({ path: path.join(__dirname, '.env.local') });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const BUCKET = 'portfolio-images';
const IMAGES_DIR = path.join(__dirname, 'src/assets');

const imagesToUpload = [
  // Team Images
  { file: 'hero.png', folder: 'team' },
  { file: 'osman.png', folder: 'team' },
  { file: 'fareed.png', folder: 'team' },
  { file: 'maria.png', folder: 'team' },
  { file: 'ayesha.png', folder: 'team' },
  // Platform Logos
  { file: 'upwork-logo.png', folder: 'logos' },
  { file: 'fiverr-logo.png', folder: 'logos' },
  { file: 'linkedin-logo.png', folder: 'logos' },
];

const uploadedUrls = {};

async function uploadAllImages() {
  console.log('🚀 Starting comprehensive image upload...\n');

  for (const img of imagesToUpload) {
    const filePath = path.join(IMAGES_DIR, img.file);
    const remotePath = `${img.folder}/${img.file}`;

    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  File not found: ${img.file}`);
      continue;
    }

    try {
      const fileData = fs.readFileSync(filePath);
      console.log(`📤 Uploading ${img.file}...`);

      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(remotePath, fileData, { cacheControl: '3600', upsert: true });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(remotePath);

      uploadedUrls[img.file] = publicUrlData.publicUrl;
      console.log(`✅ ${img.file}: OK\n`);
    } catch (error) {
      console.error(`❌ Error uploading ${img.file}:`, error.message);
    }
  }

  generateCompleteSeed();
}

function generateCompleteSeed() {
  console.log('\n' + '='.repeat(80));
  console.log('📋 GENERATED COMPLETE SEED SQL');
  console.log('='.repeat(80) + '\n');

  const sql = `-- ============================================
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
  '${uploadedUrls['hero.png']}'
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
  '${uploadedUrls['hero.png']}',
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
('I''ll Be Your Full Time SEO Manager, Manage Your Complete Project With My Team', '${uploadedUrls['upwork-logo.png']}', 4.8, 22, '$150', 0),
('I''ll Rank Your Site On Ai Engines With Generative Engine Optimization And Voice SEO', '${uploadedUrls['upwork-logo.png']}', 4.9, 26, '$50', 1),
('I''ll Be Your Linkedin Marketing Manager, Outreach Expert, Run Ads And Generate Leads', '${uploadedUrls['linkedin-logo.png']}', 5.0, 6, '$50', 2),
('I''ll Do Google Business Profile Optimization For Local SEO Ranking', '${uploadedUrls['fiverr-logo.png']}', 5.0, 10, '$30', 3),
('I''ll Do Complete Monthly SEO Of Your Website And Google Business Profile In One Order', '${uploadedUrls['fiverr-logo.png']}', 5.0, 10, '$200', 4),
('I''ll Do Monthly Wordpress SEO With Full On Page, Off Page, And Technical Optimization', '${uploadedUrls['upwork-logo.png']}', 5.0, 10, '$100', 5),
('I''ll Be Your Monthly Off Page SEO Expert, Create Manual High Authority Backlinks', '${uploadedUrls['upwork-logo.png']}', 5.0, 10, '$100', 6),
('I Will Do Advance Monthly Shopify Ecommerce SEO Optimization For Top Rankings On Google', '${uploadedUrls['fiverr-logo.png']}', 5.0, 10, '$150', 7);

-- 6. HOME TESTIMONIALS
DELETE FROM home_testimonials;
INSERT INTO home_testimonials (client_name, client_title, client_avatar_url, testimonial_text, rating, source_platform, sort_order) VALUES
('Johnson', 'Manager', '${uploadedUrls['hero.png']}', 'Farhan''s SEO services helped us rank #1 for our main keywords. Highly recommended!', 5, 'fiverr', 0),
('Sarah Johnson', 'Marketing Manager', '${uploadedUrls['osman.png']}', 'Professional, responsive, and results-driven. Our organic traffic increased by 300%.', 5, 'upwork', 1),
('Ahmed Ali', 'E-Commerce Owner', '${uploadedUrls['fareed.png']}', 'Best SEO expert I''ve worked with. ROI was amazing within 3 months.', 5, 'google', 2),
('Ali Khan', 'Business Owner', '${uploadedUrls['maria.png']}', 'Excellent service with outstanding results. Highly professional team.', 5, 'linkedin', 3),
('Fatima Ahmed', 'CEO', '${uploadedUrls['ayesha.png']}', 'One of the best decisions for our business. Transparent and results-focused.', 4.8, 'fiverr', 4);

-- 7. BRANDS (Home)
DELETE FROM brands;
INSERT INTO brands (name, logo_url, website_url, row_group, sort_order) VALUES
('Upwork', '${uploadedUrls['upwork-logo.png']}', 'https://upwork.com', 'top', 0),
('Fiverr', '${uploadedUrls['fiverr-logo.png']}', 'https://fiverr.com', 'top', 1),
('LinkedIn', '${uploadedUrls['linkedin-logo.png']}', 'https://linkedin.com', 'top', 2),
('Google', '${uploadedUrls['upwork-logo.png']}', 'https://google.com', 'bottom', 3),
('Facebook', '${uploadedUrls['fiverr-logo.png']}', 'https://facebook.com', 'bottom', 4);

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
('E-Commerce Store - 300% Traffic Growth', 'Increased organic traffic from 5K to 20K monthly visitors through comprehensive SEO optimization', 'E-Commerce', '${uploadedUrls['hero.png']}', NULL, 0, 'published'),
('B2B Company - Top 3 Rankings', 'Ranked in top 3 for 15+ high-value keywords, resulting in 150% increase in qualified leads', 'B2B', '${uploadedUrls['osman.png']}', NULL, 1, 'published'),
('Local Service Business - Local Domination', 'Dominated local search results in 5 cities with 95% increase in local enquiries', 'Local', '${uploadedUrls['fareed.png']}', NULL, 2, 'published'),
('SaaS Platform - Revenue Growth', 'Increased monthly recurring revenue by 200% through targeted SEO strategy', 'SaaS', '${uploadedUrls['maria.png']}', NULL, 3, 'published');

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
('About SEO Professional', 'About', 'Farhan Ali is an experienced and certified Professional SEO Expert in Pakistan with over 5 years of experience in SEO, with expertise in GEO, AEO, AI Search Engine Optimization, and Local SEO. I''ve worked with top global IT and digital marketing companies as an SEO Expert, as well as international clients, helping to rank websites on Google''s 1st page, completing 150+ projects focused on improving online visibility, organic traffic, and business growth.', '5+', 'Years Experience', '150+', 'Projects Completed', '1st', 'Page Ranking', 'Portfolio', '/portfolio', 'Services', '/#services', '${uploadedUrls['hero.png']}');

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
('Farhan Ali', 'Professional SEO Expert', '${uploadedUrls['hero.png']}', 0),
('Osman', 'Saas App Developer', '${uploadedUrls['osman.png']}', 1),
('Fareed Ahmed', 'Off-Page SEO Specialist', '${uploadedUrls['fareed.png']}', 2),
('Neha Naz', 'Support Assistant', '${uploadedUrls['maria.png']}', 3),
('Ayesha Zulfiqar', 'Web Developer', '${uploadedUrls['ayesha.png']}', 4),
('Maria', 'Content Writer', '${uploadedUrls['maria.png']}', 5);

-- 15. ABOUT PAGE ACHIEVEMENTS
DELETE FROM about_page_achievements;
INSERT INTO about_page_achievements (icon, value, label, sort_order) VALUES
('fi', 'Top Rated', 'Top Rated on Fiverr', 0),
('★', '4.9/5', '4.9/5 Overall Rating', 1),
('150+', '150+', '150+ Projects Complete', 2);
`;

  console.log(sql);

  // Save to file
  fs.writeFileSync(
    path.join(__dirname, 'AUTO_GENERATED_SEED.sql'),
    sql,
    'utf-8'
  );

  console.log('\n' + '='.repeat(80));
  console.log('✅ SEED SQL GENERATED & SAVED');
  console.log('='.repeat(80));
  console.log('\n📝 File: AUTO_GENERATED_SEED.sql');
  console.log('\n🚀 Next Steps:');
  console.log('1. Go to Supabase SQL Editor');
  console.log('2. Copy all content from AUTO_GENERATED_SEED.sql');
  console.log('3. Paste and Run in Supabase');
  console.log('4. Refresh home & about pages\n');
}

// Run everything
uploadAllImages().catch(console.error);
