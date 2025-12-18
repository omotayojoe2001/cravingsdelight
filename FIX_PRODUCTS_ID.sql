-- Fix products table ID column
ALTER TABLE products 
ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- If the column doesn't exist, create it
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS id UUID PRIMARY KEY DEFAULT gen_random_uuid();