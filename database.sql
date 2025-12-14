-- Cravings Delight Complete Database Schema
-- Run these commands in Supabase SQL Editor

-- 1. Products Table (Menu Items)
CREATE TABLE products (
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

-- 2. Orders Table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  delivery_notes TEXT,
  items JSONB NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  order_status TEXT DEFAULT 'processing',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Order Items Table (Detailed tracking)
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES products(id),
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  size_selected TEXT,
  spice_level TEXT CHECK (spice_level IN ('Mild', 'Medium', 'Hot')),
  customization_note TEXT,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Catering Requests Table
CREATE TABLE catering_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_name TEXT NOT NULL,
  requester_email TEXT NOT NULL,
  requester_phone TEXT NOT NULL,
  event_date DATE,
  event_location TEXT NOT NULL,
  number_of_guests INTEGER NOT NULL,
  requirements TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  response_sent_at TIMESTAMP WITH TIME ZONE
);

-- 5. Reviews Table
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Page Views Table
CREATE TABLE page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Site Settings Table (Editable contact info, social links, etc)
CREATE TABLE site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  setting_type TEXT DEFAULT 'text',
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default site settings
INSERT INTO site_settings (setting_key, setting_value, setting_type, description) VALUES
('contact_email', 'cravingsdelight2025@gmail.com', 'email', 'Contact email address'),
('instagram_handle', '@cravings_delighthull', 'text', 'Instagram handle'),
('instagram_url', 'https://instagram.com/cravings_delighthull', 'url', 'Instagram profile URL'),
('whatsapp_number', '447123456789', 'phone', 'WhatsApp contact number'),
('business_location', 'Hull, United Kingdom', 'text', 'Business location'),
('order_processing_time', '3-5 WORKING DAYS AFTER PAYMENT', 'text', 'Order processing time message'),
('shipping_note', 'Once order is placed please give 4-5 working days for orders to be processed and shipped', 'text', 'Shipping information');

-- 8. Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE catering_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- 9. Public Read Policies
CREATE POLICY "Allow public read products" ON products FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "Allow public read approved reviews" ON reviews FOR SELECT TO anon USING (is_approved = true);
CREATE POLICY "Allow public read settings" ON site_settings FOR SELECT TO anon USING (true);

-- 10. Public Insert Policies
CREATE POLICY "Allow public insert orders" ON orders FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public insert order items" ON order_items FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public insert catering" ON catering_requests FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public insert reviews" ON reviews FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public insert page views" ON page_views FOR INSERT TO anon WITH CHECK (true);

-- 11. Admin Full Access (authenticated users)
CREATE POLICY "Allow admin full access products" ON products FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin full access orders" ON orders FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin full access order items" ON order_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin full access catering" ON catering_requests FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin full access reviews" ON reviews FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin read page views" ON page_views FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow admin full access settings" ON site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 12. Create Indexes
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_catering_submitted_at ON catering_requests(submitted_at DESC);
CREATE INDEX idx_catering_status ON catering_requests(status);
CREATE INDEX idx_reviews_submitted_at ON reviews(submitted_at DESC);
CREATE INDEX idx_reviews_approved ON reviews(is_approved);
CREATE INDEX idx_page_views_viewed_at ON page_views(viewed_at DESC);
CREATE INDEX idx_page_views_page_path ON page_views(page_path);
CREATE INDEX idx_site_settings_key ON site_settings(setting_key);
