-- ============================================
-- CONTACT SUBMISSIONS TABLE
-- Create table for form submissions
-- ============================================

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service_interested TEXT,
  budget_range TEXT,
  message TEXT NOT NULL,
  source_page_slug TEXT DEFAULT 'contact',
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_submissions(created_at);

-- Verify table was created
SELECT COUNT(*) as total_submissions FROM contact_submissions;
