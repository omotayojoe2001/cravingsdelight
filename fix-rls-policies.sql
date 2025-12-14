-- Fix RLS Policies to Allow Public Inserts
-- Run this in Supabase SQL Editor

-- 1. Orders table - Allow public to insert orders
DROP POLICY IF EXISTS "Allow public insert orders" ON orders;
CREATE POLICY "Allow public insert orders" 
ON orders FOR INSERT TO anon 
WITH CHECK (true);

-- 2. Order items table - Allow public to insert order items
DROP POLICY IF EXISTS "Allow public insert order items" ON order_items;
CREATE POLICY "Allow public insert order items" 
ON order_items FOR INSERT TO anon 
WITH CHECK (true);

-- 3. Catering requests - Allow public to insert
DROP POLICY IF EXISTS "Allow public insert catering" ON catering_requests;
CREATE POLICY "Allow public insert catering" 
ON catering_requests FOR INSERT TO anon 
WITH CHECK (true);

-- 4. Reviews - Allow public to insert
DROP POLICY IF EXISTS "Allow public insert reviews" ON reviews;
CREATE POLICY "Allow public insert reviews" 
ON reviews FOR INSERT TO anon 
WITH CHECK (true);

-- 5. Page views - Already exists but verify
DROP POLICY IF EXISTS "Allow public insert page views" ON page_views;
CREATE POLICY "Allow public insert page views" 
ON page_views FOR INSERT TO anon 
WITH CHECK (true);

-- 6. Allow admin (authenticated users) to read everything
DROP POLICY IF EXISTS "Allow admin read orders" ON orders;
CREATE POLICY "Allow admin read orders" 
ON orders FOR SELECT TO authenticated 
USING (true);

DROP POLICY IF EXISTS "Allow admin update orders" ON orders;
CREATE POLICY "Allow admin update orders" 
ON orders FOR UPDATE TO authenticated 
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin read order_items" ON order_items;
CREATE POLICY "Allow admin read order_items" 
ON order_items FOR SELECT TO authenticated 
USING (true);

DROP POLICY IF EXISTS "Allow admin read catering" ON catering_requests;
CREATE POLICY "Allow admin read catering" 
ON catering_requests FOR SELECT TO authenticated 
USING (true);

DROP POLICY IF EXISTS "Allow admin update catering" ON catering_requests;
CREATE POLICY "Allow admin update catering" 
ON catering_requests FOR UPDATE TO authenticated 
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin read reviews" ON reviews;
CREATE POLICY "Allow admin read reviews" 
ON reviews FOR SELECT TO authenticated 
USING (true);

DROP POLICY IF EXISTS "Allow admin update reviews" ON reviews;
CREATE POLICY "Allow admin update reviews" 
ON reviews FOR UPDATE TO authenticated 
USING (true) WITH CHECK (true);

-- Verify all tables have RLS enabled
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE catering_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
