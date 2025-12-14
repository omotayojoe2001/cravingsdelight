-- Add event_time column to catering_requests table
ALTER TABLE catering_requests 
ADD COLUMN IF NOT EXISTS event_time TEXT;

-- Update existing records to have NULL for event_time (optional)
-- This is already the default, but included for clarity
