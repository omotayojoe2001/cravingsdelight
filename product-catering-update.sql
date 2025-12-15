-- Add product_id to catering_requests table to track which product the request is for
ALTER TABLE catering_requests ADD COLUMN IF NOT EXISTS product_id VARCHAR(255);
ALTER TABLE catering_requests ADD COLUMN IF NOT EXISTS product_name VARCHAR(255);