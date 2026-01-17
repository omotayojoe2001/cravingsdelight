-- Update products table to allow new categories
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_check;

-- Add new check constraint with all categories
ALTER TABLE products ADD CONSTRAINT products_category_check 
CHECK (category IN (
  'rice',
  'proteins', 
  'vegetables',
  'soup',
  'sides',
  'appetizers',
  'desserts',
  'beverages',
  'seafood',
  'pasta',
  'salads',
  'grains',
  'special'
));