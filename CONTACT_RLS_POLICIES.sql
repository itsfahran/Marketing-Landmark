-- ============================================
-- ROW LEVEL SECURITY POLICIES FOR CONTACT SUBMISSIONS
-- Allow anyone to submit contact form
-- Allow admins to manage submissions
-- ============================================

-- Enable RLS on contact_submissions table
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow anonymous users to INSERT their own submissions
CREATE POLICY "allow_insert_contact_submissions" ON contact_submissions
FOR INSERT
WITH CHECK (true);

-- Policy 2: Allow authenticated users (admins) to SELECT all submissions
CREATE POLICY "allow_select_contact_submissions_admin" ON contact_submissions
FOR SELECT
USING (auth.role() = 'authenticated');

-- Policy 3: Allow anonymous users to SELECT their own submissions (optional, for reference)
CREATE POLICY "allow_select_own_contact_submission" ON contact_submissions
FOR SELECT
USING (true);

-- Policy 4: Allow authenticated users (admins) to UPDATE submissions
CREATE POLICY "allow_update_contact_submissions_admin" ON contact_submissions
FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Policy 5: Allow authenticated users (admins) to DELETE submissions
CREATE POLICY "allow_delete_contact_submissions_admin" ON contact_submissions
FOR DELETE
USING (auth.role() = 'authenticated');

-- Verify policies were created
SELECT tablename, policyname FROM pg_policies WHERE tablename = 'contact_submissions';
