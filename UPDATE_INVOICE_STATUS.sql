-- Add in_progress status to existing invoices table
ALTER TABLE invoices DROP CONSTRAINT IF EXISTS invoices_status_check;
ALTER TABLE invoices ADD CONSTRAINT invoices_status_check 
  CHECK (status IN ('draft', 'in_progress', 'sent', 'paid', 'overdue', 'cancelled'));

-- Function to track status changes
CREATE OR REPLACE FUNCTION track_invoice_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO invoice_status_history (invoice_id, old_status, new_status, changed_by)
        VALUES (NEW.id, OLD.status, NEW.status, 'admin');
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS track_invoice_status_changes ON invoices;

-- Create trigger for status changes
CREATE TRIGGER track_invoice_status_changes AFTER UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION track_invoice_status_change();