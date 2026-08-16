-- Home Page Video Testimonials Tables
CREATE TABLE IF NOT EXISTS home_video_testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  heading VARCHAR(255) DEFAULT 'Client Video Testimonials',
  description TEXT DEFAULT 'Watch what our satisfied clients have to say about working with us',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS home_video_testimonials_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  video_url TEXT NOT NULL,
  profile_image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_home_video_testimonials_items_sort ON home_video_testimonials_items(sort_order);

-- Insert default meta row
INSERT INTO home_video_testimonials (heading, description)
VALUES (
  'Client Video Testimonials',
  'Watch what our satisfied clients have to say about working with us'
)
ON CONFLICT DO NOTHING;
