-- Add missing customer_email column to reviews table
ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS customer_email TEXT;

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';
