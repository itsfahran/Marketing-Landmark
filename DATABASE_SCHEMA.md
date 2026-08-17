# Database Schema Documentation

## Overview

This document describes the complete database schema for the CMS, including tables for pages, blog posts, SEO management, and admin features.

---

## Core Tables

### 1. **pages**
Manages all website pages and content.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| slug | VARCHAR(255) | URL-friendly identifier (unique) |
| title | VARCHAR(255) | Page title |
| template_type | TEXT | home, seo, geo, local, static, blog_index |
| status | TEXT | draft, published |
| meta_title | VARCHAR(255) | SEO title (30-60 chars) |
| meta_description | TEXT | SEO description (120-160 chars) |
| meta_keywords | TEXT | SEO keywords |
| og_title | VARCHAR(255) | Open Graph title |
| og_description | TEXT | Open Graph description |
| og_image_url | TEXT | Social sharing image |
| og_type | VARCHAR(50) | website, article, etc. |
| canonical_url | TEXT | Canonical URL |
| focus_keyword | VARCHAR(100) | Primary keyword target |
| robots_directive | VARCHAR(50) | index,follow | noindex,follow |
| seo_score | INTEGER | SEO quality score (0-100) |
| view_count | INTEGER | Total page views |
| parent_page_id | UUID | For hierarchical pages |
| visibility | TEXT | public, private |
| scheduled_publish_at | TIMESTAMPTZ | Future publish date |
| show_in_navbar | BOOLEAN | Display in navigation |
| show_in_footer | BOOLEAN | Display in footer |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

**Indexes:**
- slug, status, template_type, focus_keyword, visibility, parent_page_id, scheduled_publish_at, seo_score

---

### 2. **blog_posts**
Blog article management.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| slug | VARCHAR(255) | URL-friendly identifier (unique) |
| title | VARCHAR(255) | Article title |
| excerpt | TEXT | Short description (120-160 chars) |
| content | TEXT | Full HTML content |
| featured_image_url | TEXT | Article header image |
| featured_image_alt_text | VARCHAR(255) | Image alt text (SEO & accessibility) |
| featured_image_title | VARCHAR(255) | Image title attribute |
| featured_image_caption | TEXT | Image caption |
| category_id | UUID | Reference to blog_categories |
| author_id | UUID | Reference to blog_authors |
| tags | TEXT[] | Array of tags |
| focus_keyword | VARCHAR(100) | Primary keyword |
| meta_title | VARCHAR(255) | SEO title |
| meta_description | TEXT | SEO description |
| og_title | VARCHAR(255) | Open Graph title |
| og_description | TEXT | Open Graph description |
| og_image_url | TEXT | Social image |
| twitter_card | VARCHAR(50) | summary, summary_large_image |
| canonical_url | VARCHAR(500) | Canonical URL |
| robots_directive | VARCHAR(50) | SEO robot rules |
| status | TEXT | draft, published, scheduled |
| visibility | TEXT | public, private |
| published_at | TIMESTAMPTZ | Publication timestamp |
| scheduled_publish_at | TIMESTAMPTZ | Future publish date |
| word_count | INTEGER | Article length |
| reading_time_minutes | INTEGER | Estimated read time |
| view_count | INTEGER | Total views |
| seo_score | INTEGER | SEO quality score (0-100) |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

**Indexes:**
- slug, status, category_id, author_id, published_at, scheduled_publish_at, visibility

---

### 3. **blog_categories**
Blog post categories.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR(100) | Category name (unique) |
| slug | VARCHAR(100) | URL-friendly identifier (unique) |
| description | TEXT | Category description |
| icon_name | VARCHAR(100) | Icon identifier |
| color | VARCHAR(7) | Hex color code |
| sort_order | INTEGER | Display order |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

**Indexes:**
- slug

---

### 4. **blog_authors**
Blog post authors.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR(255) | Author name |
| email | VARCHAR(255) | Email (unique) |
| avatar_url | TEXT | Profile image |
| role | VARCHAR(100) | Editor, Writer, Admin, etc. |
| bio | TEXT | Author biography |
| is_active | BOOLEAN | Active status |
| sort_order | INTEGER | Display order |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

**Indexes:**
- email

---

### 5. **blog_faqs**
FAQ items for blog posts.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| blog_id | UUID | Reference to blog_posts (cascade delete) |
| question | TEXT | FAQ question |
| answer | TEXT | FAQ answer |
| sort_order | INTEGER | Display order |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

**Indexes:**
- blog_id

---

## SEO Management Tables

### 6. **page_seo_metadata**
SEO analysis and metrics for pages.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| page_id | UUID | Reference to pages (unique) |
| h1_count | INTEGER | Number of H1 headings |
| h2_count | INTEGER | Number of H2 headings |
| h3_count | INTEGER | Number of H3 headings |
| internal_links_count | INTEGER | Internal link count |
| external_links_count | INTEGER | External link count |
| images_with_alt_count | INTEGER | Images with alt text |
| images_without_alt_count | INTEGER | Images missing alt text |
| has_canonical | BOOLEAN | Canonical URL present |
| has_open_graph | BOOLEAN | OG tags present |
| has_schema_markup | BOOLEAN | Schema.org markup present |
| last_seo_check | TIMESTAMPTZ | Last analysis timestamp |
| keywords_in_title | BOOLEAN | Keyword in title |
| keywords_in_description | BOOLEAN | Keyword in description |
| keywords_in_h1 | BOOLEAN | Keyword in H1 |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

---

### 7. **page_seo_keywords**
Keyword tracking and density for pages.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| page_id | UUID | Reference to pages |
| keyword | VARCHAR(255) | Keyword phrase |
| is_primary | BOOLEAN | Primary keyword flag |
| keyword_density | NUMERIC(5,2) | Density percentage |
| positions | TEXT[] | Positions in content |
| last_updated | TIMESTAMPTZ | Last update |
| created_at | TIMESTAMPTZ | Creation timestamp |

**Indexes:**
- page_id, keyword (unique per page)

---

### 8. **page_schema**
JSON-LD structured data for pages.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| page_id | UUID | Reference to pages (unique) |
| schema_type | VARCHAR(100) | BlogPosting, Article, Product, etc. |
| schema_data | JSONB | Complete schema.org JSON-LD |
| is_auto_generated | BOOLEAN | Generated vs manual |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

---

### 9. **blog_schema**
JSON-LD structured data for blog posts.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| blog_id | UUID | Reference to blog_posts (unique) |
| schema_type | VARCHAR(100) | BlogPosting (default) |
| schema_data | JSONB | Complete schema.org JSON-LD |
| is_auto_generated | BOOLEAN | Generated vs manual |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

---

## Publishing & Scheduling

### 10. **publishing_schedule**
Scheduled publication management.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| page_id | UUID | Reference to pages (nullable) |
| blog_id | UUID | Reference to blog_posts (nullable) |
| scheduled_at | TIMESTAMPTZ | Publish/unpublish time |
| action | VARCHAR(50) | publish, unpublish, update |
| scheduled_by | VARCHAR(255) | User who scheduled |
| status | VARCHAR(50) | scheduled, published, cancelled |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

**Constraint:** One of page_id or blog_id must be set (not both)

**Indexes:**
- scheduled_at, status

---

### 11. **blog_post_revisions**
Version history for blog posts.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| blog_id | UUID | Reference to blog_posts |
| revision_number | INTEGER | Version number |
| title | VARCHAR(255) | Article title snapshot |
| content | TEXT | Content snapshot |
| featured_image_url | TEXT | Image snapshot |
| meta_title | VARCHAR(255) | SEO title snapshot |
| meta_description | TEXT | Description snapshot |
| excerpt | TEXT | Excerpt snapshot |
| status | VARCHAR(50) | Status at revision |
| created_by | VARCHAR(255) | Revision author |
| created_at | TIMESTAMPTZ | Revision timestamp |

**Indexes:**
- blog_id, revision_number (unique per blog)

---

## Content Sections (Existing)

### 12. **page_hero**
Hero section for pages.

| Column | Type | Description |
|--------|------|-------------|
| page_id | UUID | Reference to pages (unique, one-to-one) |
| heading | TEXT | Main heading |
| subheading | TEXT | Subheading |
| description | TEXT | Description |
| cta_primary_text | VARCHAR(100) | Call-to-action text |
| cta_primary_link | VARCHAR(255) | CTA link |
| cta_secondary_text | VARCHAR(100) | Secondary CTA |
| cta_secondary_link | VARCHAR(255) | Secondary CTA link |
| video_embed_url | TEXT | Embedded video URL |

---

### 13. **page_stats**
Statistics for pages (counters, metrics).

---

### 14. **pricing_packages** & **pricing_features**
Pricing table management.

---

### 15. **process_steps**
Process/workflow steps for pages.

---

### 16. **page_scope_cards**
Scope/capability cards.

---

### 17. **testimonials**, **video_testimonials**
Customer testimonials (global).

---

### 18. **faqs**
Global FAQ items (page_id can be NULL for global).

---

## Contact & Forms

### 19. **contact_submissions**
Form submissions from visitors.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| first_name | VARCHAR(100) | First name |
| last_name | VARCHAR(100) | Last name |
| email | VARCHAR(255) | Email address |
| phone | VARCHAR(20) | Phone number |
| service_interested | VARCHAR(255) | Service type |
| budget_range | VARCHAR(100) | Budget range |
| message | TEXT | Message content |
| source_page_slug | VARCHAR(255) | Where form was submitted |
| status | TEXT | new, contacted, closed |
| created_at | TIMESTAMPTZ | Submission timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

**Indexes:**
- status, email

---

## Admin & Navigation

### 20. **navbar_menu_items**
Navigation menu items.

### 21. **footer_columns** & **footer_links**
Footer navigation structure.

### 22. **site_settings**
Global site configuration.

### 23. **redirects**
URL redirects (301, 302).

### 24. **media_library**
Uploaded images and files.

### 25. **profiles**
Admin user profiles (auth.users reference).

---

## Relationships Diagram

```
blog_posts ──┬──→ blog_categories
             ├──→ blog_authors
             ├──→ blog_faqs (1:many)
             ├──→ blog_schema
             ├──→ blog_post_revisions (1:many)
             └──→ publishing_schedule

pages ───────┬──→ page_hero (1:1)
             ├──→ page_stats (1:many)
             ├──→ page_seo_metadata (1:1)
             ├──→ page_seo_keywords (1:many)
             ├──→ page_schema
             ├──→ faqs (1:many)
             ├──→ pricing_packages (1:many)
             ├──→ process_steps (1:many)
             ├──→ page_scope_cards (1:many)
             ├──→ publishing_schedule
             └──→ pages (self-join for parent_page_id)

footer_columns ──→ footer_links (1:many)
```

---

## Usage Examples

### Create a Blog Post with SEO

```sql
-- Insert blog post
INSERT INTO blog_posts (
  title, slug, content, excerpt, category_id, author_id,
  featured_image_url, featured_image_alt_text,
  focus_keyword, meta_title, meta_description,
  og_title, og_description,
  status, published_at
) VALUES (
  'Best Bridal Dresses in Pakistan',
  'best-bridal-dresses-pakistan',
  '<h2>Introduction</h2><p>Content here...</p>',
  'Discover latest bridal dress styles in Pakistan',
  (SELECT id FROM blog_categories WHERE slug = 'bridal'),
  (SELECT id FROM blog_authors WHERE email = 'sarah.khan@example.com'),
  'https://example.com/image.jpg',
  'Red Pakistani bridal dress with embroidery',
  'bridal dresses pakistan',
  'Best Bridal Dresses in Pakistan | 2026 Guide',
  'Explore latest bridal dress styles in Pakistan...',
  'Best Bridal Dresses in Pakistan | 2026 Guide',
  'Discover the latest designs...',
  'published',
  now()
);

-- Insert structured data
INSERT INTO blog_schema (blog_id, schema_type, schema_data)
SELECT id, 'BlogPosting', '{"@context":"https://schema.org","@type":"BlogPosting","headline":"...","articleBody":"..."}'::jsonb
FROM blog_posts WHERE slug = 'best-bridal-dresses-pakistan';

-- Insert FAQs
INSERT INTO blog_faqs (blog_id, question, answer, sort_order) 
SELECT id, 'What are popular styles?', 'Traditional lehenga, sharara...', 1
FROM blog_posts WHERE slug = 'best-bridal-dresses-pakistan';
```

### Schedule a Page for Publication

```sql
INSERT INTO publishing_schedule (page_id, scheduled_at, action, scheduled_by)
VALUES (
  (SELECT id FROM pages WHERE slug = 'seo-services'),
  '2026-08-25 10:00:00+00',
  'publish',
  'admin@example.com'
);
```

### Get Page SEO Status

```sql
SELECT 
  p.slug,
  p.meta_title,
  p.seo_score,
  m.keywords_in_title,
  m.has_canonical,
  m.has_open_graph,
  ARRAY_AGG(k.keyword) as keywords
FROM pages p
LEFT JOIN page_seo_metadata m ON p.id = m.page_id
LEFT JOIN page_seo_keywords k ON p.id = k.page_id AND k.is_primary = true
WHERE p.status = 'published'
GROUP BY p.id, p.slug, p.meta_title, p.seo_score, m.keywords_in_title, m.has_canonical, m.has_open_graph
ORDER BY p.seo_score DESC;
```

---

## Data Integrity

### Cascading Deletes
- Deleting a blog post cascades to: blog_faqs, blog_schema, blog_post_revisions, publishing_schedule
- Deleting a page cascades to: page_hero, page_stats, page_seo_metadata, page_seo_keywords, page_schema, faqs, pricing_packages, process_steps, page_scope_cards, publishing_schedule

### Unique Constraints
- pages.slug (globally unique)
- blog_posts.slug (globally unique)
- blog_categories.name, slug (unique)
- blog_authors.email (unique)
- page_schema.page_id (one schema per page)
- blog_schema.blog_id (one schema per blog)
- page_seo_metadata.page_id (one metadata per page)
- page_seo_keywords (page_id, keyword) unique together

---

## Triggers

All tables have automatic `updated_at` timestamp management via the `update_updated_at()` function.

---

## Performance Optimization

### Recommended Indexes
All primary access patterns have indexes:
- Status filtering: pages(status), blog_posts(status)
- Slug lookups: pages(slug), blog_posts(slug)
- Category filtering: blog_posts(category_id)
- Date range queries: blog_posts(published_at), publishing_schedule(scheduled_at)
- SEO queries: pages(seo_score), pages(focus_keyword)

### Query Performance Tips
1. Always filter by status when listing pages/posts
2. Use indexes for slug-based lookups
3. Denormalize SEO score to pages/blog_posts for sorting
4. Archive old revisions periodically
5. Index JSON fields in schema tables if querying them frequently

---

## Migration Notes

**Migration 0001:** Initial schema with core tables
**Migration 0002:** Row-level security policies
**Migration 0003:** Development permissions
**Migration 0004:** Blog editor enhancements and SEO management

To apply migrations to Supabase:
```bash
supabase db push
```

---

## Future Enhancements

- Analytics integration (traffic, bounce rate, conversions)
- A/B testing framework (page variants)
- Content suggestions AI (keyword gaps, readability)
- Multi-language support (translations table)
- Content approval workflow (submission, review, approval)
- SEO audit scheduling (automated checks)
