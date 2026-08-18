-- ============================================================================
-- BLOG SEO QUERIES - Ready to Run
-- ============================================================================

-- ============================================================================
-- 1. CREATE BLOG POST WITH COMPLETE SEO DATA
-- ============================================================================

-- Insert blog post with all SEO fields
INSERT INTO blog_posts (
  title,
  slug,
  excerpt,
  content,
  featured_image_url,
  featured_image_alt_text,
  featured_image_title,
  featured_image_caption,
  category_id,
  author_id,
  tags,
  focus_keyword,
  meta_title,
  meta_description,
  og_title,
  og_description,
  og_image_url,
  twitter_card,
  canonical_url,
  robots_directive,
  status,
  visibility,
  published_at,
  word_count,
  reading_time_minutes
) VALUES (
  'Best Bridal Dresses in Pakistan: Complete 2026 Guide',
  'best-bridal-dresses-pakistan-2026',
  'Discover the latest bridal dress styles, fabrics, colors and trends in Pakistan. Expert guide for Pakistani brides.',
  '<h2>Introduction</h2><p>Content here...</p><h2>Popular Styles</h2><p>...</p>',
  'https://example.com/images/bridal-dresses-2026.jpg',
  'Red Pakistani bridal dress with traditional embroidery and gold details',
  'Bridal Dresses Pakistan 2026',
  'Latest bridal collection for 2026 season',
  (SELECT id FROM blog_categories WHERE slug = 'bridal' LIMIT 1),
  (SELECT id FROM blog_authors WHERE email = 'sarah.khan@example.com' LIMIT 1),
  ARRAY['bridal-dresses', 'pakistan-fashion', 'wedding-dresses', 'embroidery'],
  'bridal dresses pakistan',
  'Best Bridal Dresses in Pakistan | 2026 Complete Guide',
  'Explore the latest bridal dress styles, fabrics, colors and trends in Pakistan. Expert guide for Pakistani brides in 2026.',
  'Best Bridal Dresses in Pakistan | 2026 Guide',
  'Discover latest bridal dress styles and designs for Pakistani weddings.',
  'https://example.com/images/og-bridal.jpg',
  'summary_large_image',
  'https://example.com/blog/best-bridal-dresses-pakistan-2026',
  'index,follow',
  'published',
  'public',
  NOW(),
  1245,
  6
)
RETURNING id;

-- ============================================================================
-- 2. GET BLOG POST WITH ALL SEO DATA AND METADATA
-- ============================================================================

SELECT
  bp.id,
  bp.title,
  bp.slug,
  bp.excerpt,
  bp.featured_image_url,
  bp.featured_image_alt_text,
  bp.featured_image_title,
  bp.featured_image_caption,
  bp.content,
  bp.tags,
  bp.focus_keyword,
  bp.meta_title,
  bp.meta_description,
  bp.og_title,
  bp.og_description,
  bp.og_image_url,
  bp.twitter_card,
  bp.canonical_url,
  bp.robots_directive,
  bp.status,
  bp.visibility,
  bp.published_at,
  bp.word_count,
  bp.reading_time_minutes,
  bp.view_count,
  bp.seo_score,
  -- Category info
  bc.id as category_id,
  bc.name as category_name,
  bc.slug as category_slug,
  -- Author info
  ba.id as author_id,
  ba.name as author_name,
  ba.email as author_email,
  ba.avatar_url as author_avatar,
  ba.role as author_role,
  -- FAQ count
  COUNT(DISTINCT bf.id) as faq_count,
  ARRAY_AGG(DISTINCT bf.question) FILTER (WHERE bf.question IS NOT NULL) as faq_questions,
  -- Timestamps
  bp.created_at,
  bp.updated_at
FROM blog_posts bp
LEFT JOIN blog_categories bc ON bp.category_id = bc.id
LEFT JOIN blog_authors ba ON bp.author_id = ba.id
LEFT JOIN blog_faqs bf ON bp.id = bf.blog_id
WHERE bp.slug = 'best-bridal-dresses-pakistan-2026'
GROUP BY bp.id, bc.id, ba.id;

-- ============================================================================
-- 3. INSERT BLOG SCHEMA MARKUP (JSON-LD)
-- ============================================================================

INSERT INTO blog_schema (blog_id, schema_type, schema_data, is_auto_generated)
SELECT
  bp.id,
  'BlogPosting',
  jsonb_build_object(
    '@context', 'https://schema.org',
    '@type', 'BlogPosting',
    'headline', bp.title,
    'description', bp.excerpt,
    'image', bp.featured_image_url,
    'datePublished', bp.published_at,
    'dateModified', bp.updated_at,
    'author', jsonb_build_object(
      '@type', 'Person',
      'name', ba.name,
      'url', 'https://example.com/authors/' || ba.id
    ),
    'publisher', jsonb_build_object(
      '@type', 'Organization',
      'name', 'Example Company',
      'logo', 'https://example.com/logo.jpg'
    ),
    'articleBody', bp.content,
    'wordCount', bp.word_count,
    'keywords', array_to_string(bp.tags, ', ')
  ),
  true
FROM blog_posts bp
LEFT JOIN blog_authors ba ON bp.author_id = ba.id
WHERE bp.slug = 'best-bridal-dresses-pakistan-2026'
ON CONFLICT (blog_id) DO UPDATE SET
  schema_data = EXCLUDED.schema_data,
  updated_at = NOW();

-- ============================================================================
-- 4. INSERT BLOG SEO KEYWORDS
-- ============================================================================

-- Insert primary keyword
INSERT INTO page_seo_keywords (page_id, keyword, is_primary, keyword_density)
VALUES (
  (SELECT id FROM blog_posts WHERE slug = 'best-bridal-dresses-pakistan-2026' LIMIT 1),
  'bridal dresses pakistan',
  true,
  3.5
)
ON CONFLICT (page_id, keyword) DO UPDATE SET
  is_primary = EXCLUDED.is_primary,
  keyword_density = EXCLUDED.keyword_density,
  last_updated = NOW();

-- Insert secondary keywords
INSERT INTO page_seo_keywords (page_id, keyword, is_primary, keyword_density)
VALUES
  ((SELECT id FROM blog_posts WHERE slug = 'best-bridal-dresses-pakistan-2026' LIMIT 1), 'pakistan wedding dresses', false, 2.1),
  ((SELECT id FROM blog_posts WHERE slug = 'best-bridal-dresses-pakistan-2026' LIMIT 1), 'embroidered bridal wear', false, 1.8),
  ((SELECT id FROM blog_posts WHERE slug = 'best-bridal-dresses-pakistan-2026' LIMIT 1), 'traditional lehenga', false, 2.5)
ON CONFLICT (page_id, keyword) DO UPDATE SET
  keyword_density = EXCLUDED.keyword_density,
  last_updated = NOW();

-- ============================================================================
-- 5. INSERT FAQ FOR BLOG POST
-- ============================================================================

INSERT INTO blog_faqs (blog_id, question, answer, sort_order)
SELECT
  bp.id,
  'What are the most popular bridal dress styles in Pakistan?',
  'Traditional lehenga, sharara, gharara, and heavily embroidered bridal dresses remain popular choices. Each style has unique characteristics and suits different body types and preferences.',
  1
FROM blog_posts bp
WHERE bp.slug = 'best-bridal-dresses-pakistan-2026'
LIMIT 1;

INSERT INTO blog_faqs (blog_id, question, answer, sort_order)
SELECT
  bp.id,
  'What fabrics are best for Pakistani bridal dresses?',
  'Silk, velvet, chiffon, and net are popular choices. Silk provides elegance and drape, while velvet adds richness. The choice depends on the season and personal preference.',
  2
FROM blog_posts bp
WHERE bp.slug = 'best-bridal-dresses-pakistan-2026'
LIMIT 1;

-- ============================================================================
-- 6. UPDATE BLOG POST SEO SCORE
-- ============================================================================

UPDATE blog_posts
SET
  seo_score = CASE
    WHEN meta_title IS NOT NULL AND LENGTH(meta_title) >= 30 AND LENGTH(meta_title) <= 60 THEN 15
    ELSE 0
  END +
  CASE
    WHEN meta_description IS NOT NULL AND LENGTH(meta_description) >= 120 AND LENGTH(meta_description) <= 160 THEN 15
    ELSE 0
  END +
  CASE
    WHEN focus_keyword IS NOT NULL AND title ILIKE '%' || focus_keyword || '%' THEN 15
    ELSE 0
  END +
  CASE
    WHEN featured_image_alt_text IS NOT NULL THEN 10
    ELSE 0
  END +
  CASE
    WHEN word_count >= 300 THEN 15
    ELSE 0
  END +
  CASE
    WHEN content LIKE '%<h2>%' OR content LIKE '%<h3>%' THEN 15
    ELSE 0
  END +
  CASE
    WHEN canonical_url IS NOT NULL THEN 10
    ELSE 0
  END +
  CASE
    WHEN og_title IS NOT NULL AND og_description IS NOT NULL THEN 5
    ELSE 0
  END
WHERE slug = 'best-bridal-dresses-pakistan-2026';

-- ============================================================================
-- 7. GET BLOG SEO ANALYSIS
-- ============================================================================

SELECT
  bp.id,
  bp.title,
  bp.slug,
  bp.seo_score,
  -- SEO Checklist
  CASE WHEN bp.focus_keyword IS NOT NULL THEN 'PASS' ELSE 'FAIL' END as focus_keyword_check,
  CASE WHEN bp.title ILIKE '%' || bp.focus_keyword || '%' THEN 'PASS' ELSE 'FAIL' END as keyword_in_title,
  CASE WHEN bp.meta_title LIKE '%' || bp.focus_keyword || '%' THEN 'PASS' ELSE 'FAIL' END as keyword_in_meta_title,
  CASE WHEN LENGTH(bp.meta_title) >= 30 AND LENGTH(bp.meta_title) <= 60 THEN 'PASS' ELSE 'FAIL' END as meta_title_length,
  CASE WHEN LENGTH(bp.meta_description) >= 120 AND LENGTH(bp.meta_description) <= 160 THEN 'PASS' ELSE 'FAIL' END as meta_description_length,
  CASE WHEN bp.featured_image_alt_text IS NOT NULL THEN 'PASS' ELSE 'FAIL' END as alt_text_present,
  CASE WHEN bp.word_count >= 300 THEN 'PASS' ELSE 'FAIL' END as content_length,
  CASE WHEN bp.content LIKE '%<h2>%' OR bp.content LIKE '%<h3>%' THEN 'PASS' ELSE 'FAIL' END as heading_structure,
  CASE WHEN bp.canonical_url IS NOT NULL THEN 'PASS' ELSE 'FAIL' END as canonical_url_present,
  -- Counters
  bp.word_count,
  bp.reading_time_minutes,
  COUNT(DISTINCT bf.id) as faq_count,
  (SELECT COUNT(*) FROM page_seo_keywords WHERE page_id = bp.id) as keyword_count,
  bp.view_count
FROM blog_posts bp
LEFT JOIN blog_faqs bf ON bp.id = bf.blog_id
WHERE bp.slug = 'best-bridal-dresses-pakistan-2026'
GROUP BY bp.id;

-- ============================================================================
-- 8. SCHEDULE BLOG POST FOR FUTURE PUBLICATION
-- ============================================================================

INSERT INTO publishing_schedule (blog_id, scheduled_at, action, scheduled_by, status)
SELECT
  bp.id,
  '2026-08-25 10:00:00+00'::TIMESTAMPTZ,
  'publish',
  'admin@example.com',
  'scheduled'
FROM blog_posts bp
WHERE bp.slug = 'best-bridal-dresses-pakistan-2026'
LIMIT 1;

-- ============================================================================
-- 9. GET ALL PUBLISHED BLOGS WITH SEO SCORES (SORTED BY RANKING)
-- ============================================================================

SELECT
  bp.id,
  bp.title,
  bp.slug,
  bp.seo_score,
  bp.view_count,
  bc.name as category,
  ba.name as author,
  bp.published_at,
  bp.updated_at
FROM blog_posts bp
LEFT JOIN blog_categories bc ON bp.category_id = bc.id
LEFT JOIN blog_authors ba ON bp.author_id = ba.id
WHERE bp.status = 'published'
ORDER BY bp.seo_score DESC, bp.view_count DESC
LIMIT 20;

-- ============================================================================
-- 10. GET SCHEDULED BLOGS TO BE PUBLISHED
-- ============================================================================

SELECT
  ps.id as schedule_id,
  bp.id as blog_id,
  bp.title,
  bp.slug,
  ps.scheduled_at,
  ps.scheduled_by,
  ps.status,
  ba.name as author
FROM publishing_schedule ps
LEFT JOIN blog_posts bp ON ps.blog_id = bp.id
LEFT JOIN blog_authors ba ON bp.author_id = ba.id
WHERE ps.status = 'scheduled' AND ps.action = 'publish'
ORDER BY ps.scheduled_at ASC;

-- ============================================================================
-- PAGE SEO QUERIES - Ready to Run
-- ============================================================================

-- ============================================================================
-- 11. CREATE PAGE WITH COMPLETE SEO DATA
-- ============================================================================

INSERT INTO pages (
  slug,
  title,
  template_type,
  status,
  meta_title,
  meta_description,
  meta_keywords,
  og_title,
  og_description,
  og_image_url,
  og_type,
  canonical_url,
  robots_directive,
  focus_keyword,
  seo_score,
  visibility,
  show_in_navbar,
  show_in_footer
) VALUES (
  'seo-services',
  'Professional SEO Services',
  'seo',
  'published',
  'Best SEO Services in Pakistan | Improve Rankings',
  'Expert SEO services to improve your website rankings, drive organic traffic, and grow your business online.',
  'SEO, search engine optimization, digital marketing',
  'Best SEO Services in Pakistan | Improve Rankings',
  'Expert SEO services to improve rankings and drive organic traffic',
  'https://example.com/images/og-seo.jpg',
  'website',
  'https://example.com/seo-services',
  'index,follow',
  'seo services pakistan',
  0,
  'public',
  true,
  true
)
RETURNING id;

-- ============================================================================
-- 12. GET PAGE WITH ALL SEO DATA
-- ============================================================================

SELECT
  p.id,
  p.slug,
  p.title,
  p.template_type,
  p.status,
  p.meta_title,
  p.meta_description,
  p.meta_keywords,
  p.og_title,
  p.og_description,
  p.og_image_url,
  p.og_type,
  p.canonical_url,
  p.robots_directive,
  p.focus_keyword,
  p.seo_score,
  p.view_count,
  p.visibility,
  p.show_in_navbar,
  p.show_in_footer,
  p.created_at,
  p.updated_at,
  -- Parent page info
  pp.title as parent_page_title,
  pp.slug as parent_page_slug,
  -- SEO metadata
  psm.h1_count,
  psm.h2_count,
  psm.h3_count,
  psm.internal_links_count,
  psm.external_links_count,
  psm.images_with_alt_count,
  psm.images_without_alt_count,
  psm.has_canonical,
  psm.has_open_graph,
  psm.has_schema_markup,
  psm.keywords_in_title,
  psm.keywords_in_description,
  psm.keywords_in_h1,
  -- Keywords
  ARRAY_AGG(DISTINCT psk.keyword) FILTER (WHERE psk.keyword IS NOT NULL) as keywords,
  -- FAQ count
  COUNT(DISTINCT f.id) as faq_count
FROM pages p
LEFT JOIN pages pp ON p.parent_page_id = pp.id
LEFT JOIN page_seo_metadata psm ON p.id = psm.page_id
LEFT JOIN page_seo_keywords psk ON p.id = psk.page_id
LEFT JOIN faqs f ON p.id = f.page_id
WHERE p.slug = 'seo-services'
GROUP BY p.id, pp.id, psm.id;

-- ============================================================================
-- 13. INSERT PAGE SEO METADATA
-- ============================================================================

INSERT INTO page_seo_metadata (
  page_id,
  h1_count,
  h2_count,
  h3_count,
  internal_links_count,
  external_links_count,
  images_with_alt_count,
  images_without_alt_count,
  has_canonical,
  has_open_graph,
  has_schema_markup,
  keywords_in_title,
  keywords_in_description,
  keywords_in_h1,
  last_seo_check
)
SELECT
  p.id,
  1,
  5,
  12,
  8,
  3,
  6,
  0,
  true,
  true,
  true,
  true,
  true,
  true,
  NOW()
FROM pages p
WHERE p.slug = 'seo-services'
LIMIT 1
ON CONFLICT (page_id) DO UPDATE SET
  h1_count = EXCLUDED.h1_count,
  h2_count = EXCLUDED.h2_count,
  h3_count = EXCLUDED.h3_count,
  internal_links_count = EXCLUDED.internal_links_count,
  external_links_count = EXCLUDED.external_links_count,
  images_with_alt_count = EXCLUDED.images_with_alt_count,
  images_without_alt_count = EXCLUDED.images_without_alt_count,
  has_canonical = EXCLUDED.has_canonical,
  has_open_graph = EXCLUDED.has_open_graph,
  has_schema_markup = EXCLUDED.has_schema_markup,
  keywords_in_title = EXCLUDED.keywords_in_title,
  keywords_in_description = EXCLUDED.keywords_in_description,
  keywords_in_h1 = EXCLUDED.keywords_in_h1,
  last_seo_check = NOW(),
  updated_at = NOW();

-- ============================================================================
-- 14. INSERT PAGE SEO KEYWORDS
-- ============================================================================

INSERT INTO page_seo_keywords (page_id, keyword, is_primary, keyword_density)
SELECT
  p.id,
  'seo services pakistan',
  true,
  4.2
FROM pages p
WHERE p.slug = 'seo-services'
LIMIT 1
ON CONFLICT (page_id, keyword) DO UPDATE SET
  is_primary = EXCLUDED.is_primary,
  keyword_density = EXCLUDED.keyword_density,
  last_updated = NOW();

-- Insert secondary keywords
INSERT INTO page_seo_keywords (page_id, keyword, is_primary, keyword_density)
VALUES
  ((SELECT id FROM pages WHERE slug = 'seo-services' LIMIT 1), 'digital marketing', false, 2.8),
  ((SELECT id FROM pages WHERE slug = 'seo-services' LIMIT 1), 'search engine optimization', false, 3.1),
  ((SELECT id FROM pages WHERE slug = 'seo-services' LIMIT 1), 'organic traffic growth', false, 2.4)
ON CONFLICT (page_id, keyword) DO UPDATE SET
  keyword_density = EXCLUDED.keyword_density,
  last_updated = NOW();

-- ============================================================================
-- 15. INSERT PAGE SCHEMA MARKUP (JSON-LD)
-- ============================================================================

INSERT INTO page_schema (page_id, schema_type, schema_data, is_auto_generated)
SELECT
  p.id,
  'LocalBusiness',
  jsonb_build_object(
    '@context', 'https://schema.org',
    '@type', 'LocalBusiness',
    'name', p.title,
    'description', p.meta_description,
    'url', 'https://example.com/' || p.slug,
    'image', p.og_image_url,
    'telephone', '+923272462207',
    'email', 'contact@example.com',
    'address', jsonb_build_object(
      '@type', 'PostalAddress',
      'streetAddress', 'Office Address',
      'addressLocality', 'Karachi',
      'addressRegion', 'Sindh',
      'postalCode', '75000',
      'addressCountry', 'PK'
    ),
    'sameAs', ARRAY['https://facebook.com/company', 'https://twitter.com/company']
  ),
  true
FROM pages p
WHERE p.slug = 'seo-services'
LIMIT 1
ON CONFLICT (page_id) DO UPDATE SET
  schema_data = EXCLUDED.schema_data,
  updated_at = NOW();

-- ============================================================================
-- 16. GET PAGE SEO ANALYSIS & CHECKLIST
-- ============================================================================

SELECT
  p.id,
  p.title,
  p.slug,
  p.seo_score,
  -- SEO Checklist
  CASE WHEN p.focus_keyword IS NOT NULL THEN true ELSE false END as has_focus_keyword,
  CASE WHEN p.meta_title IS NOT NULL AND LENGTH(p.meta_title) >= 30 AND LENGTH(p.meta_title) <= 60 THEN true ELSE false END as meta_title_optimal,
  CASE WHEN p.meta_description IS NOT NULL AND LENGTH(p.meta_description) >= 120 AND LENGTH(p.meta_description) <= 160 THEN true ELSE false END as meta_description_optimal,
  CASE WHEN p.og_title IS NOT NULL THEN true ELSE false END as has_og_title,
  CASE WHEN p.og_description IS NOT NULL THEN true ELSE false END as has_og_description,
  CASE WHEN p.canonical_url IS NOT NULL THEN true ELSE false END as has_canonical_url,
  CASE WHEN psm.has_schema_markup = true THEN true ELSE false END as has_schema_markup,
  -- Counts
  psm.h1_count,
  psm.h2_count,
  psm.h3_count,
  psm.images_without_alt_count,
  (SELECT COUNT(*) FROM page_seo_keywords WHERE page_id = p.id AND is_primary = true) as primary_keywords,
  (SELECT COUNT(*) FROM page_seo_keywords WHERE page_id = p.id AND is_primary = false) as secondary_keywords,
  (SELECT COUNT(*) FROM faqs WHERE page_id = p.id) as faq_count,
  p.view_count,
  p.updated_at
FROM pages p
LEFT JOIN page_seo_metadata psm ON p.id = psm.page_id
WHERE p.slug = 'seo-services';

-- ============================================================================
-- 17. UPDATE PAGE SEO SCORE
-- ============================================================================

UPDATE pages
SET
  seo_score = CASE
    WHEN meta_title IS NOT NULL AND LENGTH(meta_title) >= 30 AND LENGTH(meta_title) <= 60 THEN 15
    ELSE 0
  END +
  CASE
    WHEN meta_description IS NOT NULL AND LENGTH(meta_description) >= 120 AND LENGTH(meta_description) <= 160 THEN 15
    ELSE 0
  END +
  CASE
    WHEN focus_keyword IS NOT NULL AND title ILIKE '%' || focus_keyword || '%' THEN 15
    ELSE 0
  END +
  CASE
    WHEN canonical_url IS NOT NULL THEN 10
    ELSE 0
  END +
  CASE
    WHEN og_title IS NOT NULL AND og_description IS NOT NULL THEN 10
    ELSE 0
  END +
  CASE
    WHEN robots_directive = 'index,follow' THEN 5
    ELSE 0
  END +
  CASE
    WHEN show_in_navbar = true THEN 5
    ELSE 0
  END +
  CASE
    WHEN show_in_footer = true THEN 5
    ELSE 0
  END +
  CASE
    WHEN status = 'published' THEN 10
    ELSE 0
  END
WHERE slug = 'seo-services';

-- ============================================================================
-- 18. GET ALL PAGES WITH SEO SCORES (ADMIN DASHBOARD)
-- ============================================================================

SELECT
  p.id,
  p.title,
  p.slug,
  p.template_type,
  p.status,
  p.seo_score,
  p.view_count,
  p.visibility,
  -- SEO Status
  CASE
    WHEN p.seo_score >= 80 THEN 'Excellent'
    WHEN p.seo_score >= 60 THEN 'Good'
    WHEN p.seo_score >= 40 THEN 'Fair'
    ELSE 'Needs Improvement'
  END as seo_status,
  -- Audit Info
  psm.last_seo_check,
  psm.images_without_alt_count,
  psm.has_canonical,
  psm.has_schema_markup,
  p.updated_at
FROM pages p
LEFT JOIN page_seo_metadata psm ON p.id = psm.page_id
WHERE p.status = 'published'
ORDER BY p.seo_score DESC, p.view_count DESC;

-- ============================================================================
-- 19. GET PAGES WITH SEO ISSUES
-- ============================================================================

SELECT
  p.id,
  p.title,
  p.slug,
  ARRAY_REMOVE(ARRAY[
    CASE WHEN p.meta_title IS NULL OR LENGTH(p.meta_title) < 30 THEN 'Meta title too short' END,
    CASE WHEN LENGTH(p.meta_title) > 60 THEN 'Meta title too long' END,
    CASE WHEN p.meta_description IS NULL OR LENGTH(p.meta_description) < 120 THEN 'Meta description too short' END,
    CASE WHEN LENGTH(p.meta_description) > 160 THEN 'Meta description too long' END,
    CASE WHEN p.focus_keyword IS NULL THEN 'No focus keyword' END,
    CASE WHEN p.canonical_url IS NULL THEN 'No canonical URL' END,
    CASE WHEN psm.has_canonical = false THEN 'Missing canonical in content' END,
    CASE WHEN psm.images_without_alt_count > 0 THEN CONCAT(psm.images_without_alt_count, ' images without alt text') END,
    CASE WHEN psm.h1_count = 0 THEN 'No H1 heading' END,
    CASE WHEN psm.h1_count > 1 THEN 'Multiple H1 headings' END
  ], NULL) as issues,
  p.seo_score
FROM pages p
LEFT JOIN page_seo_metadata psm ON p.id = psm.page_id
WHERE p.status = 'published'
HAVING array_length(ARRAY_REMOVE(ARRAY[
    CASE WHEN p.meta_title IS NULL OR LENGTH(p.meta_title) < 30 THEN 'Meta title too short' END,
    CASE WHEN LENGTH(p.meta_title) > 60 THEN 'Meta title too long' END,
    CASE WHEN p.meta_description IS NULL OR LENGTH(p.meta_description) < 120 THEN 'Meta description too short' END,
    CASE WHEN LENGTH(p.meta_description) > 160 THEN 'Meta description too long' END,
    CASE WHEN p.focus_keyword IS NULL THEN 'No focus keyword' END,
    CASE WHEN p.canonical_url IS NULL THEN 'No canonical URL' END,
    CASE WHEN psm.has_canonical = false THEN 'Missing canonical in content' END,
    CASE WHEN psm.images_without_alt_count > 0 THEN CONCAT(psm.images_without_alt_count, ' images without alt text') END,
    CASE WHEN psm.h1_count = 0 THEN 'No H1 heading' END,
    CASE WHEN psm.h1_count > 1 THEN 'Multiple H1 headings' END
  ], NULL), 1) > 0
ORDER BY array_length(ARRAY_REMOVE(ARRAY[
    CASE WHEN p.meta_title IS NULL OR LENGTH(p.meta_title) < 30 THEN 'Meta title too short' END,
    CASE WHEN LENGTH(p.meta_title) > 60 THEN 'Meta title too long' END,
    CASE WHEN p.meta_description IS NULL OR LENGTH(p.meta_description) < 120 THEN 'Meta description too short' END,
    CASE WHEN LENGTH(p.meta_description) > 160 THEN 'Meta description too long' END,
    CASE WHEN p.focus_keyword IS NULL THEN 'No focus keyword' END,
    CASE WHEN p.canonical_url IS NULL THEN 'No canonical URL' END,
    CASE WHEN psm.has_canonical = false THEN 'Missing canonical in content' END,
    CASE WHEN psm.images_without_alt_count > 0 THEN CONCAT(psm.images_without_alt_count, ' images without alt text') END,
    CASE WHEN psm.h1_count = 0 THEN 'No H1 heading' END,
    CASE WHEN psm.h1_count > 1 THEN 'Multiple H1 headings' END
  ], NULL), 1) DESC;

-- ============================================================================
-- 20. SCHEDULE PAGE FOR PUBLICATION
-- ============================================================================

INSERT INTO publishing_schedule (page_id, scheduled_at, action, scheduled_by, status)
SELECT
  p.id,
  '2026-08-28 09:00:00+00'::TIMESTAMPTZ,
  'publish',
  'admin@example.com',
  'scheduled'
FROM pages p
WHERE p.slug = 'seo-services'
LIMIT 1;

-- ============================================================================
-- 21. GET DRAFT PAGES NEEDING REVIEW
-- ============================================================================

SELECT
  p.id,
  p.title,
  p.slug,
  p.template_type,
  CASE
    WHEN p.seo_score >= 80 THEN 'Ready'
    WHEN p.seo_score >= 60 THEN 'Review SEO'
    ELSE 'Needs SEO Work'
  END as readiness,
  p.seo_score,
  p.created_at,
  p.updated_at
FROM pages p
WHERE p.status = 'draft'
ORDER BY p.updated_at DESC;

-- ============================================================================
-- 22. COMPARE BLOG SEO PERFORMANCE
-- ============================================================================

SELECT
  bp.title,
  bp.slug,
  bp.seo_score,
  bp.view_count,
  bp.published_at,
  bp.word_count,
  bp.reading_time_minutes,
  bc.name as category,
  ROUND((bp.view_count::NUMERIC / NULLIF(EXTRACT(DAY FROM (NOW() - bp.published_at)), 0))::NUMERIC, 2) as views_per_day,
  (SELECT COUNT(*) FROM blog_faqs WHERE blog_id = bp.id) as faq_count
FROM blog_posts bp
LEFT JOIN blog_categories bc ON bp.category_id = bc.id
WHERE bp.status = 'published'
ORDER BY bp.seo_score DESC, bp.view_count DESC;

-- ============================================================================
-- 23. GET BLOG REVISION HISTORY
-- ============================================================================

SELECT
  br.revision_number,
  br.title,
  br.created_by,
  br.created_at,
  br.status,
  CASE
    WHEN br.revision_number = 1 THEN 'Initial'
    ELSE CONCAT('Update ', br.revision_number - 1, ' → ', br.revision_number)
  END as change_type
FROM blog_post_revisions br
WHERE br.blog_id = (SELECT id FROM blog_posts WHERE slug = 'best-bridal-dresses-pakistan-2026' LIMIT 1)
ORDER BY br.revision_number DESC;

-- ============================================================================
-- 24. UPDATE BLOG VIEW COUNT (TRACK ANALYTICS)
-- ============================================================================

UPDATE blog_posts
SET view_count = view_count + 1
WHERE slug = 'best-bridal-dresses-pakistan-2026'
RETURNING title, view_count;

-- ============================================================================
-- 25. GET LOW-PERFORMING CONTENT FOR OPTIMIZATION
-- ============================================================================

SELECT
  bp.id,
  bp.title,
  bp.slug,
  bp.seo_score,
  bp.view_count,
  bp.published_at,
  ARRAY_REMOVE(ARRAY[
    CASE WHEN bp.focus_keyword IS NULL THEN 'No focus keyword' END,
    CASE WHEN LENGTH(bp.meta_title) < 30 THEN 'Meta title too short' END,
    CASE WHEN LENGTH(bp.meta_title) > 60 THEN 'Meta title too long' END,
    CASE WHEN LENGTH(bp.meta_description) < 120 THEN 'Meta desc too short' END,
    CASE WHEN bp.featured_image_alt_text IS NULL THEN 'Missing alt text' END,
    CASE WHEN bp.word_count < 300 THEN 'Content too short' END
  ], NULL) as improvements_needed
FROM blog_posts bp
WHERE bp.status = 'published' AND bp.seo_score < 60
ORDER BY bp.view_count ASC;
