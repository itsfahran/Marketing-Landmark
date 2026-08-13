-- ========== ABOUT PAGE TABLES ==========

-- About Page Hero Section
CREATE TABLE about_page_hero (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  badge TEXT,
  heading TEXT,
  description TEXT,
  stat_1_value TEXT,
  stat_1_label TEXT,
  stat_2_value TEXT,
  stat_2_label TEXT,
  stat_3_value TEXT,
  stat_3_label TEXT,
  button_1_text TEXT,
  button_1_link TEXT,
  button_2_text TEXT,
  button_2_link TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- About Page Marquee Text
CREATE TABLE about_page_marquee (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- About Page Mission, Vision, Values
CREATE TABLE about_page_mission_values (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL, -- 'mission', 'vision', 'values'
  icon_url TEXT,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- About Page Team Members
CREATE TABLE about_page_team (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- About Page Achievements
CREATE TABLE about_page_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon TEXT,
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========== SEED DATA ==========

-- Hero Section
INSERT INTO about_page_hero (badge, heading, description, stat_1_value, stat_1_label, stat_2_value, stat_2_label, stat_3_value, stat_3_label, button_1_text, button_1_link, button_2_text, button_2_link, image_url) VALUES
('About SEO Professional', 'About', 'Farhan Ali is an experienced and certified Professional SEO Expert in Pakistan with over 5 years of experience in SEO, with expertise in GEO, AEO, AI Search Engine Optimization, and Local SEO. I''ve worked with top global IT and digital marketing companies as an SEO Expert, as well as international clients, helping to rank websites on Google''s 1st page, completing 150+ projects focused on improving online visibility, organic traffic, and business growth.', '5+', 'Years Experience', '150+', 'Projects Completed', '1st', 'Page Ranking', 'Portfolio', '/portfolio', 'Services', '/#services', 'hero.png');

-- Marquee Text
INSERT INTO about_page_marquee (text, sort_order) VALUES
('Professional SEO Expert', 0),
('Local SEO Services', 1),
('Generative AI Search Engine Optimization', 2),
('Google Ranking Expert', 3),
('AI SEO Optimization', 4);

-- Mission, Vision, Values
INSERT INTO about_page_mission_values (type, icon_url, title, description, sort_order) VALUES
('mission', 'https://cdn-icons-png.flaticon.com/512/1828/1828911.png', 'Our Mission', 'Provide transparent and result-driven services to help businesses grow online, improve visibility, and achieve measurable success.', 0),
('vision', 'https://cdn-icons-png.flaticon.com/512/3135/3135706.png', 'Our Vision', 'Help businesses achieve digital growth, generate sales, and build strong brand value through proven SEO, GEO, Local SEO, and Digital Marketing strategies.', 1),
('values', 'https://cdn-icons-png.flaticon.com/512/3588/3588614.png', 'Our Values', 'We value transparency, integrity, and client success, delivering high-quality, innovative solutions that drive measurable results and long-term digital growth.', 2);

-- Team Members
INSERT INTO about_page_team (name, role, image_url, sort_order) VALUES
('Farhan Ali', 'Professional SEO Expert', 'hero.png', 0),
('Osman', 'Saas App Developer', 'osman.png', 1),
('Fareed Ahmed', 'Off-Page SEO Specialist', 'fareed.png', 2),
('Neha Naz', 'Support Assistant', 'maria.png', 3),
('Ayesha Zulfiqar', 'Web Developer', 'ayesha.png', 4),
('Maria', 'Content Writer', 'maria.png', 5);

-- Achievements
INSERT INTO about_page_achievements (icon, value, label, sort_order) VALUES
('fi', 'Top Rated', 'Top Rated on Fiverr', 0),
('★', '4.9/5', '4.9/5 Overall Rating', 1),
('150+', '150+', '150+ Projects Complete', 2);
