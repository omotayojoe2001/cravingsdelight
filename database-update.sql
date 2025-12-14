-- Add Missing Tables Only
-- Run this if you already have orders, catering_requests, reviews tables

-- 1. Products Table (if doesn't exist)
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  sizes JSONB,
  category TEXT NOT NULL CHECK (category IN ('rice', 'soup', 'sides', 'special')),
  image TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add missing columns to existing orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_notes TEXT;

-- 3. Order Items Table (if doesn't exist)
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  size_selected TEXT,
  spice_level TEXT CHECK (spice_level IN ('Mild', 'Medium', 'Hot')),
  customization_note TEXT,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Add missing columns to catering_requests
ALTER TABLE catering_requests ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- 5. Add missing columns to reviews
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- 6. Page Views Table (if doesn't exist)
CREATE TABLE IF NOT EXISTS page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Site Settings Table (if doesn't exist)
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  setting_type TEXT DEFAULT 'text',
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default site settings (only if not exists)
INSERT INTO site_settings (setting_key, setting_value, setting_type, description) 
VALUES
('contact_email', 'cravingsdelight2025@gmail.com', 'email', 'Contact email address'),
('instagram_handle', '@cravings_delighthull', 'text', 'Instagram handle'),
('instagram_url', 'https://instagram.com/cravings_delighthull', 'url', 'Instagram profile URL'),
('whatsapp_number', '447123456789', 'phone', 'WhatsApp contact number'),
('business_location', 'Hull, United Kingdom', 'text', 'Business location'),
('order_processing_time', '3-5 WORKING DAYS AFTER PAYMENT', 'text', 'Order processing time message'),
('shipping_note', 'Once order is placed please give 4-5 working days for orders to be processed and shipped', 'text', 'Shipping information')
ON CONFLICT (setting_key) DO NOTHING;

-- 8. Enable RLS on new tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- 9. Drop existing policies if they exist and recreate
DROP POLICY IF EXISTS "Allow public read products" ON products;
DROP POLICY IF EXISTS "Allow public read approved reviews" ON reviews;
DROP POLICY IF EXISTS "Allow public read settings" ON site_settings;
DROP POLICY IF EXISTS "Allow public insert order items" ON order_items;
DROP POLICY IF EXISTS "Allow public insert page views" ON page_views;

-- 10. Create new policies
CREATE POLICY "Allow public read products" ON products FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "Allow public read approved reviews" ON reviews FOR SELECT TO anon USING (is_approved = true);
CREATE POLICY "Allow public read settings" ON site_settings FOR SELECT TO anon USING (true);
CREATE POLICY "Allow public insert order items" ON order_items FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public insert page views" ON page_views FOR INSERT TO anon WITH CHECK (true);

-- 11. Admin policies for new tables
CREATE POLICY "Allow admin full access products" ON products FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin full access order items" ON order_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin read page views" ON page_views FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow admin full access settings" ON site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 12. Create indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_catering_status ON catering_requests(status);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_page_views_viewed_at ON page_views(viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_page_path ON page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(setting_key);
