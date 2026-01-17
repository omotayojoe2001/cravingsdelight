-- Fix RLS policies for invoices table
DROP POLICY IF EXISTS "admin_all_invoices" ON invoices;
DROP POLICY IF EXISTS "admin_all_invoice_history" ON invoice_status_history;

-- Create new RLS policies that allow all operations
CREATE POLICY "allow_all_invoices" ON invoices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_invoice_history" ON invoice_status_history FOR ALL USING (true) WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_status_history ENABLE ROW LEVEL SECURITY;