/**
 * SEO Routes: robots.txt, sitemap.xml, llms.txt
 * All dynamically generated from Supabase data
 */

import { getServerSupabaseClient } from '../src/lib/supabase.js';

/**
 * GET /robots.txt
 */
export async function handleRobots(req, res) {
  try {
    const supabase = getServerSupabaseClient();
    const { data: settings } = await supabase
      .from('site_settings')
      .select('robots_txt_extra_rules')
      .single();

    const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api

Sitemap: ${process.env.SITE_URL || 'https://yourdomain.com'}/sitemap.xml

${settings?.robots_txt_extra_rules || ''}`;

    res.type('text/plain').send(robotsTxt);
  } catch (error) {
    console.error('Error generating robots.txt:', error);
    res.type('text/plain').send(`User-agent: *
Allow: /`);
  }
}

/**
 * GET /sitemap.xml
 * Auto-generated from published pages and blog posts
 */
export async function handleSitemap(req, res) {
  try {
    const supabase = getServerSupabaseClient();
    const baseUrl = process.env.SITE_URL || 'https://yourdomain.com';

    // Fetch all published pages
    const { data: pages } = await supabase
      .from('pages')
      .select('slug, updated_at')
      .eq('status', 'published');

    // Fetch all published blog posts
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('status', 'published');

    let urls = '';

    // Add pages
    if (pages) {
      pages.forEach((page) => {
        const path = page.slug === '' ? '/' : `/${page.slug}`;
        const lastmod = new Date(page.updated_at).toISOString().split('T')[0];
        urls += `  <url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
  </url>\n`;
      });
    }

    // Add blog posts
    if (posts) {
      posts.forEach((post) => {
        const lastmod = new Date(post.updated_at).toISOString().split('T')[0];
        urls += `  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
  </url>\n`;
      });
    }

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}</urlset>`;

    res.type('application/xml').send(sitemapXml);
  } catch (error) {
    console.error('Error generating sitemap.xml:', error);
    res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`);
  }
}

/**
 * GET /llms.txt
 * Fully admin-editable content from site_settings
 */
export async function handleLlmsTxt(req, res) {
  try {
    const supabase = getServerSupabaseClient();
    const { data: settings } = await supabase
      .from('site_settings')
      .select('llms_txt_content')
      .single();

    const content = settings?.llms_txt_content || getDefaultLlmsTxt();

    res.type('text/plain').send(content);
  } catch (error) {
    console.error('Error loading llms.txt:', error);
    res.type('text/plain').send(getDefaultLlmsTxt());
  }
}

function getDefaultLlmsTxt() {
  return `# SEO & Digital Marketing Services

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
WhatsApp: +92 327 2462207`;
}
