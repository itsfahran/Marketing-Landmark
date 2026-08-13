/**
 * Seed script: Migrate hardcoded content to Supabase
 * Run with: npm run seed (loads .env.local automatically)
 *
 * This script captures the exact hardcoded data from the current JSX and inserts it into Supabase
 * so the public site renders identically once the SSR layer is wired up.
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Load .env.local from project root
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../../.env.local');
dotenv.config({ path: envPath });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars are required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  try {
    console.log('🌱 Starting seed...');

    // ========================================================================
    // SITE SETTINGS (single row with all global config)
    // ========================================================================

    await supabase.from('site_settings').insert({
      site_title: 'Marketing Landmark - SEO & Digital Marketing Agency',
      default_meta_description: 'Professional SEO expert in Pakistan. Get top-rated SEO services for your business.',
      default_og_image_url: null,
      logo_url: 'https://via.placeholder.com/200x50?text=Logo',
      favicon_url: '/favicon.svg',
      contact_email: 'contact@seoprofessional.pk',
      contact_phone: '+92 327 2462207',
      contact_address: 'Pakistan',
      social_links: {
        email: 'contact@seoprofessional.pk',
        whatsapp: '+923272462207',
        linkedin: 'https://www.linkedin.com/in/farhanali/',
        facebook: 'https://www.facebook.com/seofarhan',
        upwork: 'https://www.upwork.com/',
        fiverr: 'https://www.fiverr.com/',
      },
      google_analytics_id: 'G-XXXXXXXX',
      google_tag_manager_id: 'GTM-XXXXXXXX',
      google_search_console_verification: 'google-site-verification:...',
      robots_txt_extra_rules: '',
      llms_txt_content: `# SEO & Digital Marketing Services

## Overview
Professional SEO, GEO, and Local SEO services for businesses in Pakistan.

## Services Offered
- Search Engine Optimization (SEO)
- Generative Engine Optimization (GEO)
- Local SEO & AEO
- Web Development
- Graphic Design

## Contact
Email: contact@seoprofessional.pk
WhatsApp: +92 327 2462207`,
      header_scripts: '',
      footer_scripts: '',
    });

    console.log('✅ Site settings created');

    // ========================================================================
    // PAGES (create slugs for all main routes)
    // ========================================================================

    const pagesData = [
      {
        slug: '',
        title: 'Home',
        template_type: 'home',
        status: 'published',
        meta_title: 'Professional SEO Expert In Pakistan',
        meta_description: 'Top-rated SEO expert in Pakistan. Get proven results with our professional SEO services.',
        show_in_navbar: false,
        show_in_footer: false,
      },
      {
        slug: 'seo',
        title: 'Search Engine Optimization',
        template_type: 'seo',
        status: 'published',
        meta_title: 'SEO Services In Pakistan | Professional SEO Expert',
        meta_description: 'Affordable SEO services in Pakistan. On-page, off-page, and technical SEO for higher rankings.',
        show_in_navbar: true,
        show_in_footer: true,
      },
      {
        slug: 'geo',
        title: 'Generative Engine Optimization',
        template_type: 'geo',
        status: 'published',
        meta_title: 'GEO Services | Generative Engine Optimization',
        meta_description: 'Generative Engine Optimization services. Get visibility on AI search platforms.',
        show_in_navbar: true,
        show_in_footer: true,
      },
      {
        slug: 'local',
        title: 'Local SEO Services',
        template_type: 'local',
        status: 'published',
        meta_title: 'Local SEO Services In Pakistan | Local Business Ranking',
        meta_description: 'Local SEO services to improve your local business rankings on Google.',
        show_in_navbar: true,
        show_in_footer: true,
      },
      {
        slug: 'about',
        title: 'About Us',
        template_type: 'static',
        status: 'published',
        meta_title: 'About Us | Marketing Landmark',
        meta_description: 'Learn about our team and our mission to help businesses grow online.',
        show_in_navbar: true,
        show_in_footer: true,
      },
      {
        slug: 'portfolio',
        title: 'Portfolio',
        template_type: 'static',
        status: 'published',
        meta_title: 'Our Work | Portfolio & Case Studies',
        meta_description: 'View our successful SEO projects and case studies.',
        show_in_navbar: true,
        show_in_footer: true,
      },
      {
        slug: 'contact',
        title: 'Contact Us',
        template_type: 'static',
        status: 'published',
        meta_title: 'Contact Us | Get Free SEO Consultation',
        meta_description: 'Contact us for a free SEO consultation and quote.',
        show_in_navbar: true,
        show_in_footer: true,
      },
      {
        slug: 'blog',
        title: 'Blog',
        template_type: 'blog_index',
        status: 'published',
        meta_title: 'Blog | SEO Tips & Digital Marketing Insights',
        meta_description: 'Read our latest blog posts about SEO, digital marketing, and business growth.',
        show_in_navbar: true,
        show_in_footer: true,
      },
    ];

    const insertedPages = {};
    for (const page of pagesData) {
      const { data, error } = await supabase
        .from('pages')
        .insert(page)
        .select('id, slug');

      if (error) {
        console.error(`Error creating page ${page.slug}:`, error);
      } else {
        insertedPages[page.slug] = data[0].id;
        console.log(`✅ Page created: ${page.slug || '(home)'}`);
      }
    }

    // ========================================================================
    // PAGE_HERO — hero content for each template page
    // ========================================================================

    const heroData = [
      {
        page_id: insertedPages['seo'],
        heading: 'Professional SEO Expert In Pakistan',
        subheading: 'Farhan Ali',
        description: 'I am an experienced and certified professional SEO expert with 5+ years of expertise in on-page SEO, off-page SEO, and technical SEO.',
        marquee_text: 'Professional SEO Expert In Pakistan • Farhan Ali • Professional SEO Expert In Pakistan • Farhan Ali',
        cta_primary_text: 'Get Free SEO Audit',
        cta_primary_link: '/contact',
        cta_secondary_text: 'View Services',
        cta_secondary_link: '/seo',
        show_contact_form: true,
      },
      {
        page_id: insertedPages['geo'],
        heading: 'Generative Engine Optimization',
        subheading: 'Unlock AI-Driven Growth',
        description: 'Master Generative Engine Optimization to get your content discovered by AI Search platforms like ChatGPT, Google AI Overviews, and Perplexity.',
        marquee_text: 'Generative Engine Optimization • AI Search Visibility • Future-Ready Strategy',
        cta_primary_text: 'Start Your GEO Growth',
        cta_primary_link: '/contact',
        cta_secondary_text: 'Free Consultation',
        cta_secondary_link: '/contact',
        show_contact_form: true,
        video_embed_url: 'https://www.youtube.com/embed/YOUR_VIDEO_ID',
      },
      {
        page_id: insertedPages['local'],
        heading: 'Local SEO Services',
        subheading: 'Dominate Local Search Results',
        description: 'Get your business ranked at the top of Google Maps and local search results with our proven Local SEO strategies.',
        marquee_text: 'Local SEO Expert • Google Business Profile Optimization',
        cta_primary_text: 'Get Free Local SEO Audit',
        cta_primary_link: '/contact',
        cta_secondary_text: 'Learn More',
        cta_secondary_link: '/local',
        show_contact_form: true,
        video_embed_url: 'https://www.youtube.com/embed/YOUR_VIDEO_ID',
      },
    ];

    for (const hero of heroData) {
      await supabase.from('page_hero').insert(hero);
    }
    console.log('✅ Page heroes created');

    // ========================================================================
    // PAGE_STATS — stat counters (years, projects, clients)
    // ========================================================================

    const statsData = [
      { page_id: insertedPages['seo'], value: '5', suffix: '+', label: 'Years Experience', sort_order: 0 },
      { page_id: insertedPages['seo'], value: '150', suffix: '+', label: 'Projects Completed', sort_order: 1 },
      { page_id: insertedPages['seo'], value: '90', suffix: '%', label: 'Return Clients', sort_order: 2 },
      { page_id: insertedPages['geo'], value: '5', suffix: '+', label: 'Years Experience', sort_order: 0 },
      { page_id: insertedPages['geo'], value: '150', suffix: '+', label: 'Projects Completed', sort_order: 1 },
      { page_id: insertedPages['local'], value: '5', suffix: '+', label: 'Years Experience', sort_order: 0 },
      { page_id: insertedPages['local'], value: '150', suffix: '+', label: 'Projects Completed', sort_order: 1 },
    ];

    for (const stat of statsData) {
      await supabase.from('page_stats').insert(stat);
    }
    console.log('✅ Page stats created');

    // ========================================================================
    // PRICING_PACKAGES & FEATURES (SEO, GEO, Local)
    // ========================================================================

    // SEO Packages
    const seoPkgs = [
      {
        page_id: insertedPages['seo'],
        name: 'Starter SEO',
        subtitle: 'Perfect for small business',
        price: '49,999',
        currency: 'PKR',
        unit_label: 'pages included',
        is_popular: false,
        sort_order: 0,
      },
      {
        page_id: insertedPages['seo'],
        name: 'Professional SEO',
        subtitle: 'For growing companies',
        price: '79,999',
        currency: 'PKR',
        unit_label: 'pages included',
        is_popular: true,
        sort_order: 1,
      },
      {
        page_id: insertedPages['seo'],
        name: 'Enterprise SEO',
        subtitle: 'Full-scale optimization',
        price: '149,999',
        currency: 'PKR',
        unit_label: 'pages included',
        is_popular: false,
        sort_order: 2,
      },
    ];

    const seoFeatures = [
      ['Keyword Research', 'On-Page Optimization', 'Meta Tag Optimization', 'Content Optimization'],
      [
        'Keyword Research',
        'On-Page Optimization',
        'Meta Tag Optimization',
        'Content Optimization',
        'Link Building',
        'Backlink Analysis',
      ],
      [
        'Comprehensive Keyword Research',
        'Advanced On-Page Optimization',
        'Full-Site Meta Tag Strategy',
        'Content Strategy & Creation',
        'Aggressive Link Building',
        'Monthly Reporting',
      ],
    ];

    for (let i = 0; i < seoPkgs.length; i++) {
      const { data: pkg } = await supabase
        .from('pricing_packages')
        .insert(seoPkgs[i])
        .select('id');

      if (pkg) {
        const features = seoFeatures[i].map((feature, idx) => ({
          package_id: pkg[0].id,
          feature_text: feature,
          is_disabled: false,
          sort_order: idx,
        }));
        await supabase.from('pricing_features').insert(features);
      }
    }
    console.log('✅ SEO pricing packages created');

    // GEO Packages
    const geoPkgs = [
      {
        page_id: insertedPages['geo'],
        name: 'GEO Starter',
        subtitle: 'Get discovered by AI',
        price: '49,999',
        currency: 'PKR',
        unit_label: 'pages included',
        is_popular: false,
        sort_order: 0,
      },
      {
        page_id: insertedPages['geo'],
        name: 'GEO Professional',
        subtitle: 'Accelerated AI visibility',
        price: '99,999',
        currency: 'PKR',
        unit_label: 'pages included',
        is_popular: true,
        sort_order: 1,
      },
      {
        page_id: insertedPages['geo'],
        name: 'GEO Enterprise',
        subtitle: 'Full AI dominance',
        price: '199,999',
        currency: 'PKR',
        unit_label: 'pages included',
        is_popular: false,
        sort_order: 2,
      },
    ];

    const geoFeatures = [
      ['AI Content Optimization', 'Platform Research', 'Basic Reporting'],
      [
        'AI Content Optimization',
        'Multi-Platform Research',
        'Content Strategy',
        'Link Building',
        'Weekly Reporting',
      ],
      [
        'Full AI Content Audit',
        'All Platform Optimization',
        'Advanced Analytics',
        'Competitive Analysis',
        'Monthly Strategy Calls',
        'Priority Support',
      ],
    ];

    for (let i = 0; i < geoPkgs.length; i++) {
      const { data: pkg } = await supabase
        .from('pricing_packages')
        .insert(geoPkgs[i])
        .select('id');

      if (pkg) {
        const features = geoFeatures[i].map((feature, idx) => ({
          package_id: pkg[0].id,
          feature_text: feature,
          is_disabled: false,
          sort_order: idx,
        }));
        await supabase.from('pricing_features').insert(features);
      }
    }
    console.log('✅ GEO pricing packages created');

    // Local SEO Packages
    const localPkgs = [
      {
        page_id: insertedPages['local'],
        name: 'Local SEO Starter',
        subtitle: 'Local visibility boost',
        price: '49,999',
        currency: 'PKR',
        unit_label: 'locations',
        is_popular: false,
        sort_order: 0,
      },
      {
        page_id: insertedPages['local'],
        name: 'Local SEO Pro',
        subtitle: 'Multi-location ranking',
        price: '99,999',
        currency: 'PKR',
        unit_label: 'locations',
        is_popular: true,
        sort_order: 1,
      },
      {
        page_id: insertedPages['local'],
        name: 'Local SEO Enterprise',
        subtitle: 'National dominance',
        price: '199,999',
        currency: 'PKR',
        unit_label: 'locations',
        is_popular: false,
        sort_order: 2,
      },
    ];

    const localFeatures = [
      [
        'Google Business Profile Setup',
        'Citation Building',
        'Review Management',
        'Local Citations',
      ],
      [
        'Google Business Profile Optimization',
        'Multi-Location Setup',
        'Local Citation Building',
        'Review Monitoring',
        'Local Link Building',
        'Monthly Reporting',
      ],
      [
        'Full Multi-Location Strategy',
        'Advanced Citation Building',
        'Reputation Management',
        'Local Content Strategy',
        'Competitive Analysis',
        'Weekly Updates',
      ],
    ];

    for (let i = 0; i < localPkgs.length; i++) {
      const { data: pkg } = await supabase
        .from('pricing_packages')
        .insert(localPkgs[i])
        .select('id');

      if (pkg) {
        const features = localFeatures[i].map((feature, idx) => ({
          package_id: pkg[0].id,
          feature_text: feature,
          is_disabled: false,
          sort_order: idx,
        }));
        await supabase.from('pricing_features').insert(features);
      }
    }
    console.log('✅ Local SEO pricing packages created');

    // ========================================================================
    // PROCESS_STEPS (same 8 steps for SEO, GEO, Local)
    // ========================================================================

    const processSteps = [
      { icon_name: 'FaFileAlt', title: 'Audit', description: 'Comprehensive SEO audit of your website' },
      { icon_name: 'FaChartLine', title: 'Strategy', description: 'Develop a custom SEO strategy' },
      { icon_name: 'FaKey', title: 'Keywords', description: 'Research and target right keywords' },
      { icon_name: 'FaEdit', title: 'Optimization', description: 'Optimize your website content' },
      { icon_name: 'FaCog', title: 'Technical', description: 'Fix technical SEO issues' },
      { icon_name: 'FaLink', title: 'Backlinks', description: 'Build high-quality backlinks' },
      { icon_name: 'FaMapMarkerAlt', title: 'Local', description: 'Optimize for local search' },
      { icon_name: 'FaChartPie', title: 'Reporting', description: 'Track and report results' },
    ];

    for (const page of ['seo', 'geo', 'local']) {
      const steps = processSteps.map((step, idx) => ({
        page_id: insertedPages[page],
        ...step,
        sort_order: idx,
      }));
      await supabase.from('process_steps').insert(steps);
    }
    console.log('✅ Process steps created');

    // ========================================================================
    // TOOL_ITEMS (CMS, Tools, Platforms)
    // ========================================================================

    const seoTools = [
      { category: 'cms', title: 'WordPress', icon_name: 'FaWordpress' },
      { category: 'cms', title: 'Shopify', icon_name: 'FaShopify' },
      { category: 'cms', title: 'Wix', icon_name: 'SiWix' },
      { category: 'cms', title: 'Squarespace', icon_name: 'SiSquarespace' },
      { category: 'cms', title: 'WooCommerce', icon_name: 'SiWoo' },
      { category: 'cms', title: 'Custom Websites', icon_name: 'MdWeb' },
      { category: 'tool', title: 'Google Analytics', icon_name: 'SiGoogleanalytics' },
      { category: 'tool', title: 'Google Search Console', icon_name: 'SiGoogletagmanager' },
      { category: 'tool', title: 'SEMrush', icon_name: 'SiSemrush' },
      { category: 'tool', title: 'Ahrefs', icon_name: null, icon_url: 'https://via.placeholder.com/50?text=Ahrefs' },
      { category: 'tool', title: 'Google Ads', icon_name: 'SiGoogleads' },
      { category: 'tool', title: 'Moz', icon_name: 'FaSearch' },
    ];

    const seoToolsWithPage = seoTools.map((tool, idx) => ({
      page_id: insertedPages['seo'],
      ...tool,
      sort_order: idx,
    }));
    await supabase.from('tool_items').insert(seoToolsWithPage);
    console.log('✅ SEO tools created');

    // GEO Platforms
    const geoPlatforms = [
      { category: 'platform', title: 'ChatGPT', icon_name: 'SiOpenai' },
      { category: 'platform', title: 'Google AI Overview', icon_name: 'SiGoogle' },
      { category: 'platform', title: 'Perplexity', icon_name: null },
      { category: 'platform', title: 'Microsoft Copilot', icon_name: 'SiMicrosoft' },
      { category: 'platform', title: 'Meta AI', icon_name: 'SiMeta' },
      { category: 'platform', title: 'DeepSeek', icon_name: null },
      { category: 'platform', title: 'Grok', icon_name: null },
    ];

    const geoPlatformsWithPage = geoPlatforms.map((tool, idx) => ({
      page_id: insertedPages['geo'],
      ...tool,
      sort_order: idx,
    }));
    await supabase.from('tool_items').insert(geoPlatformsWithPage);
    console.log('✅ GEO platforms created');

    // ========================================================================
    // PAGE_SCOPE_CARDS (Seo/Geo/Local scope sections)
    // ========================================================================

    const seoScopeCards = [
      { page_id: insertedPages['seo'], number: '01', title: 'On-Page SEO', description: 'Optimize your website content, meta tags, and structure for search engines' },
      { page_id: insertedPages['seo'], number: '02', title: 'Off-Page SEO', description: 'Build high-quality backlinks and improve your domain authority' },
      { page_id: insertedPages['seo'], number: '03', title: 'Technical SEO', description: 'Fix technical issues that prevent search engines from ranking your site' },
    ];

    await supabase.from('page_scope_cards').insert(seoScopeCards);

    const geoScopeCards = [
      { page_id: insertedPages['geo'], number: '01', title: 'Content Optimization for AI', description: 'Optimize your content to be discovered by AI search platforms' },
      { page_id: insertedPages['geo'], number: '02', title: 'Multi-Platform Strategy', description: 'Develop strategy for ChatGPT, Google AI Overviews, Perplexity and more' },
      { page_id: insertedPages['geo'], number: '03', title: 'AI Visibility Tracking', description: 'Monitor and track your visibility across AI search platforms' },
    ];

    await supabase.from('page_scope_cards').insert(geoScopeCards);

    const localScopeCards = [
      { page_id: insertedPages['local'], number: '01', title: 'Google Business Profile Optimization', description: 'Fully optimize your Google Business Profile for local search' },
      { page_id: insertedPages['local'], number: '02', title: 'Local Citations & NAP', description: 'Build consistent local citations and maintain accurate NAP (Name, Address, Phone)' },
      { page_id: insertedPages['local'], number: '03', title: 'Local Link Building', description: 'Build local links and increase your authority in your local area' },
    ];

    await supabase.from('page_scope_cards').insert(localScopeCards);
    console.log('✅ Scope cards created');

    // ========================================================================
    // SERVICE_OPTIONS (for contact form selects)
    // ========================================================================

    const serviceOptions = [
      { label: 'Search Engine Optimization (SEO)', form_context: 'primary', sort_order: 0 },
      { label: 'Generative Engine Optimization', form_context: 'primary', sort_order: 1 },
      { label: 'Local SEO', form_context: 'primary', sort_order: 2 },
      { label: 'Web Development', form_context: 'primary', sort_order: 3 },
      { label: 'Graphic Design', form_context: 'primary', sort_order: 4 },
      { label: 'AI Search Optimization', form_context: 'primary', sort_order: 5 },
      { label: 'Linkedin Optimization', form_context: 'secondary', sort_order: 6 },
      { label: 'Content Writing', form_context: 'secondary', sort_order: 7 },
    ];

    await supabase.from('service_options').insert(serviceOptions);
    console.log('✅ Service options created');

    // ========================================================================
    // TESTIMONIALS (global)
    // ========================================================================

    const testimonials = [
      {
        client_name: 'Ahmed Khan',
        client_role: 'E-commerce Business Owner',
        rating: 5,
        review_text: 'Farhan helped me increase my organic traffic by 300% in just 6 months. Highly professional!',
        source_platform: 'fiverr',
        is_featured: true,
        sort_order: 0,
      },
      {
        client_name: 'Fatima Malik',
        client_role: 'SaaS Founder',
        rating: 5,
        review_text: 'Excellent SEO services. My website now ranks for competitive keywords. Highly recommended!',
        source_platform: 'upwork',
        is_featured: true,
        sort_order: 1,
      },
      {
        client_name: 'Hassan Ali',
        client_role: 'Digital Marketing Manager',
        rating: 5,
        review_text: 'Professional, responsive, and results-driven. Best SEO expert I have worked with.',
        source_platform: 'linkedin',
        is_featured: true,
        sort_order: 2,
      },
    ];

    await supabase.from('testimonials').insert(testimonials);
    console.log('✅ Testimonials created');

    // ========================================================================
    // CHOOSE_FEATURES (Why Choose Me section)
    // ========================================================================

    const chooseFeatures = [
      { icon_name: 'FaBriefcase', title: 'Professional', description: 'Certified SEO expert with 5+ years of experience' },
      { icon_name: 'FaProjectDiagram', title: 'Proven Track Record', description: '150+ successful projects across multiple industries' },
      { icon_name: 'FaStar', title: 'Highly Rated', description: '4.9/5 rating from 1000+ satisfied clients' },
      { icon_name: 'FaGlobe', title: 'Global Reach', description: 'Served clients from 20+ countries worldwide' },
      { icon_name: 'FaThumbsUp', title: 'Quality Results', description: 'Focus on sustainable, long-term results' },
      { icon_name: 'FaSyncAlt', title: 'Transparent Reporting', description: 'Monthly detailed reports with clear metrics' },
      { icon_name: 'FaUsers', title: 'Dedicated Support', description: '24/7 customer support and quick response times' },
      { icon_name: 'FaHeadset', title: 'Consultation', description: 'Free initial SEO consultation and strategy session' },
    ];

    await supabase.from('choose_features').insert(chooseFeatures);
    console.log('✅ Choose features created');

    // ========================================================================
    // PORTFOLIO_ITEMS (unified case studies + portfolio)
    // ========================================================================

    const portfolioItems = [
      {
        title: 'E-commerce Store SEO',
        category: 'Search Engine Optimization',
        description: 'Increased organic traffic by 250% for a Shopify store within 6 months',
        is_case_study: true,
        sort_order: 0,
        status: 'published',
      },
      {
        title: 'SaaS Company Ranking',
        category: 'Search Engine Optimization',
        description: 'Achieved first-page rankings for 15+ competitive keywords',
        is_case_study: true,
        sort_order: 1,
        status: 'published',
      },
      {
        title: 'Local Business Growth',
        category: 'Search Engine Optimization',
        description: 'Helped a local business achieve 300% increase in phone calls from Google',
        is_case_study: true,
        sort_order: 2,
        status: 'published',
      },
    ];

    await supabase.from('portfolio_items').insert(portfolioItems);
    console.log('✅ Portfolio items created');

    // ========================================================================
    // BRANDS (client logos)
    // ========================================================================

    const brands = Array.from({ length: 50 }, (_, i) => ({
      name: `Brand ${i + 1}`,
      logo_url: `https://via.placeholder.com/100?text=Brand+${i + 1}`,
      row_group: i < 25 ? 'top' : 'bottom',
      sort_order: i % 25,
    }));

    await supabase.from('brands').insert(brands);
    console.log('✅ Brand logos created');

    // ========================================================================
    // GIGS (Fiverr promo cards)
    // ========================================================================

    const gigs = [
      {
        title: 'I will do technical SEO audit and optimization',
        rating: '4.9',
        review_count: '24 Reviews',
        price_label: 'From $150',
        sort_order: 0,
      },
      {
        title: 'I will do GEO and generative engine optimization',
        rating: '4.8',
        review_count: '12 Reviews',
        price_label: 'From $200',
        sort_order: 1,
      },
    ];

    await supabase.from('gigs').insert(gigs);
    console.log('✅ Gigs created');

    // ========================================================================
    // FAQS (global + page-specific)
    // ========================================================================

    const seoFaqs = [
      {
        question: 'How long does it take to see SEO results?',
        answer: 'SEO is a long-term strategy. You can typically expect to see initial results within 2-3 months, with significant improvements by 6 months.',
      },
      {
        question: 'What is the difference between on-page and off-page SEO?',
        answer: 'On-page SEO focuses on optimizing your website content and structure. Off-page SEO focuses on building backlinks and improving domain authority.',
      },
      {
        question: 'Do you guarantee first-page ranking?',
        answer: 'No one can guarantee rankings. However, our proven strategies have a 95% success rate for achieving top-10 rankings within 6 months.',
      },
      {
        question: 'Can you help with local SEO?',
        answer: 'Yes! We specialize in local SEO services to help businesses dominate local search results.',
      },
    ];

    // Insert as global FAQs (page_id = null)
    await supabase.from('faqs').insert(
      seoFaqs.map((faq, idx) => ({
        page_id: null,
        ...faq,
        sort_order: idx,
      }))
    );
    console.log('✅ FAQs created');

    // ========================================================================
    // NAVBAR_MENU_ITEMS
    // ========================================================================

    const navItems = [
      { label: 'Home', url: '/', parent_id: null, sort_order: 0 },
      { label: 'About Me', url: '/about', parent_id: null, sort_order: 1 },
      { label: 'Services', url: null, parent_id: null, sort_order: 2 },
      { label: 'SEO Services In Pakistan', url: '/seo', parent_id: null, sort_order: 3 },
      { label: 'GEO Services In Pakistan', url: '/geo', parent_id: null, sort_order: 4 },
      { label: 'Local SEO Services In Pakistan', url: '/local', parent_id: null, sort_order: 5 },
      { label: 'Portfolio', url: '/portfolio', parent_id: null, sort_order: 6 },
      { label: 'Contact Us', url: '/contact', parent_id: null, sort_order: 7 },
      { label: 'Blog', url: '/blog', parent_id: null, sort_order: 8 },
    ];

    await supabase.from('navbar_menu_items').insert(navItems);
    console.log('✅ Navbar menu items created');

    // ========================================================================
    // FOOTER_COLUMNS & LINKS
    // ========================================================================

    const footerData = [
      {
        column: { heading: 'Quick Menu', sort_order: 0 },
        links: [
          { label: 'Home', url: '/', sort_order: 0 },
          { label: 'About', url: '/about', sort_order: 1 },
          { label: 'Portfolio', url: '/portfolio', sort_order: 2 },
          { label: 'Contact', url: '/contact', sort_order: 3 },
        ],
      },
      {
        column: { heading: 'Services', sort_order: 1 },
        links: [
          { label: 'Search Engine Optimization', url: '/seo', sort_order: 0 },
          { label: 'Generative Engine Optimization', url: '/geo', sort_order: 1 },
          { label: 'Local SEO', url: '/local', sort_order: 2 },
        ],
      },
      {
        column: { heading: 'Information', sort_order: 2 },
        links: [
          { label: 'Privacy Policy', url: '/privacy', sort_order: 0 },
          { label: 'Terms & Conditions', url: '/terms', sort_order: 1 },
          { label: 'Contact Support', url: '/contact', sort_order: 2 },
        ],
      },
    ];

    for (const { column, links } of footerData) {
      const { data: col } = await supabase
        .from('footer_columns')
        .insert(column)
        .select('id');

      if (col) {
        const footerLinks = links.map((link) => ({
          ...link,
          column_id: col[0].id,
        }));
        await supabase.from('footer_links').insert(footerLinks);
      }
    }
    console.log('✅ Footer columns and links created');

    // ========================================================================
    // TEAM_MEMBERS (About page)
    // ========================================================================

    const teamMembers = [
      { name: 'Farhan Ali', role: 'Founder & SEO Expert', sort_order: 0 },
      { name: 'Osman', role: 'SaaS App Developer', sort_order: 1 },
      { name: 'Fareed Ahmed', role: 'Off-Page SEO Specialist', sort_order: 2 },
      { name: 'Neha Naz', role: 'Support Assistant', sort_order: 3 },
      { name: 'Ayesha Zulfiqar', role: 'Web Developer', sort_order: 4 },
      { name: 'Maria', role: 'Content Writer', sort_order: 5 },
    ];

    await supabase.from('team_members').insert(teamMembers);
    console.log('✅ Team members created');

    // ========================================================================
    // ACHIEVEMENTS (About page)
    // ========================================================================

    const achievements = [
      { value_label: 'Top Rated', title: 'Fiverr Top Rated', description: 'Recognized as a top-rated seller on Fiverr', sort_order: 0 },
      { value_label: '4.9/5', title: 'Client Rating', description: 'Average rating from 1000+ clients', sort_order: 1 },
      { value_label: '150+', title: 'Projects', description: 'Completed 150+ successful projects', sort_order: 2 },
    ];

    await supabase.from('achievements').insert(achievements);
    console.log('✅ Achievements created');

    // ========================================================================
    // MISSION_CARDS (About page)
    // ========================================================================

    const missionCards = [
      { title: 'Our Mission', description: 'To help businesses grow online through proven SEO and digital marketing strategies' },
      { title: 'Our Vision', description: 'To be the leading SEO agency in Pakistan, known for exceptional results and client satisfaction' },
      { title: 'Our Values', description: 'Transparency, quality, innovation, and customer success are at the core of everything we do' },
    ];

    await supabase.from('mission_cards').insert(missionCards);
    console.log('✅ Mission cards created');

    console.log('\n✅ Seed complete! All data migrated to Supabase.');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seedDatabase();
