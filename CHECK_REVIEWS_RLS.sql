-- Check if reviews table exists and has correct columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'reviews';

-- Check existing RLS policies on reviews table
SELECT * FROM pg_policies WHERE tablename = 'reviews';

-- If reviews are not saving, run this to fix RLS:
-- Make sure public can INSERT reviews
DROP POLICY IF EXISTS "public_insert_reviews" ON reviews;
CREATE POLICY "public_insert_reviews" ON reviews FOR INSERT TO anon WITH CHECK (true);

-- Make sure public can READ approved reviews
DROP POLICY IF EXISTS "public_read_approved_reviews" ON reviews;
CREATE POLICY "public_read_approved_reviews" ON reviews FOR SELECT TO anon USING (is_approved = true);

-- Make sure admin can do everything
DROP POLICY IF EXISTS "admin_all_reviews" ON reviews;
CREATE POLICY "admin_all_reviews" ON reviews FOR ALL TO authenticated USING (true) WITH CHECK (true);
