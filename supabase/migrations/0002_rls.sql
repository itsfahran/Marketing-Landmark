-- Row Level Security (RLS) Policies for all tables

-- ============================================================================
-- Helper: Check if user is admin/editor
-- ============================================================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'editor')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- PAGES — public read (published only), admin full CRUD
-- ============================================================================

ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pages_public_read" ON pages
  FOR SELECT
  USING (status = 'published');

CREATE POLICY "pages_admin_crud" ON pages
  FOR ALL
  USING (is_admin());

-- ============================================================================
-- PAGE_HERO — public read (via published page), admin CRUD
-- ============================================================================

ALTER TABLE page_hero ENABLE ROW LEVEL SECURITY;

CREATE POLICY "page_hero_public_read" ON page_hero
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM pages
    WHERE pages.id = page_hero.page_id
    AND pages.status = 'published'
  ));

CREATE POLICY "page_hero_admin_crud" ON page_hero
  FOR ALL
  USING (is_admin());

-- ============================================================================
-- PAGE_STATS — public read (via published page), admin CRUD
-- ============================================================================

ALTER TABLE page_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "page_stats_public_read" ON page_stats
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM pages
    WHERE pages.id = page_stats.page_id
    AND pages.status = 'published'
  ));

CREATE POLICY "page_stats_admin_crud" ON page_stats
  FOR ALL
  USING (is_admin());

-- ============================================================================
-- PRICING_PACKAGES — public read (via published page), admin CRUD
-- ============================================================================

ALTER TABLE pricing_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pricing_packages_public_read" ON pricing_packages
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM pages
    WHERE pages.id = pricing_packages.page_id
    AND pages.status = 'published'
  ));

CREATE POLICY "pricing_packages_admin_crud" ON pricing_packages
  FOR ALL
  USING (is_admin());

-- ============================================================================
-- PRICING_FEATURES — public read (via published page), admin CRUD
-- ============================================================================

ALTER TABLE pricing_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pricing_features_public_read" ON pricing_features
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM pricing_packages pp
    JOIN pages ON pages.id = pp.page_id
    WHERE pp.id = pricing_features.package_id
    AND pages.status = 'published'
  ));

CREATE POLICY "pricing_features_admin_crud" ON pricing_features
  FOR ALL
  USING (is_admin());

-- ============================================================================
-- PROCESS_STEPS — public read (via published page), admin CRUD
-- ============================================================================

ALTER TABLE process_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "process_steps_public_read" ON process_steps
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM pages
    WHERE pages.id = process_steps.page_id
    AND pages.status = 'published'
  ));

CREATE POLICY "process_steps_admin_crud" ON process_steps
  FOR ALL
  USING (is_admin());

-- ============================================================================
-- TOOL_ITEMS — public read (via published page), admin CRUD
-- ============================================================================

ALTER TABLE tool_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tool_items_public_read" ON tool_items
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM pages
    WHERE pages.id = tool_items.page_id
    AND pages.status = 'published'
  ));

CREATE POLICY "tool_items_admin_crud" ON tool_items
  FOR ALL
  USING (is_admin());

-- ============================================================================
-- PAGE_SCOPE_CARDS — public read (via published page), admin CRUD
-- ============================================================================

ALTER TABLE page_scope_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "page_scope_cards_public_read" ON page_scope_cards
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM pages
    WHERE pages.id = page_scope_cards.page_id
    AND pages.status = 'published'
  ));

CREATE POLICY "page_scope_cards_admin_crud" ON page_scope_cards
  FOR ALL
  USING (is_admin());

-- ============================================================================
-- TESTIMONIALS — always public read, admin CRUD
-- ============================================================================

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "testimonials_public_read" ON testimonials FOR SELECT USING (true);
CREATE POLICY "testimonials_admin_crud" ON testimonials FOR ALL USING (is_admin());

-- ============================================================================
-- VIDEO_TESTIMONIALS — always public read, admin CRUD
-- ============================================================================

ALTER TABLE video_testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "video_testimonials_public_read" ON video_testimonials FOR SELECT USING (true);
CREATE POLICY "video_testimonials_admin_crud" ON video_testimonials FOR ALL USING (is_admin());

-- ============================================================================
-- CHOOSE_FEATURES — always public read, admin CRUD
-- ============================================================================

ALTER TABLE choose_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "choose_features_public_read" ON choose_features FOR SELECT USING (true);
CREATE POLICY "choose_features_admin_crud" ON choose_features FOR ALL USING (is_admin());

-- ============================================================================
-- FAQS — public read (all, but global and published-page-scoped), admin CRUD
-- ============================================================================

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "faqs_public_read" ON faqs
  FOR SELECT
  USING (
    page_id IS NULL
    OR EXISTS (
      SELECT 1 FROM pages
      WHERE pages.id = faqs.page_id
      AND pages.status = 'published'
    )
  );

CREATE POLICY "faqs_admin_crud" ON faqs
  FOR ALL
  USING (is_admin());

-- ============================================================================
-- BRANDS — always public read, admin CRUD
-- ============================================================================

ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "brands_public_read" ON brands FOR SELECT USING (true);
CREATE POLICY "brands_admin_crud" ON brands FOR ALL USING (is_admin());

-- ============================================================================
-- PORTFOLIO_ITEMS — public read (published only), admin CRUD
-- ============================================================================

ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "portfolio_items_public_read" ON portfolio_items
  FOR SELECT
  USING (status = 'published');

CREATE POLICY "portfolio_items_admin_crud" ON portfolio_items
  FOR ALL
  USING (is_admin());

-- ============================================================================
-- BLOG_POSTS — public read (published only), admin CRUD
-- ============================================================================

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "blog_posts_public_read" ON blog_posts
  FOR SELECT
  USING (status = 'published');

CREATE POLICY "blog_posts_admin_crud" ON blog_posts
  FOR ALL
  USING (is_admin());

-- ============================================================================
-- TEAM_MEMBERS — always public read, admin CRUD
-- ============================================================================

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "team_members_public_read" ON team_members FOR SELECT USING (true);
CREATE POLICY "team_members_admin_crud" ON team_members FOR ALL USING (is_admin());

-- ============================================================================
-- ACHIEVEMENTS — always public read, admin CRUD
-- ============================================================================

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "achievements_public_read" ON achievements FOR SELECT USING (true);
CREATE POLICY "achievements_admin_crud" ON achievements FOR ALL USING (is_admin());

-- ============================================================================
-- MISSION_CARDS — always public read, admin CRUD
-- ============================================================================

ALTER TABLE mission_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "mission_cards_public_read" ON mission_cards FOR SELECT USING (true);
CREATE POLICY "mission_cards_admin_crud" ON mission_cards FOR ALL USING (is_admin());

-- ============================================================================
-- GIGS — always public read, admin CRUD
-- ============================================================================

ALTER TABLE gigs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "gigs_public_read" ON gigs FOR SELECT USING (true);
CREATE POLICY "gigs_admin_crud" ON gigs FOR ALL USING (is_admin());

-- ============================================================================
-- CONTACT_SUBMISSIONS — anon insert only, admin read/update
-- ============================================================================

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contact_submissions_anon_insert" ON contact_submissions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "contact_submissions_admin_read_update" ON contact_submissions
  FOR SELECT
  USING (is_admin());

CREATE POLICY "contact_submissions_admin_update" ON contact_submissions
  FOR UPDATE
  USING (is_admin());

-- ============================================================================
-- SERVICE_OPTIONS — always public read, admin CRUD
-- ============================================================================

ALTER TABLE service_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_options_public_read" ON service_options FOR SELECT USING (true);
CREATE POLICY "service_options_admin_crud" ON service_options FOR ALL USING (is_admin());

-- ============================================================================
-- NAVBAR_MENU_ITEMS — always public read, admin CRUD
-- ============================================================================

ALTER TABLE navbar_menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "navbar_menu_items_public_read" ON navbar_menu_items FOR SELECT USING (true);
CREATE POLICY "navbar_menu_items_admin_crud" ON navbar_menu_items FOR ALL USING (is_admin());

-- ============================================================================
-- FOOTER_COLUMNS — always public read, admin CRUD
-- ============================================================================

ALTER TABLE footer_columns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "footer_columns_public_read" ON footer_columns FOR SELECT USING (true);
CREATE POLICY "footer_columns_admin_crud" ON footer_columns FOR ALL USING (is_admin());

-- ============================================================================
-- FOOTER_LINKS — always public read, admin CRUD
-- ============================================================================

ALTER TABLE footer_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "footer_links_public_read" ON footer_links FOR SELECT USING (true);
CREATE POLICY "footer_links_admin_crud" ON footer_links FOR ALL USING (is_admin());

-- ============================================================================
-- SITE_SETTINGS — always public read, admin CRUD
-- ============================================================================

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "site_settings_public_read" ON site_settings FOR SELECT USING (true);
CREATE POLICY "site_settings_admin_crud" ON site_settings FOR ALL USING (is_admin());

-- ============================================================================
-- REDIRECTS — always public read, admin CRUD
-- ============================================================================

ALTER TABLE redirects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "redirects_public_read" ON redirects FOR SELECT USING (true);
CREATE POLICY "redirects_admin_crud" ON redirects FOR ALL USING (is_admin());

-- ============================================================================
-- MEDIA_LIBRARY — always public read, admin CRUD
-- ============================================================================

ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "media_library_public_read" ON media_library FOR SELECT USING (true);
CREATE POLICY "media_library_admin_crud" ON media_library FOR ALL USING (is_admin());

-- ============================================================================
-- PROFILES — admin only
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_admin_crud" ON profiles FOR ALL USING (is_admin());
