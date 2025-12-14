-- Add new columns to orders table for complete checkout information
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_address TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_city TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_postcode TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_country TEXT DEFAULT 'United Kingdom';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_notes TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS allergies TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS subtotal_amount DECIMAL(10,2);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10,2) DEFAULT 20.00;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_items TEXT; -- JSON string of items
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_intent_id TEXT;

-- Add delivery fee setting to site_settings table
INSERT INTO site_settings (setting_key, setting_value, description) 
VALUES ('delivery_fee', '20.00', 'Delivery fee per order (£)') 
ON CONFLICT (setting_key) DO NOTHING;

-- Update existing orders to have delivery fee if null
UPDATE orders SET delivery_fee = 20.00 WHERE delivery_fee IS NULL;
UPDATE orders SET subtotal_amount = total_amount - COALESCE(delivery_fee, 20.00) WHERE subtotal_amount IS NULL;