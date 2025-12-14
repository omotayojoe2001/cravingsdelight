-- Add catering availability to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS available_for_catering BOOLEAN DEFAULT false;

-- Update existing products to be available for catering (you can modify this as needed)
UPDATE products SET available_for_catering = true WHERE category IN ('rice', 'soup', 'sides', 'special');