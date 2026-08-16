-- Add icon_url column to navbar_items if it doesn't exist
ALTER TABLE navbar_items ADD COLUMN IF NOT EXISTS icon_url TEXT;
