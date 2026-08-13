-- Seed video testimonials data
DELETE FROM video_testimonials;

INSERT INTO video_testimonials (title, subtitle, video_url, caption, profile_image_url, link, sort_order)
VALUES
(
  'Client Success Story - E-Commerce Growth',
  'Amazing Results in 3 Months',
  'https://www.youtube.com/embed/dQw4w9WgXcQ',
  'This client saw 300% increase in organic traffic after implementing our SEO strategy. Their e-commerce store now ranks #1 for their main keywords.',
  'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/team/hero.png',
  'https://example.com/client1',
  0
),
(
  'Local Business Domination',
  'From Zero to Hero in Local Search',
  'https://www.youtube.com/embed/9bZkp7q19f0',
  'Watch how we helped this local service business dominate their market. Now appearing in the top 3 local search results across multiple locations.',
  'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/team/osman.png',
  'https://example.com/client2',
  1
),
(
  'SaaS Platform Growth Strategy',
  'Scaling Through Organic Search',
  'https://www.youtube.com/embed/jNQXAC9IVRw',
  'Learn how our targeted SEO approach helped this SaaS platform achieve 500% growth in qualified leads. Their customer acquisition cost dropped by 60%.',
  'https://hrebuurabqxcvamlrzlt.supabase.co/storage/v1/object/public/portfolio-images/team/fareed.png',
  'https://example.com/client3',
  2
);
