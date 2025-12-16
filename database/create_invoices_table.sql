-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  catering_request_id UUID REFERENCES catering_requests(id) ON DELETE CASCADE,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  event_date DATE,
  event_time TIME,
  event_location TEXT,
  number_of_guests INTEGER,
  
  -- Invoice items (JSON array of {name, quantity, unit_price, total})
  invoice_items JSONB NOT NULL DEFAULT '[]',
  
  -- Financial details
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax_rate DECIMAL(5,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  
  -- Invoice details
  notes TEXT,
  terms_conditions TEXT,
  due_date DATE,
  
  -- Status tracking
  status VARCHAR(50) DEFAULT 'draft', -- draft, sent, paid, overdue, cancelled
  sent_at TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_invoices_catering_request_id ON invoices(catering_request_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);

-- Create function to generate invoice numbers
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
  next_number INTEGER;
  invoice_number TEXT;
BEGIN
  -- Get the next invoice number (starting from 1001)
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 4) AS INTEGER)), 1000) + 1
  INTO next_number
  FROM invoices
  WHERE invoice_number ~ '^INV[0-9]+$';
  
  invoice_number := 'INV' || next_number::TEXT;
  
  RETURN invoice_number;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate invoice numbers
CREATE OR REPLACE FUNCTION set_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
    NEW.invoice_number := generate_invoice_number();
  END IF;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_invoice_number
  BEFORE INSERT OR UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION set_invoice_number();