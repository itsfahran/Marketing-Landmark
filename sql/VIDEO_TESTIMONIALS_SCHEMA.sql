-- Video Testimonials Component Tables
CREATE TABLE IF NOT EXISTS component_videotestimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  template VARCHAR(50) NOT NULL,
  heading VARCHAR(255),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page_id, template)
);

CREATE TABLE IF NOT EXISTS component_videotestimonials_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  videotestimonials_id UUID NOT NULL REFERENCES component_videotestimonials(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  video_url TEXT NOT NULL,
  profile_image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_component_videotestimonials_page ON component_videotestimonials(page_id);
CREATE INDEX IF NOT EXISTS idx_component_videotestimonials_items_video ON component_videotestimonials_items(videotestimonials_id);
