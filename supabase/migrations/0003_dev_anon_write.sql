-- Development-only: Allow anonymous users to write to all tables for testing
-- This is temporary and should be replaced with proper authentication before production

-- Allow anon to write to pages
DROP POLICY IF EXISTS "pages_admin_crud" ON pages;
CREATE POLICY "pages_all_crud" ON pages
  FOR ALL
  USING (true);

-- Allow anon to write to page_hero
DROP POLICY IF EXISTS "page_hero_admin_crud" ON page_hero;
CREATE POLICY "page_hero_all_crud" ON page_hero
  FOR ALL
  USING (true);

-- Allow anon to write to page_stats
DROP POLICY IF EXISTS "page_stats_admin_crud" ON page_stats;
CREATE POLICY "page_stats_all_crud" ON page_stats
  FOR ALL
  USING (true);

-- Allow anon to write to pricing_packages
DROP POLICY IF EXISTS "pricing_packages_admin_crud" ON pricing_packages;
CREATE POLICY "pricing_packages_all_crud" ON pricing_packages
  FOR ALL
  USING (true);

-- Allow anon to write to pricing_features
DROP POLICY IF EXISTS "pricing_features_admin_crud" ON pricing_features;
CREATE POLICY "pricing_features_all_crud" ON pricing_features
  FOR ALL
  USING (true);

-- Allow anon to write to process_steps
DROP POLICY IF EXISTS "process_steps_admin_crud" ON process_steps;
CREATE POLICY "process_steps_all_crud" ON process_steps
  FOR ALL
  USING (true);

-- Allow anon to write to tool_items
DROP POLICY IF EXISTS "tool_items_admin_crud" ON tool_items;
CREATE POLICY "tool_items_all_crud" ON tool_items
  FOR ALL
  USING (true);

-- Allow anon to write to page_scope_cards
DROP POLICY IF EXISTS "page_scope_cards_admin_crud" ON page_scope_cards;
CREATE POLICY "page_scope_cards_all_crud" ON page_scope_cards
  FOR ALL
  USING (true);

-- Allow anon to write to testimonials
DROP POLICY IF EXISTS "testimonials_admin_crud" ON testimonials;
CREATE POLICY "testimonials_all_crud" ON testimonials
  FOR ALL
  USING (true);

-- Allow anon to write to video_testimonials
DROP POLICY IF EXISTS "video_testimonials_admin_crud" ON video_testimonials;
CREATE POLICY "video_testimonials_all_crud" ON video_testimonials
  FOR ALL
  USING (true);

-- Allow anon to write to choose_features
DROP POLICY IF EXISTS "choose_features_admin_crud" ON choose_features;
CREATE POLICY "choose_features_all_crud" ON choose_features
  FOR ALL
  USING (true);

-- Allow anon to write to faqs
DROP POLICY IF EXISTS "faqs_admin_crud" ON faqs;
CREATE POLICY "faqs_all_crud" ON faqs
  FOR ALL
  USING (true);

-- Allow anon to write to brands
DROP POLICY IF EXISTS "brands_admin_crud" ON brands;
CREATE POLICY "brands_all_crud" ON brands
  FOR ALL
  USING (true);

-- Allow anon to write to portfolio_items
DROP POLICY IF EXISTS "portfolio_items_admin_crud" ON portfolio_items;
CREATE POLICY "portfolio_items_all_crud" ON portfolio_items
  FOR ALL
  USING (true);

-- Allow anon to write to blog_posts
DROP POLICY IF EXISTS "blog_posts_admin_crud" ON blog_posts;
CREATE POLICY "blog_posts_all_crud" ON blog_posts
  FOR ALL
  USING (true);

-- Allow anon to write to team_members
DROP POLICY IF EXISTS "team_members_admin_crud" ON team_members;
CREATE POLICY "team_members_all_crud" ON team_members
  FOR ALL
  USING (true);

-- Allow anon to write to achievements
DROP POLICY IF EXISTS "achievements_admin_crud" ON achievements;
CREATE POLICY "achievements_all_crud" ON achievements
  FOR ALL
  USING (true);

-- Allow anon to write to mission_cards
DROP POLICY IF EXISTS "mission_cards_admin_crud" ON mission_cards;
CREATE POLICY "mission_cards_all_crud" ON mission_cards
  FOR ALL
  USING (true);

-- Allow anon to write to gigs
DROP POLICY IF EXISTS "gigs_admin_crud" ON gigs;
CREATE POLICY "gigs_all_crud" ON gigs
  FOR ALL
  USING (true);

-- Allow anon to write to service_options
DROP POLICY IF EXISTS "service_options_admin_crud" ON service_options;
CREATE POLICY "service_options_all_crud" ON service_options
  FOR ALL
  USING (true);

-- Allow anon to write to navbar_menu_items
DROP POLICY IF EXISTS "navbar_menu_items_admin_crud" ON navbar_menu_items;
CREATE POLICY "navbar_menu_items_all_crud" ON navbar_menu_items
  FOR ALL
  USING (true);

-- Allow anon to write to footer_columns
DROP POLICY IF EXISTS "footer_columns_admin_crud" ON footer_columns;
CREATE POLICY "footer_columns_all_crud" ON footer_columns
  FOR ALL
  USING (true);

-- Allow anon to write to footer_links
DROP POLICY IF EXISTS "footer_links_admin_crud" ON footer_links;
CREATE POLICY "footer_links_all_crud" ON footer_links
  FOR ALL
  USING (true);

-- Allow anon to write to site_settings
DROP POLICY IF EXISTS "site_settings_admin_crud" ON site_settings;
CREATE POLICY "site_settings_all_crud" ON site_settings
  FOR ALL
  USING (true);

-- Allow anon to write to redirects
DROP POLICY IF EXISTS "redirects_admin_crud" ON redirects;
CREATE POLICY "redirects_all_crud" ON redirects
  FOR ALL
  USING (true);

-- Allow anon to write to media_library
DROP POLICY IF EXISTS "media_library_admin_crud" ON media_library;
CREATE POLICY "media_library_all_crud" ON media_library
  FOR ALL
  USING (true);
