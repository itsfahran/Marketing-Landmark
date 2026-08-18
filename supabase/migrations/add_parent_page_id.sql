-- Add parent_page_id column to pages table for hierarchical navigation
ALTER TABLE pages
ADD COLUMN IF NOT EXISTS parent_page_id uuid REFERENCES pages(id) ON DELETE SET NULL;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_pages_parent_page_id ON pages(parent_page_id);

-- Add trigger to update updated_at when parent_page_id changes
CREATE OR REPLACE FUNCTION update_pages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_pages_updated_at ON pages;
CREATE TRIGGER trigger_update_pages_updated_at
BEFORE UPDATE ON pages
FOR EACH ROW
EXECUTE FUNCTION update_pages_updated_at();
