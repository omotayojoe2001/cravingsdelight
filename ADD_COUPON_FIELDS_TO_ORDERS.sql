-- Add coupon fields to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10,2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_code VARCHAR(50);

-- Create index for coupon code lookups
CREATE INDEX IF NOT EXISTS idx_orders_coupon_code ON orders(coupon_code);