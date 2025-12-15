-- Update catering_requests table for comprehensive booking
ALTER TABLE catering_requests ADD COLUMN IF NOT EXISTS selected_products TEXT; -- JSON array of selected products with quantities and sizes
ALTER TABLE catering_requests ADD COLUMN IF NOT EXISTS total_estimated_guests INTEGER;
ALTER TABLE catering_requests ADD COLUMN IF NOT EXISTS event_type VARCHAR(100);
ALTER TABLE catering_requests ADD COLUMN IF NOT EXISTS budget_range VARCHAR(50);
ALTER TABLE catering_requests ADD COLUMN IF NOT EXISTS additional_services TEXT;