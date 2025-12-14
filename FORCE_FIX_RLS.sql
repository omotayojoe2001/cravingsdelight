-- FORCE FIX RLS - Delete ALL policies and recreate
-- This will work even if policies have different names

-- 1. DISABLE RLS temporarily
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE catering_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE page_views DISABLE ROW LEVEL SECURITY;

-- 2. DROP ALL existing policies (ignore errors if they don't exist)
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'orders') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON orders';
    END LOOP;
    
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'order_items') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON order_items';
    END LOOP;
    
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'catering_requests') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON catering_requests';
    END LOOP;
    
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'reviews') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON reviews';
    END LOOP;
    
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'page_views') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON page_views';
    END LOOP;
END $$;

-- 3. RE-ENABLE RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE catering_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- 4. CREATE NEW POLICIES - Public can INSERT
CREATE POLICY "public_insert_orders" ON orders FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "public_insert_order_items" ON order_items FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "public_insert_catering" ON catering_requests FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "public_insert_reviews" ON reviews FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "public_insert_page_views" ON page_views FOR INSERT TO anon WITH CHECK (true);

-- 5. CREATE POLICIES - Admin can do EVERYTHING
CREATE POLICY "admin_all_orders" ON orders FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_order_items" ON order_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_catering" ON catering_requests FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_reviews" ON reviews FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_page_views" ON page_views FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 6. CREATE POLICIES - Public can READ certain things
CREATE POLICY "public_read_products" ON products FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "public_read_settings" ON site_settings FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_approved_reviews" ON reviews FOR SELECT TO anon USING (is_approved = true);

-- Done! Now test by placing an order
