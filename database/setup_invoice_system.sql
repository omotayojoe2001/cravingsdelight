-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  catering_request_id UUID REFERENCES catering_requests(id) ON DELETE CASCADE,
  invoice_number VARCHAR(50) UNIQUE NOT NULL DEFAULT '',
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
  
  -- Payment method fields
  payment_method VARCHAR(50) DEFAULT 'bank_transfer',
  payment_link TEXT,
  bank_details JSONB DEFAULT '{}',
  paypal_email VARCHAR(255),
  
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

-- Create payment_settings table for admin configuration
CREATE TABLE IF NOT EXISTS payment_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  method_type VARCHAR(50) UNIQUE NOT NULL, -- 'bank_transfer', 'paypal', 'stripe'
  is_active BOOLEAN DEFAULT true,
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_invoices_catering_request_id ON invoices(catering_request_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_payment_settings_method_type ON payment_settings(method_type);

-- Create function to generate invoice numbers
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
  next_number INTEGER;
  new_invoice_number TEXT;
BEGIN
  -- Get the next invoice number (starting from 1001)
  SELECT COALESCE(MAX(CAST(SUBSTRING(i.invoice_number FROM 4) AS INTEGER)), 1000) + 1
  INTO next_number
  FROM invoices i
  WHERE i.invoice_number ~ '^INV[0-9]+$';
  
  new_invoice_number := 'INV' || next_number::TEXT;
  
  RETURN new_invoice_number;
END;
$$ LANGUAGE plpgsql;

-- Create trigger function to auto-generate invoice numbers
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

-- Create trigger
DROP TRIGGER IF EXISTS trigger_set_invoice_number ON invoices;
CREATE TRIGGER trigger_set_invoice_number
  BEFORE INSERT OR UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION set_invoice_number();

-- Insert default payment methods (use ON CONFLICT to avoid duplicates)
INSERT INTO payment_settings (method_type, settings) VALUES 
('bank_transfer', '{"account_name": "Cravings Delight Ltd", "account_number": "", "sort_code": "", "bank_name": "", "iban": "", "swift": ""}'),
('paypal', '{"email": "", "business_name": "Cravings Delight"}'),
('stripe', '{"publishable_key": "", "webhook_endpoint": ""}')
ON CONFLICT (method_type) DO NOTHING;