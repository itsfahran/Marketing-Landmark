-- Update Team Members with Supabase CDN URLs
DELETE FROM about_page_team;

INSERT INTO about_page_team (name, role, image_url, sort_order) VALUES
('Farhan Ali', 'Professional SEO Expert', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/team/hero.png', 0),
('Osman', 'Saas App Developer', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/team/osman.png', 1),
('Fareed Ahmed', 'Off-Page SEO Specialist', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/team/fareed.png', 2),
('Neha Naz', 'Support Assistant', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/team/maria.png', 3),
('Ayesha Zulfiqar', 'Web Developer', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/team/ayesha.png', 4),
('Maria', 'Content Writer', 'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/team/maria.png', 5);