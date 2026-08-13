-- ============================================================================
-- UPDATE PRICING AND SCOPE CARDS SCHEMA
-- ============================================================================

-- Update service_scope_cards: Change from image_url to icon_text
ALTER TABLE service_scope_cards DROP COLUMN IF EXISTS image_url;
ALTER TABLE service_scope_cards ADD COLUMN icon_text VARCHAR(50);

-- Verify service_pricing has subtitle (it should already be there)
-- If subtitle doesn't exist, uncomment below:
-- ALTER TABLE service_pricing ADD COLUMN subtitle VARCHAR(255);

-- ============================================================================
-- VERIFY TABLES STRUCTURE
-- ============================================================================

-- Service Pricing Table (should have all these fields)
-- id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
-- service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
-- name VARCHAR(100) NOT NULL,
-- subtitle VARCHAR(255),
-- price VARCHAR(50),
-- currency VARCHAR(10) DEFAULT 'PKR',
-- billing_period VARCHAR(50) DEFAULT 'Month',
-- is_popular BOOLEAN DEFAULT false,
-- sort_order INTEGER DEFAULT 0,
-- created_at TIMESTAMPTZ DEFAULT now(),
-- updated_at TIMESTAMPTZ DEFAULT now()

-- Service Pricing Features Table (should have all these fields)
-- id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
-- package_id UUID NOT NULL REFERENCES service_pricing(id) ON DELETE CASCADE,
-- feature_text TEXT NOT NULL,
-- is_disabled BOOLEAN DEFAULT false,
-- sort_order INTEGER DEFAULT 0,
-- created_at TIMESTAMPTZ DEFAULT now()

-- Service Scope Cards Table (UPDATED - now uses icon_text instead of image_url)
-- id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
-- service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
-- icon_text VARCHAR(50),
-- title VARCHAR(255) NOT NULL,
-- description TEXT,
-- sort_order INTEGER DEFAULT 0,
-- created_at TIMESTAMPTZ DEFAULT now(),
-- updated_at TIMESTAMPTZ DEFAULT now()

-- ============================================================================
-- SAMPLE DATA FOR TESTING
-- ============================================================================

-- Get the web-dev service ID (replace with your actual service ID)
-- SELECT id FROM services WHERE slug = 'web-dev' LIMIT 1;

-- Sample Scope Cards for Local template
INSERT INTO service_scope_cards (service_id, icon_text, title, description, sort_order)
VALUES
  ((SELECT id FROM services WHERE slug = 'web-dev' LIMIT 1), 'G', 'Google Business Profile Optimization', 'Improve your business listing to rank higher on Google Maps and local search with NAP checks, categories, services and keywords.', 1),
  ((SELECT id FROM services WHERE slug = 'web-dev' LIMIT 1), '🏢', 'Local Website On-Page SEO', 'Optimize location pages, metadata, local keywords, internal links, schema and maps embeds to boost local rankings.', 2),
  ((SELECT id FROM services WHERE slug = 'web-dev' LIMIT 1), '🔗', 'Local Off-Page SEO & Citations', 'Build high-quality local citations, local backlinks and authority signals to increase trust in Google''s local algorithm.', 3);

-- Sample Pricing Packages for Local template
INSERT INTO service_pricing (service_id, name, subtitle, price, currency, billing_period, is_popular, sort_order)
VALUES
  ((SELECT id FROM services WHERE slug = 'web-dev' LIMIT 1), 'Starter', 'For 1 Location Profile', '29,999', 'PKR', 'Month', false, 1),
  ((SELECT id FROM services WHERE slug = 'web-dev' LIMIT 1), 'Popular', 'Up to 2 Location Profiles', '49,999', 'PKR', 'Month', true, 2),
  ((SELECT id FROM services WHERE slug = 'web-dev' LIMIT 1), 'Advanced', 'Up to 4 Location Profiles', '89,999', 'PKR', 'Month', false, 3);

-- Sample Features for Starter Package
INSERT INTO service_pricing_features (package_id, feature_text, is_disabled, sort_order)
SELECT id, 'Setup Google Business Profile', false, 1 FROM service_pricing WHERE name = 'Starter' AND service_id = (SELECT id FROM services WHERE slug = 'web-dev' LIMIT 1) LIMIT 1
UNION ALL
SELECT id, 'Complete GBP Audit', false, 2 FROM service_pricing WHERE name = 'Starter' AND service_id = (SELECT id FROM services WHERE slug = 'web-dev' LIMIT 1) LIMIT 1
UNION ALL
SELECT id, 'Competitor GBP Research', false, 3 FROM service_pricing WHERE name = 'Starter' AND service_id = (SELECT id FROM services WHERE slug = 'web-dev' LIMIT 1) LIMIT 1
UNION ALL
SELECT id, 'NAP Details Optimization', false, 4 FROM service_pricing WHERE name = 'Starter' AND service_id = (SELECT id FROM services WHERE slug = 'web-dev' LIMIT 1) LIMIT 1
UNION ALL
SELECT id, 'Business Logo & Cover Image', false, 5 FROM service_pricing WHERE name = 'Starter' AND service_id = (SELECT id FROM services WHERE slug = 'web-dev' LIMIT 1) LIMIT 1
UNION ALL
SELECT id, 'Primary & Secondary Categories', false, 6 FROM service_pricing WHERE name = 'Starter' AND service_id = (SELECT id FROM services WHERE slug = 'web-dev' LIMIT 1) LIMIT 1
UNION ALL
SELECT id, 'Opening Hours Setup', false, 7 FROM service_pricing WHERE name = 'Starter' AND service_id = (SELECT id FROM services WHERE slug = 'web-dev' LIMIT 1) LIMIT 1
UNION ALL
SELECT id, 'Optimized Business Description', false, 8 FROM service_pricing WHERE name = 'Starter' AND service_id = (SELECT id FROM services WHERE slug = 'web-dev' LIMIT 1) LIMIT 1
UNION ALL
SELECT id, 'Service Areas Setup', false, 9 FROM service_pricing WHERE name = 'Starter' AND service_id = (SELECT id FROM services WHERE slug = 'web-dev' LIMIT 1) LIMIT 1
UNION ALL
SELECT id, 'Monthly Audit', false, 10 FROM service_pricing WHERE name = 'Starter' AND service_id = (SELECT id FROM services WHERE slug = 'web-dev' LIMIT 1) LIMIT 1
UNION ALL
SELECT id, 'Publish 1 Location Page', false, 11 FROM service_pricing WHERE name = 'Starter' AND service_id = (SELECT id FROM services WHERE slug = 'web-dev' LIMIT 1) LIMIT 1
UNION ALL
SELECT id, 'Create 50 Local Citations', false, 12 FROM service_pricing WHERE name = 'Starter' AND service_id = (SELECT id FROM services WHERE slug = 'web-dev' LIMIT 1) LIMIT 1;

-- Sample Features for Popular Package (Same as Starter + More)
INSERT INTO service_pricing_features (package_id, feature_text, is_disabled, sort_order)
SELECT id, 'Everything in Basic', false, 1 FROM service_pricing WHERE name = 'Popular' AND service_id = (SELECT id FROM services WHERE slug = 'web-dev' LIMIT 1) LIMIT 1
UNION ALL
SELECT id, '2 Location Pages On Website', false, 2 FROM service_pricing WHERE name = 'Popular' AND service_id = (SELECT id FROM services WHERE slug = 'web-dev' LIMIT 1) LIMIT 1
UNION ALL
SELECT id, 'Social Media Profiles Setup', false, 3 FROM service_pricing WHERE name = 'Popular' AND service_id = (SELECT id FROM services WHERE slug = 'web-dev' LIMIT 1) LIMIT 1
UNION ALL
SELECT id, 'Instant WhatsApp Contact', false, 4 FROM service_pricing WHERE name = 'Popular' AND service_id = (SELECT id FROM services WHERE slug = 'web-dev' LIMIT 1) LIMIT 1
UNION ALL
SELECT id, 'Interior Images/Videos', false, 5 FROM service_pricing WHERE name = 'Popular' AND service_id = (SELECT id FROM services WHERE slug = 'web-dev' LIMIT 1) LIMIT 1
UNION ALL
SELECT id, 'Respond to All Reviews', false, 6 FROM service_pricing WHERE name = 'Popular' AND service_id = (SELECT id FROM services WHERE slug = 'web-dev' LIMIT 1) LIMIT 1
UNION ALL
SELECT id, 'FAQ Keyword Research', false, 7 FROM service_pricing WHERE name = 'Popular' AND service_id = (SELECT id FROM services WHERE slug = 'web-dev' LIMIT 1) LIMIT 1
UNION ALL
SELECT id, 'Q&A Content', false, 8 FROM service_pricing WHERE name = 'Popular' AND service_id = (SELECT id FROM services WHERE slug = 'web-dev' LIMIT 1) LIMIT 1
UNION ALL
SELECT id, 'Track Keywords Performance', false, 9 FROM service_pricing WHERE name = 'Popular' AND service_id = (SELECT id FROM services WHERE slug = 'web-dev' LIMIT 1) LIMIT 1
UNION ALL
SELECT id, 'Monthly 8 Update Posts', false, 10 FROM service_pricing WHERE name = 'Popular' AND service_id = (SELECT id FROM services WHERE slug = 'web-dev' LIMIT 1) LIMIT 1
UNION ALL
SELECT id, 'Create 100 Local Citations', false, 11 FROM service_pricing WHERE name = 'Popular' AND service_id = (SELECT id FROM services WHERE slug = 'web-dev' LIMIT 1) LIMIT 1;

-- Sample Features for Advanced Package
INSERT INTO service_pricing_features (package_id, feature_text, is_disabled, sort_order)
SELECT id, 'Everything in Standard', false, 1 FROM service_pricing WHERE name = 'Advanced' AND service_id = (SELECT id FROM services WHERE slug = 'web-dev' LIMIT 1) LIMIT 1
UNION ALL
SELECT id, '4 Location Pages On Website', false, 2 FROM service_pricing WHERE name = 'Advanced' AND service_id = (SELECT id FROM services WHERE slug = 'web-dev' LIMIT 1) LIMIT 1
UNION ALL
SELECT id, 'Advanced GBP Optimization', false, 3 FROM service_pricing WHERE name = 'Advanced' AND service_id = (SELECT id FROM services WHERE slug = 'web-dev' LIMIT 1) LIMIT 1
UNION ALL
SELECT id, 'Products & Services Optimization', false, 4 FROM service_pricing WHERE name = 'Advanced' AND service_id = (SELECT id FROM services WHERE slug = 'web-dev' LIMIT 1) LIMIT 1
UNION ALL
SELECT id, 'Monthly 12 Update Posts', false, 5 FROM service_pricing WHERE name = 'Advanced' AND service_id = (SELECT id FROM services WHERE slug = 'web-dev' LIMIT 1) LIMIT 1
UNION ALL
SELECT id, '150 Local Citations', false, 6 FROM service_pricing WHERE name = 'Advanced' AND service_id = (SELECT id FROM services WHERE slug = 'web-dev' LIMIT 1) LIMIT 1
UNION ALL
SELECT id, 'Priority Support', false, 7 FROM service_pricing WHERE name = 'Advanced' AND service_id = (SELECT id FROM services WHERE slug = 'web-dev' LIMIT 1) LIMIT 1
UNION ALL
SELECT id, 'Growth Strategy Consultation', false, 8 FROM service_pricing WHERE name = 'Advanced' AND service_id = (SELECT id FROM services WHERE slug = 'web-dev' LIMIT 1) LIMIT 1
UNION ALL
SELECT id, 'Performance Tracking', false, 9 FROM service_pricing WHERE name = 'Advanced' AND service_id = (SELECT id FROM services WHERE slug = 'web-dev' LIMIT 1) LIMIT 1
UNION ALL
SELECT id, 'Full Local SEO Management', false, 10 FROM service_pricing WHERE name = 'Advanced' AND service_id = (SELECT id FROM services WHERE slug = 'web-dev' LIMIT 1) LIMIT 1;

-- Sample FAQs for Local template
INSERT INTO service_faqs (service_id, question, answer, sort_order)
VALUES
  ((SELECT id FROM services WHERE slug = 'web-dev' LIMIT 1), 'What is Local SEO?', 'Local SEO helps your business appear in Google Search and Google Maps when nearby customers are actively searching for your products or services. We optimize your online presence to improve visibility, trust, traffic and conversions.', 1),
  ((SELECT id FROM services WHERE slug = 'web-dev' LIMIT 1), 'How long does it take to see results?', 'Local SEO is a long-term strategy. Most businesses see initial improvements in 30-60 days, with significant results typically appearing within 3-6 months. Consistent optimization and reputation management accelerate results.', 2),
  ((SELECT id FROM services WHERE slug = 'web-dev' LIMIT 1), 'Do you guarantee first page ranking?', 'No reputable SEO company guarantees rankings. Search algorithms constantly change and rankings depend on many factors. We focus on best practices and proven strategies to improve your visibility consistently.', 3),
  ((SELECT id FROM services WHERE slug = 'web-dev' LIMIT 1), 'What areas do you serve?', 'We work with businesses nationwide. Our local SEO strategies work for businesses serving one location or multiple cities across Pakistan and internationally.', 4);

-- ============================================================================
-- SUCCESS
-- ============================================================================
-- If you see this, the updates were successful!
-- Now you can:
-- 1. Go to /admin/services and edit the "web-dev" service
-- 2. Click through each tab (Scope, Pricing, FAQs)
-- 3. View /service/web-dev to see your data rendered
